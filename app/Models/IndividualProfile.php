<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;


use App\Models\Individual;
use App\Models\IndividualTitle;
use App\Models\IndividualContact;
use App\Models\Image;


class IndividualProfile extends Model
{
    use CrudTrait;
    use HasFactory;

    protected $fillable = [
        'profile_name',
        'individual_id',
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
        'image_file',
        'is_default',
        // 'image_id'
    ];

    public function individual(): BelongsTo
    {
        return $this->belongsTo(Individual::class);
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }

    /**
     * Get the individual title of an individual.
     */
    public function individualTitles(): HasMany
    {
        return $this->hasMany(IndividualTitle::class);
    }

    /**
     * Get the individual title of an individual.
     */
    public function individualContacts(): HasMany
    {
        return $this->hasMany(IndividualContact::class);
    }



}
