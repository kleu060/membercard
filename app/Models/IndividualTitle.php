<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\IndividualProfile;


class IndividualTitle extends Model
{
    use HasFactory;

    protected $fillable = [
        'individual_profile_id',
        'title',
        'sort',
    ];

    public function individual(): BelongsTo
    {
        return $this->belongsTo(IndividualProfile::class);
    }
    
}
