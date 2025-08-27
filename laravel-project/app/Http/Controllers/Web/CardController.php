<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessCard;

class CardController extends Controller
{
    /**
     * Show user's cards
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $cards = BusinessCard::where('user_id', $user->id)
                           ->with(['socialLinks', 'products', 'industryTags'])
                           ->latest()
                           ->get();
        
        return view('cards.index', compact('cards'));
    }

    /**
     * Show card creation form
     */
    public function create(Request $request)
    {
        return view('cards.create');
    }

    /**
     * Show card edit form
     */
    public function edit(Request $request, $id)
    {
        $card = BusinessCard::where('user_id', $request->user()->id)
                           ->with(['socialLinks', 'products.photos', 'products.links', 'industryTags'])
                           ->findOrFail($id);
        
        return view('cards.edit', compact('card'));
    }

    /**
     * Show user's card
     */
    public function show(Request $request, $id)
    {
        $card = BusinessCard::where('user_id', $request->user()->id)
                           ->with(['socialLinks', 'products.photos', 'products.links', 'industryTags'])
                           ->findOrFail($id);
        
        return view('cards.show', compact('card'));
    }

    /**
     * Show public card
     */
    public function publicShow($id)
    {
        $card = BusinessCard::where('is_public', true)
                           ->with(['user', 'socialLinks', 'products.photos', 'products.links', 'industryTags'])
                           ->findOrFail($id);
        
        // Increment view count
        $card->increment('view_count');
        
        return view('cards.public', compact('card'));
    }
}