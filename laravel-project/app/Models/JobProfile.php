<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'summary',
        'resume_url',
    ];

    /**
     * Get the user that owns the job profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the career history for the job profile.
     */
    public function careerHistory()
    {
        return $this->hasMany(CareerHistory::class);
    }

    /**
     * Get the education for the job profile.
     */
    public function education()
    {
        return $this->hasMany(Education::class);
    }

    /**
     * Get the certifications for the job profile.
     */
    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }

    /**
     * Get the skills for the job profile.
     */
    public function skills()
    {
        return $this->hasMany(Skill::class);
    }

    /**
     * Get the saved searches for the job profile.
     */
    public function savedSearches()
    {
        return $this->hasMany(SavedSearch::class);
    }

    /**
     * Get the saved jobs for the job profile.
     */
    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }

    /**
     * Get the applications for the job profile.
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}