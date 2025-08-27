<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessCard extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'company',
        'position',
        'phone',
        'office_phone',
        'email',
        'address',
        'website',
        'bio',
        'avatar',
        'cover_photo',
        'logo',
        'location',
        'template',
        'is_public',
        'view_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_public' => 'boolean',
        'view_count' => 'integer',
    ];

    /**
     * Get the user that owns the business card.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the social links for the business card.
     */
    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class, 'card_id');
    }

    /**
     * Get the products for the business card.
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'card_id');
    }

    /**
     * Get the industry tags for the business card.
     */
    public function industryTags()
    {
        return $this->hasMany(IndustryTag::class, 'card_id');
    }

    /**
     * Get the saved cards for the business card.
     */
    public function savedCards()
    {
        return $this->hasMany(SavedCard::class, 'card_id');
    }

    /**
     * Get the appointments for the business card.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'business_card_id');
    }

    /**
     * Get the availability for the business card.
     */
    public function availability()
    {
        return $this->hasMany(AppointmentAvailability::class, 'business_card_id');
    }

    /**
     * Get the leads for the business card.
     */
    public function leads()
    {
        return $this->hasMany(Lead::class, 'business_card_id');
    }
}