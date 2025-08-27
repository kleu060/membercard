<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentAvailability extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'card_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
        'max_appointments',
        'buffer_time',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'day_of_week' => 'integer',
        'is_available' => 'boolean',
        'max_appointments' => 'integer',
        'buffer_time' => 'integer',
    ];

    /**
     * Get the business card that owns the availability.
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'business_card_id');
    }
}