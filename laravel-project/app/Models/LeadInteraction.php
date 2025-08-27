<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadInteraction extends Model
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
        'direction',
        'title',
        'description',
        'duration',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'duration' => 'integer',
    ];

    /**
     * Get the lead that owns the interaction.
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the user that created the interaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}