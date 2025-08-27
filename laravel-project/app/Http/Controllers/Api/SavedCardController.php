<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedCard;
use App\Models\ContactTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SavedCardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = SavedCard::where('user_id', $user->id);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('notes', 'like', "%{$search}%")
                  ->orWhereHas('businessCard', function ($cardQuery) use ($search) {
                      $cardQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('company', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by tags
        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tag', $request->tag);
            });
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $savedCards = $query->with(['businessCard.user', 'businessCard.socialLinks', 'tags'])
                           ->paginate($perPage);

        return response()->json($savedCards);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'card_id' => 'required|exists:business_cards,id',
            'notes' => 'nullable|string|max:1000',
            'tags' => 'nullable|array',
            'tags.*.tag' => 'required|string|max:50',
            'tags.*.color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if card is already saved
        $existing = SavedCard::where('user_id', $request->user()->id)
                             ->where('card_id', $request->card_id)
                             ->first();

        if ($existing) {
            return response()->json(['message' => 'Card is already saved'], 409);
        }

        $savedCard = SavedCard::create([
            'user_id' => $request->user()->id,
            'card_id' => $request->card_id,
            'notes' => $request->notes,
        ]);

        // Handle tags
        if ($request->has('tags')) {
            foreach ($request->tags as $tagData) {
                $savedCard->tags()->create($tagData);
            }
        }

        $savedCard->load(['businessCard.user', 'businessCard.socialLinks', 'tags']);

        return response()->json($savedCard, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($cardId)
    {
        $savedCard = SavedCard::where('user_id', $request->user()->id)
                             ->where('card_id', $cardId)
                             ->firstOrFail();

        $savedCard->delete();

        return response()->json(['message' => 'Saved card removed successfully']);
    }

    /**
     * Get tags for a saved card.
     */
    public function getTags($cardId)
    {
        $savedCard = SavedCard::where('user_id', $request->user()->id)
                             ->where('card_id', $cardId)
                             ->firstOrFail();

        $tags = $savedCard->tags;
        return response()->json($tags);
    }

    /**
     * Add a tag to a saved card.
     */
    public function addTag(Request $request, $cardId)
    {
        $validator = Validator::make($request->all(), [
            'tag' => 'required|string|max:50',
            'color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $savedCard = SavedCard::where('user_id', $request->user()->id)
                             ->where('card_id', $cardId)
                             ->firstOrFail();

        // Check if tag already exists
        $existingTag = $savedCard->tags()->where('tag', $request->tag)->first();
        if ($existingTag) {
            return response()->json(['message' => 'Tag already exists'], 409);
        }

        $tag = $savedCard->tags()->create($request->only(['tag', 'color']));

        return response()->json($tag, 201);
    }

    /**
     * Remove a tag from a saved card.
     */
    public function removeTag($cardId, $tagId)
    {
        $savedCard = SavedCard::where('user_id', $request->user()->id)
                             ->where('card_id', $cardId)
                             ->firstOrFail();

        $tag = $savedCard->tags()->findOrFail($tagId);
        $tag->delete();

        return response()->json(['message' => 'Tag removed successfully']);
    }

    /**
     * Get all tags for the user.
     */
    public function getUserTags()
    {
        $user = $request->user();
        $tags = ContactTag::whereHas('savedCard', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->distinct()->get(['tag', 'color']);

        return response()->json($tags);
    }
}