<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingSettings extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'location_type',
        'location_address',
        'online_meeting_link',
        'base_price',
        'currency',
        'duration',
        'max_advance_days',
        'min_advance_hours',
        'cancellation_policy',
        'lunch_break_start',
        'lunch_break_end',
        'mon_enabled',
        'mon_start',
        'mon_end',
        'tue_enabled',
        'tue_start',
        'tue_end',
        'wed_enabled',
        'wed_start',
        'wed_end',
        'thu_enabled',
        'thu_start',
        'thu_end',
        'fri_enabled',
        'fri_start',
        'fri_end',
        'sat_enabled',
        'sat_start',
        'sat_end',
        'sun_enabled',
        'sun_start',
        'sun_end',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'base_price' => 'decimal:2',
        'duration' => 'integer',
        'max_advance_days' => 'integer',
        'min_advance_hours' => 'integer',
        'mon_enabled' => 'boolean',
        'tue_enabled' => 'boolean',
        'wed_enabled' => 'boolean',
        'thu_enabled' => 'boolean',
        'fri_enabled' => 'boolean',
        'sat_enabled' => 'boolean',
        'sun_enabled' => 'boolean',
    ];

    /**
     * Get the user that owns the booking settings.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the time slots for the booking settings.
     */
    public function timeSlots()
    {
        return $this->hasMany(TimeSlot::class);
    }
}