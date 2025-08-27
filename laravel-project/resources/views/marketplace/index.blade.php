@extends('layouts.app')

@section('title', 'Marketplace - DigitalCard Pro')

@section('page_title', 'Marketplace')

@section('page_actions')
    <div class="btn-group me-2" role="group">
        <button type="button" class="btn btn-outline-primary active" data-filter="all">All</button>
        <button type="button" class="btn btn-outline-primary" data-filter="professional">Professional</button>
        <button type="button" class="btn btn-outline-primary" data-filter="creative">Creative</button>
        <button type="button" class="btn btn-outline-primary" data-filter="technology">Technology</button>
    </div>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#advancedSearchModal">
        <i class="bi bi-funnel me-2"></i>Advanced Search
    </button>
@endsection

@section('content')
<!-- Search Bar -->
<div class="row mb-4">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-search"></i>
                            </span>
                            <input type="text" class="form-control" id="marketplaceSearch" placeholder="Search business cards by name, company, or industry...">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select class="form-select" id="sortSelect">
                            <option value="view_count_desc">Most Popular</option>
                            <option value="created_at_desc">Newest First</option>
                            <option value="created_at_asc">Oldest First</option>
                            <option value="name_asc">Name A-Z</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Featured Cards -->
<div class="row mb-4">
    <div class="col-12">
        <h4 class="mb-3">Featured Cards</h4>
        <div class="row" id="featuredCards">
            <!-- Featured cards will be loaded here -->
        </div>
    </div>
</div>

<!-- Categories -->
<div class="row mb-4">
    <div class="col-12">
        <h4 class="mb-3">Browse by Category</h4>
        <div class="row" id="categories">
            <!-- Categories will be loaded here -->
        </div>
    </div>
</div>

<!-- Templates Section -->
<div class="row mb-4">
    <div class="col-12">
        <h4 class="mb-3">Popular Templates</h4>
        <div class="row" id="templates">
            <!-- Templates will be loaded here -->
        </div>
    </div>
</div>

<!-- Marketplace Cards -->
<div class="row">
    <div class="col-12">
        <h4 class="mb-3">Business Cards Marketplace</h4>
        <div class="row" id="marketplaceCards">
            <!-- Cards will be loaded here -->
        </div>
        
        <!-- Load More Button -->
        <div class="text-center mt-4">
            <button class="btn btn-outline-primary" id="loadMoreBtn">
                <i class="bi bi-arrow-clockwise me-2"></i>Load More
            </button>
        </div>
    </div>
</div>

<!-- Advanced Search Modal -->
<div class="modal fade" id="advancedSearchModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Advanced Search</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="advancedSearchForm">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Keywords</label>
                            <input type="text" class="form-control" name="query" placeholder="Enter search keywords...">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Location</label>
                            <input type="text" class="form-control" name="location" placeholder="City, State, or Country">
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Industry</label>
                            <select class="form-select" name="industry[]" multiple>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Design">Design</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Real Estate">Real Estate</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Template</label>
                            <select class="form-select" name="template[]" multiple>
                                <option value="modern-blue">Modern Blue</option>
                                <option value="elegant-black">Elegant Black</option>
                                <option value="creative-colors">Creative Colors</option>
                                <option value="minimal-white">Minimal White</option>
                                <option value="corporate-gray">Corporate Gray</option>
                                <option value="tech-purple">Tech Purple</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="is_premium_only" id="premiumOnly">
                                <label class="form-check-label" for="premiumOnly">
                                    Premium Templates Only
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Sort By</label>
                            <select class="form-select" name="sort_by">
                                <option value="relevance">Relevance</option>
                                <option value="view_count">Most Viewed</option>
                                <option value="created_at">Newest</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="applyAdvancedSearch">Apply Filters</button>
            </div>
        </div>
    </div>
</div>

<!-- Template Preview Modal -->
<div class="modal fade" id="templatePreviewModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="templatePreviewTitle">Template Preview</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div id="templatePreviewContent">
                    <!-- Template preview will be loaded here -->
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="useTemplateBtn">Use This Template</button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('page_scripts')
<script>
let currentPage = 1;
let currentFilters = {
    search: '',
    category: 'all',
    sort: 'view_count_desc'
};

