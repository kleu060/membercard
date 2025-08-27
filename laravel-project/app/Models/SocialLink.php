<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'card_id',
        'platform',
        'url',
        'username',
    ];

    /**
     * Get the business card that owns the social link.
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'card_id');
    }
}