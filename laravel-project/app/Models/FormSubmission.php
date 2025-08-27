<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'form_id',
        'lead_id',
        'data',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the form that owns the submission.
     */
    public function form()
    {
        return $this->belongsTo(LeadForm::class);
    }

    /**
     * Get the lead associated with the submission.
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}