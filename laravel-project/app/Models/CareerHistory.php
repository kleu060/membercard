<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareerHistory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'title',
        'company',
        'start_date',
        'end_date',
        'is_current',
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
    ];

    /**
     * Get the job profile that owns the career history.
     */
    public function profile()
    {
        return $this->belongsTo(JobProfile::class);
    }
}