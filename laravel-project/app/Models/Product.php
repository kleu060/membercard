<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'card_id',
        'name',
        'description',
        'image',
    ];

    /**
     * Get the business card that owns the product.
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'card_id');
    }

    /**
     * Get the photos for the product.
     */
    public function photos()
    {
        return $this->hasMany(ProductPhoto::class);
    }

    /**
     * Get the links for the product.
     */
    public function links()
    {
        return $this->hasMany(ProductLink::class);
    }
}