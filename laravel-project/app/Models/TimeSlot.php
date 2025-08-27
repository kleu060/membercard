<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_settings_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
        'max_bookings',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'day_of_week' => 'integer',
        'is_available' => 'boolean',
        'max_bookings' => 'integer',
    ];

    /**
     * Get the booking settings that owns the time slot.
     */
    public function bookingSettings()
    {
        return $this->belongsTo(BookingSettings::class);
    }
}