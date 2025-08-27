<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
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
        'level',
        'years_experience',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'years_experience' => 'integer',
    ];

    /**
     * Get the job profile that owns the skill.
     */
    public function profile()
    {
        return $this->belongsTo(JobProfile::class);
    }
}