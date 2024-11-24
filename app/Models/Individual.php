<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


use App\Models\Organization;
use App\Models\IndividualTitle;
use App\Models\IndividualProfile;


class Individual extends Model
{
    use CrudTrait;
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'first_name',
        'last_name',
        'description',
        'route',
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
    public function individualProfiles(): HasMany
    {
        return $this->hasMany(IndividualProfile::class);
    }

    public function profileButton() {
        return '<a href="'.backpack_url('individual-profile') .'/?individual_id='.$this->id.'" class="btn btn-sm btn-link" bp-button="individual-profile" data-style="zoom-in">
                    <i class="la la-credit-card"></i> <span>Profiles</span>
                </a>';
    }

}
