<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadForm extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'is_active',
        'is_public',
        'embed_code',
        'fields',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'is_public' => 'boolean',
    ];

    /**
     * Get the user that owns the lead form.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the submissions for the lead form.
     */
    public function submissions()
    {
        return $this->hasMany(FormSubmission::class);
    }
}