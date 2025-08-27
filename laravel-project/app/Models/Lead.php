<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
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
        'email',
        'phone',
        'company',
        'position',
        'message',
        'interest',
        'source',
        'status',
        'priority',
        'score',
        'estimated_value',
        'currency',
        'website',
        'linkedin',
        'twitter',
        'address',
        'city',
        'country',
        'tags',
        'notes',
        'last_contact_at',
        'business_card_id',
        'assigned_user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estimated_value' => 'decimal:2',
        'score' => 'integer',
        'last_contact_at' => 'datetime',
    ];

    /**
     * Get the user that owns the lead.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the business card associated with the lead.
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class);
    }

    /**
     * Get the user assigned to the lead.
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * Get the interactions for the lead.
     */
    public function interactions()
    {
        return $this->hasMany(LeadInteraction::class);
    }

    /**
     * Get the activities for the lead.
     */
    public function activities()
    {
        return $this->hasMany(LeadActivity::class);
    }

    /**
     * Get the form submissions for the lead.
     */
    public function formSubmissions()
    {
        return $this->hasMany(FormSubmission::class);
    }

    /**
     * Get the email deliveries for the lead.
     */
    public function emailDeliveries()
    {
        return $this->hasMany(EmailDelivery::class);
    }

    /**
     * Get the segment memberships for the lead.
     */
    public function segmentMemberships()
    {
        return $this->hasMany(LeadSegmentMembership::class);
    }

    /**
     * Get the assignments for the lead.
     */
    public function assignments()
    {
        return $this->hasMany(LeadAssignment::class);
    }

    /**
     * Get the collaborations for the lead.
     */
    public function collaborations()
    {
        return $this->hasMany(TeamCollaboration::class);
    }
}