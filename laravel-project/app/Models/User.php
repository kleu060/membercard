<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'location',
        'role',
        'subscription_plan',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the business cards for the user.
     */
    public function businessCards()
    {
        return $this->hasMany(BusinessCard::class);
    }

    /**
     * Get the saved cards for the user.
     */
    public function savedCards()
    {
        return $this->hasMany(SavedCard::class);
    }

    /**
     * Get the scanned cards for the user.
     */
    public function scannedCards()
    {
        return $this->hasMany(ScannedCard::class);
    }

    /**
     * Get the accounts for the user.
     */
    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Get the active directory configs for the user.
     */
    public function activeDirectoryConfigs()
    {
        return $this->hasMany(ActiveDirectoryConfig::class);
    }

    /**
     * Get the iPhone sync configs for the user.
     */
    public function iPhoneSyncConfigs()
    {
        return $this->hasMany(IPhoneSyncConfig::class);
    }

    /**
     * Get the appointments for the user.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the calendar integrations for the user.
     */
    public function calendarIntegrations()
    {
        return $this->hasMany(CalendarIntegration::class);
    }

    /**
     * Get the job profile for the user.
     */
    public function jobProfile()
    {
        return $this->hasOne(JobProfile::class);
    }

    /**
     * Get the booking settings for the user.
     */
    public function bookingSettings()
    {
        return $this->hasOne(BookingSettings::class);
    }

    /**
     * Get the leads for the user.
     */
    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    /**
     * Get the assigned leads for the user.
     */
    public function assignedLeads()
    {
        return $this->hasMany(Lead::class, 'assigned_user_id');
    }

    /**
     * Get the lead forms for the user.
     */
    public function leadForms()
    {
        return $this->hasMany(LeadForm::class);
    }

    /**
     * Get the lead interactions for the user.
     */
    public function leadInteractions()
    {
        return $this->hasMany(LeadInteraction::class);
    }

    /**
     * Get the lead activities for the user.
     */
    public function leadActivities()
    {
        return $this->hasMany(LeadActivity::class);
    }

    /**
     * Get the email templates for the user.
     */
    public function emailTemplates()
    {
        return $this->hasMany(EmailTemplate::class);
    }

    /**
     * Get the email campaigns for the user.
     */
    public function emailCampaigns()
    {
        return $this->hasMany(EmailCampaign::class);
    }

    /**
     * Get the email automations for the user.
     */
    public function emailAutomations()
    {
        return $this->hasMany(EmailAutomation::class);
    }

    /**
     * Get the lead segments for the user.
     */
    public function leadSegments()
    {
        return $this->hasMany(LeadSegment::class);
    }

    /**
     * Get the teams led by the user.
     */
    public function ledTeams()
    {
        return $this->hasMany(Team::class, 'leader_id');
    }

    /**
     * Get the team memberships for the user.
     */
    public function teamMemberships()
    {
        return $this->hasMany(TeamMember::class);
    }

    /**
     * Get the lead assignments for the user.
     */
    public function leadAssignments()
    {
        return $this->hasMany(LeadAssignment::class, 'user_id');
    }

    /**
     * Get the assigned leads by the user.
     */
    public function assignedLeads2()
    {
        return $this->hasMany(LeadAssignment::class, 'assigned_by');
    }

    /**
     * Get the team collaborations for the user.
     */
    public function teamCollaborations()
    {
        return $this->hasMany(TeamCollaboration::class);
    }

    /**
     * Get the mobile devices for the user.
     */
    public function mobileDevices()
    {
        return $this->hasMany(MobileDevice::class);
    }

    /**
     * Get the push notifications for the user.
     */
    public function pushNotifications()
    {
        return $this->hasMany(PushNotification::class);
    }

    /**
     * Get the offline syncs for the user.
     */
    public function offlineSyncs()
    {
        return $this->hasMany(OfflineSync::class);
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}