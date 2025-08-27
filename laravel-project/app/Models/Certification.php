<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
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
        'issuer',
        'issue_date',
        'expiry_date',
        'credential_number',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'issue_date' => 'datetime',
        'expiry_date' => 'datetime',
    ];

    /**
     * Get the job profile that owns the certification.
     */
    public function profile()
    {
        return $this->belongsTo(JobProfile::class);
    }
}