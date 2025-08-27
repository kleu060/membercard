<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessCard;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarketplaceController extends Controller
{
    /**
     * Display a listing of public business cards.
     */
    public function index(Request $request)
    {
        $query = BusinessCard::where('is_public', true);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        // Filter by industry
        if ($request->has('industry')) {
            $query->whereHas('industryTags', function ($q) use ($request) {
                $q->where('tag', $request->industry);
            });
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter by template
        if ($request->has('template')) {
            $query->where('template', $request->template);
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'view_count');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $cards = $query->with(['user', 'socialLinks', 'industryTags'])
                      ->paginate($perPage);

        return response()->json($cards);
    }

    /**
     * Get available templates.
     */
    public function getTemplates()
    {
        $templates = [
            [
                'id' => 'modern-blue',
                'name' => 'Modern Blue',
                'description' => 'Clean and professional blue gradient design',
                'preview' => '/templates/modern-blue-preview.jpg',
                'category' => 'professional',
                'is_premium' => false,
                'features' => [
                    'Gradient background',
                    'Social media integration',
                    'Contact information',
                    'Professional layout'
                ]
            ],
            [
                'id' => 'elegant-black',
                'name' => 'Elegant Black',
                'description' => 'Sophisticated black and white design',
                'preview' => '/templates/elegant-black-preview.jpg',
                'category' => 'professional',
                'is_premium' => true,
                'features' => [
                    'Minimalist design',
                    'High contrast',
                    'QR code integration',
                    'Premium fonts'
                ]
            ],
            [
                'id' => 'creative-colors',
                'name' => 'Creative Colors',
                'description' => 'Vibrant and colorful design for creatives',
                'preview' => '/templates/creative-colors-preview.jpg',
                'category' => 'creative',
                'is_premium' => true,
                'features' => [
                    'Multi-color gradients',
                    'Animated elements',
                    'Custom icons',
                    'Gallery integration'
                ]
            ],
            [
                'id' => 'minimal-white',
                'name' => 'Minimal White',
                'description' => 'Clean and simple white design',
                'preview' => '/templates/minimal-white-preview.jpg',
                'category' => 'minimal',
                'is_premium' => false,
                'features' => [
                    'Clean layout',
                    'Focus on content',
                    'Fast loading',
                    'Mobile optimized'
                ]
            ],
            [
                'id' => 'corporate-gray',
                'name' => 'Corporate Gray',
                'description' => 'Professional gray design for corporate use',
                'preview' => '/templates/corporate-gray-preview.jpg',
                'category' => 'corporate',
                'is_premium' => false,
                'features' => [
                    'Corporate branding',
                    'Professional layout',
                    'Contact focus',
                    'Business information'
                ]
            ],
            [
                'id' => 'tech-purple',
                'name' => 'Tech Purple',
                'description' => 'Modern purple design for tech professionals',
                'preview' => '/templates/tech-purple-preview.jpg',
                'category' => 'technology',
                'is_premium' => true,
                'features' => [
                    'Tech-focused design',
                    'Code integration',
                    'Project showcase',
                    'Skills display'
                ]
            ]
        ];

        return response()->json($templates);
    }

    /**
     * Get templates by category.
     */
    public function getTemplatesByCategory($category)
    {
        $allTemplates = $this->getTemplates()->getData(true);
        $filteredTemplates = array_filter($allTemplates, function ($template) use ($category) {
            return $template['category'] === $category;
        });

        return response()->json(array_values($filteredTemplates));
    }

    /**
     * Get featured cards for marketplace.
     */
    public function getFeaturedCards()
    {
        $featuredCards = BusinessCard::where('is_public', true)
                                   ->with(['user', 'socialLinks', 'industryTags'])
                                   ->orderBy('view_count', 'desc')
                                   ->take(6)
                                   ->get();

        return response()->json($featuredCards);
    }

    /**
     * Get marketplace statistics.
     */
    public function getStats()
    {
        $stats = [
            'total_public_cards' => BusinessCard::where('is_public', true)->count(),
            'total_users' => User::count(),
            'popular_templates' => BusinessCard::select('template', \DB::raw('count(*) as count'))
                                         ->where('is_public', true)
                                         ->groupBy('template')
                                         ->orderBy('count', 'desc')
                                         ->take(5)
                                         ->get(),
            'top_industries' => \DB::table('industry_tags')
                                  ->select('tag', \DB::raw('count(*) as count'))
                                  ->join('business_cards', 'industry_tags.card_id', '=', 'business_cards.id')
                                  ->where('business_cards.is_public', true)
                                  ->groupBy('tag')
                                  ->orderBy('count', 'desc')
                                  ->take(10)
                                  ->get(),
            'new_cards_this_week' => BusinessCard::where('is_public', true)
                                             ->where('created_at', '>=', now()->subDays(7))
                                             ->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Search marketplace with advanced filters.
     */
    public function advancedSearch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
            'filters' => 'nullable|array',
            'filters.industry' => 'nullable|array',
            'filters.location' => 'nullable|array',
            'filters.template' => 'nullable|array',
            'filters.is_premium_only' => 'nullable|boolean',
            'sort_by' => 'nullable|in:relevance,view_count,created_at',
            'sort_order' => 'nullable|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = BusinessCard::where('is_public', true);
        $searchQuery = $request->query;

        // Basic search
        $query->where(function ($q) use ($searchQuery) {
            $q->where('name', 'like', "%{$searchQuery}%")
              ->orWhere('company', 'like', "%{$searchQuery}%")
              ->orWhere('position', 'like', "%{$searchQuery}%")
              ->orWhere('bio', 'like', "%{$searchQuery}%")
              ->orWhereHas('industryTags', function ($tagQuery) use ($searchQuery) {
                  $tagQuery->where('tag', 'like', "%{$searchQuery}%");
              });
        });

        // Apply filters
        if ($request->has('filters')) {
            $filters = $request->filters;

            // Industry filter
            if (isset($filters['industry']) && is_array($filters['industry'])) {
                $query->whereHas('industryTags', function ($q) use ($filters) {
                    $q->whereIn('tag', $filters['industry']);
                });
            }

            // Location filter
            if (isset($filters['location']) && is_array($filters['location'])) {
                $query->where(function ($q) use ($filters) {
                    foreach ($filters['location'] as $location) {
                        $q->orWhere('location', 'like', "%{$location}%");
                    }
                });
            }

            // Template filter
            if (isset($filters['template']) && is_array($filters['template'])) {
                $query->whereIn('template', $filters['template']);
            }

            // Premium only filter
            if (isset($filters['is_premium_only']) && $filters['is_premium_only']) {
                $query->whereIn('template', ['elegant-black', 'creative-colors', 'tech-purple']);
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'relevance');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'view_count':
                $query->orderBy('view_count', $sortOrder);
                break;
            case 'created_at':
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'relevance':
            default:
                // For relevance, we'll keep the default order and let MySQL handle relevance
                $query->orderBy('view_count', 'desc');
                break;
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $cards = $query->with(['user', 'socialLinks', 'industryTags'])
                      ->paginate($perPage);

        return response()->json($cards);
    }

    /**
     * Get trending cards and tags.
     */
    public function getTrending()
    {
        $trending = [
            'trending_cards' => BusinessCard::where('is_public', true)
                                        ->where('created_at', '>=', now()->subDays(7))
                                        ->orderBy('view_count', 'desc')
                                        ->take(5)
                                        ->get(['id', 'name', 'company', 'view_count', 'template']),
            'trending_tags' => \DB::table('industry_tags')
                                  ->select('tag', \DB::raw('count(*) as count'))
                                  ->join('business_cards', 'industry_tags.card_id', '=', 'business_cards.id')
                                  ->where('business_cards.is_public', true)
                                  ->where('business_cards.created_at', '>=', now()->subDays(7))
                                  ->groupBy('tag')
                                  ->orderBy('count', 'desc')
                                  ->take(10)
                                  ->get(),
            'rising_stars' => User::withCount(['businessCards' => function ($query) {
                                    $query->where('is_public', true);
                                }])
                                ->having('business_cards_count', '>=', 3)
                                ->orderBy('business_cards_count', 'desc')
                                ->take(5)
                                ->get(['id', 'name', 'business_cards_count']),
        ];

        return response()->json($trending);
    }

    /**
     * Get marketplace categories.
     */
    public function getCategories()
    {
        $categories = [
            [
                'id' => 'professional',
                'name' => 'Professional',
                'description' => 'Clean and professional designs for business use',
                'icon' => 'briefcase',
                'count' => BusinessCard::where('is_public', true)
                                    ->whereIn('template', ['modern-blue', 'elegant-black', 'corporate-gray'])
                                    ->count()
            ],
            [
                'id' => 'creative',
                'name' => 'Creative',
                'description' => 'Colorful and artistic designs for creatives',
                'icon' => 'palette',
                'count' => BusinessCard::where('is_public', true)
                                    ->where('template', 'creative-colors')
                                    ->count()
            ],
            [
                'id' => 'minimal',
                'name' => 'Minimal',
                'description' => 'Simple and clean minimalist designs',
                'icon' => 'circle',
                'count' => BusinessCard::where('is_public', true)
                                    ->where('template', 'minimal-white')
                                    ->count()
            ],
            [
                'id' => 'technology',
                'name' => 'Technology',
                'description' => 'Modern designs for tech professionals',
                'icon' => 'cpu',
                'count' => BusinessCard::where('is_public', true)
                                    ->where('template', 'tech-purple')
                                    ->count()
            ],
            [
                'id' => 'corporate',
                'name' => 'Corporate',
                'description' => 'Formal designs for corporate environments',
                'icon' => 'building',
                'count' => BusinessCard::where('is_public', true)
                                    ->where('template', 'corporate-gray')
                                    ->count()
            ]
        ];

        return response()->json($categories);
    }
}