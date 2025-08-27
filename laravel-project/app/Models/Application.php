<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
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
        'status',
        'notes',
        'applied_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'applied_at' => 'datetime',
    ];

    /**
     * Get the job profile that owns the application.
     */
    public function profile()
    {
        return $this->belongsTo(JobProfile::class);
    }
}