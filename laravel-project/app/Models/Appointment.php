<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'card_id',
        'user_id',
        'title',
        'description',
        'appointment_date',
        'duration',
        'status',
        'contact_name',
        'contact_email',
        'contact_phone',
        'notes',
        'calendar_event_id',
        'calendar_integration_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'appointment_date' => 'datetime',
        'duration' => 'integer',
    ];

    /**
     * Get the business card that owns the appointment.
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'business_card_id');
    }

    /**
     * Get the user that made the appointment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the calendar integration associated with the appointment.
     */
    public function calendarIntegration()
    {
        return $this->belongsTo(CalendarIntegration::class);
    }
}