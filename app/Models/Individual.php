<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


use App\Models\Organization;
use App\Models\IndividualTitle;


class Individual extends Model
{
    use CrudTrait;
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'first_name',
        'last_name',
        'description',
        'DOB',
        'phone_no',
        'email_address',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'zip_code',
        'country',
        'image_id'
    ];

    public function user(): MorphMany
    {
        return $this->morphMany('User', 'relationship');
    }

    /**
     * Get the organization that individual belongs to
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }


    /**
     * Get the individual title of an individual.
     */
    public function individualTitle(): HasMany
    {
        return $this->hasMany(IndividualTitle::class);
    }


}
