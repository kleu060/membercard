<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentAvailability;
use App\Models\BusinessCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Appointment::query();

        // If user is not admin, only show their appointments or appointments for their cards
        if (!$user->isAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereHas('businessCard', function ($cardQuery) use ($user) {
                      $cardQuery->where('user_id', $user->id);
                  });
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('appointment_date', [
                $request->start_date,
                $request->end_date
            ]);
        }

        // Filter by card
        if ($request->has('card_id')) {
            $query->where('card_id', $request->card_id);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('contact_name', 'like', "%{$search}%")
                  ->orWhere('contact_email', 'like', "%{$search}%");
            });
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'appointment_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $appointments = $query->with(['user', 'businessCard', 'calendarIntegration'])
                              ->paginate($perPage);

        return response()->json($appointments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'card_id' => 'required|exists:business_cards,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'appointment_date' => 'required|date|after:now',
            'duration' => 'required|integer|min:15|max:480',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the user can book this appointment
        $card = BusinessCard::findOrFail($request->card_id);
        $this->authorize('manage-appointments', null, $card);

        // Check availability
        $appointmentDate = Carbon::parse($request->appointment_date);
        $dayOfWeek = $appointmentDate->dayOfWeek;
        $startTime = $appointmentDate->format('H:i');
        $endTime = $appointmentDate->addMinutes($request->duration)->format('H:i');

        $availability = AppointmentAvailability::where('card_id', $request->card_id)
                                              ->where('day_of_week', $dayOfWeek)
                                              ->where('is_available', true)
                                              ->where('start_time', '<=', $startTime)
                                              ->where('end_time', '>=', $endTime)
                                              ->first();

        if (!$availability) {
            return response()->json(['message' => 'Time slot not available'], 400);
        }

        // Check for conflicts
        $conflicts = Appointment::where('card_id', $request->card_id)
                                ->where('status', '!=', 'cancelled')
                                ->where(function ($q) use ($request, $appointmentDate) {
                                    $start = $appointmentDate->copy();
                                    $end = $start->copy()->addMinutes($request->duration);
                                    $q->where(function ($inner) use ($start, $end) {
                                        $inner->whereBetween('appointment_date', [$start, $end])
                                              ->orWhere(function ($conflict) use ($start, $end) {
                                                  $conflict->where('appointment_date', '<=', $start)
                                                           ->whereRaw('datetime(appointment_date, "+" || duration || " minutes") > ?', [$start]);
                                              });
                                    });
                                })
                                ->exists();

        if ($conflicts) {
            return response()->json(['message' => 'Time slot conflicts with existing appointment'], 400);
        }

        $appointment = Appointment::create([
            'card_id' => $request->card_id,
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'appointment_date' => $request->appointment_date,
            'duration' => $request->duration,
            'status' => 'pending',
            'contact_name' => $request->contact_name,
            'contact_email' => $request->contact_email,
            'contact_phone' => $request->contact_phone,
            'notes' => $request->notes,
        ]);

        $appointment->load(['user', 'businessCard', 'calendarIntegration']);

        return response()->json($appointment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $appointment = Appointment::with(['user', 'businessCard', 'calendarIntegration'])
                                   ->findOrFail($id);

        // Authorization check
        $this->authorize('manage-appointments', $appointment);

        return response()->json($appointment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        // Authorization check
        $this->authorize('manage-appointments', $appointment);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'appointment_date' => 'required|date',
            'duration' => 'required|integer|min:15|max:480',
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // If changing date/time, check availability again
        if ($appointment->appointment_date != $request->appointment_date || 
            $appointment->duration != $request->duration) {
            
            $appointmentDate = Carbon::parse($request->appointment_date);
            $dayOfWeek = $appointmentDate->dayOfWeek;
            $startTime = $appointmentDate->format('H:i');
            $endTime = $appointmentDate->addMinutes($request->duration)->format('H:i');

            $availability = AppointmentAvailability::where('card_id', $appointment->card_id)
                                                  ->where('day_of_week', $dayOfWeek)
                                                  ->where('is_available', true)
                                                  ->where('start_time', '<=', $startTime)
                                                  ->where('end_time', '>=', $endTime)
                                                  ->first();

            if (!$availability) {
                return response()->json(['message' => 'Time slot not available'], 400);
            }

            // Check for conflicts (excluding current appointment)
            $conflicts = Appointment::where('card_id', $appointment->card_id)
                                    ->where('id', '!=', $appointment->id)
                                    ->where('status', '!=', 'cancelled')
                                    ->where(function ($q) use ($request, $appointmentDate) {
                                        $start = $appointmentDate->copy();
                                        $end = $start->copy()->addMinutes($request->duration);
                                        $q->where(function ($inner) use ($start, $end) {
                                            $inner->whereBetween('appointment_date', [$start, $end])
                                                  ->orWhere(function ($conflict) use ($start, $end) {
                                                      $conflict->where('appointment_date', '<=', $start)
                                                               ->whereRaw('datetime(appointment_date, "+" || duration || " minutes") > ?', [$start]);
                                                  });
                                        });
                                    })
                                    ->exists();

            if ($conflicts) {
                return response()->json(['message' => 'Time slot conflicts with existing appointment'], 400);
            }
        }

        $appointment->update($request->only([
            'title', 'description', 'appointment_date', 'duration', 'status',
            'contact_name', 'contact_email', 'contact_phone', 'notes'
        ]));

        $appointment->load(['user', 'businessCard', 'calendarIntegration']);

        return response()->json($appointment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);

        // Authorization check
        $this->authorize('manage-appointments', $appointment);

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }

    /**
     * Get availability for a business card.
     */
    public function getAvailability($cardId)
    {
        $card = BusinessCard::findOrFail($cardId);
        
        // Check if user can view this card's availability
        $this->authorize('manage-cards', $card);

        $availability = AppointmentAvailability::where('card_id', $cardId)
                                               ->where('is_available', true)
                                               ->orderBy('day_of_week')
                                               ->orderBy('start_time')
                                               ->get();

        return response()->json($availability);
    }

    /**
     * Get available time slots for a specific date.
     */
    public function getAvailableSlots(Request $request, $cardId)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $card = BusinessCard::findOrFail($cardId);
        $this->authorize('manage-cards', $card);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek;

        // Get availability for the day
        $availability = AppointmentAvailability::where('card_id', $cardId)
                                               ->where('day_of_week', $dayOfWeek)
                                               ->where('is_available', true)
                                               ->get();

        $availableSlots = [];

        foreach ($availability as $slot) {
            $startTime = Carbon::parse($slot->start_time);
            $endTime = Carbon::parse($slot->end_time);
            
            // Generate 30-minute slots
            while ($startTime->lt($endTime)) {
                $slotEnd = $startTime->copy()->addMinutes(30);
                
                if ($slotEnd->lte($endTime)) {
                    // Check if slot is available (no conflicts)
                    $isAvailable = !Appointment::where('card_id', $cardId)
                                              ->where('status', '!=', 'cancelled')
                                              ->whereDate('appointment_date', $date)
                                              ->whereTime('appointment_date', '<=', $slotEnd)
                                              ->whereRaw('datetime(appointment_date, "+" || duration || " minutes") > ?', [$startTime])
                                              ->exists();

                    if ($isAvailable) {
                        $availableSlots[] = [
                            'start_time' => $startTime->format('H:i'),
                            'end_time' => $slotEnd->format('H:i'),
                        ];
                    }
                }
                
                $startTime->addMinutes(30);
            }
        }

        return response()->json($availableSlots);
    }
}