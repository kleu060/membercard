<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'institution',
        'degree',
        'field',
        'start_date',
        'end_date',
        'is_current',
        'gpa',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_current' => 'boolean',
        'gpa' => 'float',
    ];

    /**
     * Get the job profile that owns the education.
     */
    public function profile()
    {
        return $this->belongsTo(JobProfile::class);
    }
}