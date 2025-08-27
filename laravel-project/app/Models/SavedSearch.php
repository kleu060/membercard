<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedSearch extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'name',
        'keywords',
        'industry',
        'location',
        'job_type',
        'remote_option',
        'salary_range',
    ];

    /**
     * Get the job profile that owns the saved search.
     */
    public function profile()
    {
        return $this->belongsTo(JobProfile::class);
    }
}