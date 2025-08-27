<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactTag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'saved_card_id',
        'tag',
        'color',
    ];

    /**
     * Get the saved card that owns the tag.
     */
    public function savedCard()
    {
        return $this->belongsTo(SavedCard::class);
    }
}