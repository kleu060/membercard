<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\Individual;

class Organization extends Model
{
    use CrudTrait;
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone_no',
        'email_address',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'country',
        'image_file'
    ];

    /**
     * Get the individual of an organisation.
     */
    public function individual(): HasMany
    {
        return $this->hasMany(Individual::class);
    }

    public function user(): MorphMany
    {
        return $this->morphMany('User', 'relationship');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }

}
