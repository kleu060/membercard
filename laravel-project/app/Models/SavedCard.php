<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedCard extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'card_id',
        'notes',
    ];

    /**
     * Get the user that owns the saved card.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the business card that is saved.
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'card_id');
    }

    /**
     * Get the tags for the saved card.
     */
    public function tags()
    {
        return $this->hasMany(ContactTag::class);
    }
}