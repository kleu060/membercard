<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Individual;


class IndividualTitle extends Model
{
    use HasFactory;

    protected $fillable = [
        'individual_id',
        'title',
    ];

    public function individual(): BelongsTo
    {
        return $this->belongsTo(Individual::class);
    }
}
