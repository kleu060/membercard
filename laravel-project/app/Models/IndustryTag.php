<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndustryTag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'card_id',
        'tag',
    ];

    /**
     * Get the business card that owns the industry tag.
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'card_id');
    }
}