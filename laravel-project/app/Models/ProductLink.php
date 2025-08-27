<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductLink extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'title',
        'url',
    ];

    /**
     * Get the product that owns the link.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}