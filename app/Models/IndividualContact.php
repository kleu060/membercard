<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\IndividualProfile;
use App\Models\ContactType;

use Illuminate\Database\Eloquent\Relations\BelongsTo;



class IndividualContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'individual_profile_id',
        'contact_type_id',
        'contact_value',
        'sort',
    ];

    public function individual(): BelongsTo
    {
        return $this->belongsTo(IndividualProfile::class);
    }

    public function contactType(): BelongsTo
    {
        return $this->belongsTo(ContactType::class);
    }
    
}