// Load marketplace data
async function loadMarketplaceData() {
    try {
        // Load featured cards
        const featuredResponse = await fetch('/api/marketplace/featured');
        const featuredData = await featuredResponse.json();
        renderFeaturedCards(featuredData);
        
        // Load categories
        const categoriesResponse = await fetch('/api/marketplace/categories');
        const categoriesData = await categoriesResponse.json();
        renderCategories(categoriesData);
        
        // Load templates
        const templatesResponse = await fetch('/api/marketplace/templates');
        const templatesData = await templatesResponse.json();
        renderTemplates(templatesData);
        
        // Load marketplace cards
        await loadMarketplaceCards();
        
    } catch (error) {
        console.error('Error loading marketplace data:', error);
    }
}

// Render featured cards
function renderFeaturedCards(cards) {
    const container = document.getElementById('featuredCards');
    container.innerHTML = cards.map(card => `
        <div class="col-md-4 mb-3">
            <div class="card h-100">
                <div class="card-body text-center">
                    <div class="business-card mb-3" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 200px;">
                        <div class="d-flex flex-column justify-content-center h-100">
                            ${card.avatar ? `<img src="${card.avatar}" class="rounded-circle mb-2" width="60" height="60" alt="Avatar">` : '<i class="bi bi-person fs-1"></i>'}
                            <h6 class="text-white mb-1">${card.name}</h6>
                            <p class="text-white-50 small mb-0">${card.position}</p>
                            <p class="text-white-50 small">${card.company}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${card.view_count} views</small>
                        <a href="/cards/${card.id}" class="btn btn-sm btn-primary">View</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render categories
function renderCategories(categories) {
    const container = document.getElementById('categories');
    container.innerHTML = categories.map(category => `
        <div class="col-md-2-4 mb-3">
            <div class="card category-card h-100 text-center" data-category="${category.id}">
                <div class="card-body">
                    <div class="category-icon mb-3">
                        <i class="bi bi-${category.icon} fs-1 text-primary"></i>
                    </div>
                    <h6 class="card-title">${category.name}</h6>
                    <p class="card-text small text-muted">${category.description}</p>
                    <span class="badge bg-primary">${category.count} cards</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render templates
function renderTemplates(templates) {
    const container = document.getElementById('templates');
    container.innerHTML = templates.map(template => `
        <div class="col-md-4 mb-3">
            <div class="card template-card h-100" data-template-id="${template.id}">
                <div class="card-body text-center">
                    <div class="template-preview mb-3">
                        <img src="${template.preview}" class="img-fluid rounded" alt="${template.name}" 
                             onerror="this.src='https://via.placeholder.com/300x200?text=Template+Preview'">
                    </div>
                    <h6 class="card-title">${template.name}</h6>
                    <p class="card-text small text-muted">${template.description}</p>
                    <div class="mb-2">
                        ${template.is_premium ? '<span class="badge bg-warning">Premium</span>' : '<span class="badge bg-success">Free</span>'}
                    </div>
                    <button class="btn btn-sm btn-outline-primary preview-template-btn" data-template='${JSON.stringify(template)}'>
                        Preview
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load marketplace cards
async function loadMarketplaceCards(append = false) {
    try {
        const params = new URLSearchParams({
            page: currentPage,
            per_page: 12,
            sort_by: currentFilters.sort.split('_')[0],
            sort_order: currentFilters.sort.split('_')[1]
        });

        if (currentFilters.search) {
            params.append('search', currentFilters.search);
        }

        if (currentFilters.category !== 'all') {
            params.append('template', currentFilters.category);
        }

        const response = await fetch(`/api/marketplace?${params}`);
        const data = await response.json();

        if (append) {
            // Append to existing cards
            const container = document.getElementById('marketplaceCards');
            const newCardsHtml = renderMarketplaceCards(data.data);
            container.insertAdjacentHTML('beforeend', newCardsHtml);
        } else {
            // Replace existing cards
            const container = document.getElementById('marketplaceCards');
            container.innerHTML = renderMarketplaceCards(data.data);
        }

        // Hide load more button if no more pages
        if (currentPage >= data.last_page) {
            document.getElementById('loadMoreBtn').style.display = 'none';
        } else {
            document.getElementById('loadMoreBtn').style.display = 'inline-block';
        }

    } catch (error) {
        console.error('Error loading marketplace cards:', error);
    }
}

// Render marketplace cards
function renderMarketplaceCards(cards) {
    return cards.map(card => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="text-center mb-3">
                        ${card.avatar ? `<img src="${card.avatar}" class="rounded-circle mb-2" width="60" height="60" alt="Avatar">` : '<i class="bi bi-person-circle fs-1 text-muted"></i>'}
                        <h6 class="card-title">${card.name}</h6>
                        <p class="card-text small text-muted">${card.position}</p>
                        <p class="card-text small text-muted">${card.company}</p>
                    </div>
                    
                    ${card.industry_tags && card.industry_tags.length > 0 ? `
                        <div class="mb-2">
                            ${card.industry_tags.map(tag => `<span class="badge bg-secondary me-1">${tag.tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-eye me-1"></i>${card.view_count}
                        </small>
                        <div>
                            <a href="/cards/${card.id}" class="btn btn-sm btn-outline-primary">View</a>
                            <button class="btn btn-sm btn-primary save-card-btn" data-card-id="${card.id}">
                                <i class="bi bi-bookmark"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadMarketplaceData();

    // Search functionality
    document.getElementById('marketplaceSearch').addEventListener('input', function(e) {
        currentFilters.search = e.target.value;
        currentPage = 1;
        loadMarketplaceCards();
    });

    // Sort functionality
    document.getElementById('sortSelect').addEventListener('change', function(e) {
        currentFilters.sort = e.target.value;
        currentPage = 1;
        loadMarketplaceCards();
    });

    // Category filter buttons
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilters.category = this.dataset.filter;
            currentPage = 1;
            loadMarketplaceCards();
        });
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            document.querySelector(`[data-filter="${category}"]`)?.click();
        });
    });

    // Load more button
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
        currentPage++;
        loadMarketplaceCards(true);
    });

    // Template preview buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('preview-template-btn')) {
            const template = JSON.parse(e.target.dataset.template);
            showTemplatePreview(template);
        }
    });

    // Advanced search
    document.getElementById('applyAdvancedSearch').addEventListener('click', function() {
        const formData = new FormData(document.getElementById('advancedSearchForm'));
        // Implement advanced search logic here
        const modal = bootstrap.Modal.getInstance(document.getElementById('advancedSearchModal'));
        modal.hide();
    });

    // Save card buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('save-card-btn') || e.target.parentElement.classList.contains('save-card-btn')) {
            const button = e.target.classList.contains('save-card-btn') ? e.target : e.target.parentElement;
            const cardId = button.dataset.cardId;
            // Implement save card functionality
            alert('Save card functionality would be implemented here');
        }
    });
});

// Show template preview
function showTemplatePreview(template) {
    document.getElementById('templatePreviewTitle').textContent = template.name;
    document.getElementById('templatePreviewContent').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${template.preview}" class="img-fluid rounded" alt="${template.name}" 
                     onerror="this.src='https://via.placeholder.com/400x300?text=Template+Preview'">
            </div>
            <div class="col-md-6">
                <h6>${template.name}</h6>
                <p class="text-muted">${template.description}</p>
                <div class="mb-3">
                    ${template.is_premium ? '<span class="badge bg-warning">Premium</span>' : '<span class="badge bg-success">Free</span>'}
                    <span class="badge bg-secondary">${template.category}</span>
                </div>
                <h6>Features:</h6>
                <ul class="small">
                    ${template.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    document.getElementById('useTemplateBtn').onclick = function() {
        // Implement use template functionality
        alert('Use template functionality would be implemented here');
        const modal = bootstrap.Modal.getInstance(document.getElementById('templatePreviewModal'));
        modal.hide();
    };
    
    const modal = new bootstrap.Modal(document.getElementById('templatePreviewModal'));
    modal.show();
}
</script>
@endsection