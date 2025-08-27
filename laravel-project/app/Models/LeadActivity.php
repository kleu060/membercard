<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadActivity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'lead_id',
        'type',
        'title',
        'description',
        'user_id',
    ];

    /**
     * Get the lead that owns the activity.
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the user that created the activity.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}