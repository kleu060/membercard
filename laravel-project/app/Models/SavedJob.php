<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedJob extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'job_id',
        'notes',
    ];

    /**
     * Get the job profile that owns the saved job.
     */
    public function profile()
    {
        return $this->belongsTo(JobProfile::class);
    }
}