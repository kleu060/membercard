@extends('layouts.app')

@section('title', '仪表板 - APEXCARD')

@section('content')
<div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">我的名片</h1>
            <p class="text-gray-600 mt-2">管理您的数字名片，创建专业的个人品牌形象</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                        <i data-lucide="credit-card" class="w-6 h-6"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">总名片数</p>
                        <p class="text-2xl font-semibold text-gray-900">{{ $cards->count() }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100 text-green-600">
                        <i data-lucide="eye" class="w-6 h-6"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">总浏览量</p>
                        <p class="text-2xl font-semibold text-gray-900">{{ $cards->sum('view_count') }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                        <i data-lucide="share-2" class="w-6 h-6"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">社交链接</p>
                        <p class="text-2xl font-semibold text-gray-900">{{ $cards->sum('social_links_count') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mb-8">
            <a href="{{ route('cards.create') }}" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
                <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                创建新名片
            </a>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($cards as $card)
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                @if($card->cover_photo)
                    <div class="h-48 bg-cover bg-center" style="background-image: url('{{ $card->cover_photo }}')"></div>
                @else
                    <div class="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                @endif
                
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">{{ $card->name }}</h3>
                            <p class="text-sm text-gray-600">{{ $card->position }}</p>
                            @if($card->company)
                                <p class="text-sm text-gray-600">{{ $card->company }}</p>
                            @endif
                        </div>
                        @if($card->is_public)
                            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">公开</span>
                        @else
                            <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">私有</span>
                        @endif
                    </div>
                    
                    <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span><i data-lucide="eye" class="w-4 h-4 inline mr-1"></i> {{ $card->view_count }}</span>
                        <span><i data-lucide="link" class="w-4 h-4 inline mr-1"></i> {{ $card->social_links_count }}</span>
                        <span><i data-lucide="package" class="w-4 h-4 inline mr-1"></i> {{ $card->products_count }}</span>
                    </div>
                    
                    <div class="flex space-x-2">
                        <a href="{{ route('cards.show', $card->id) }}" class="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            查看
                        </a>
                        <a href="{{ route('cards.edit', $card->id) }}" class="flex-1 bg-gray-200 text-gray-800 text-center px-4 py-2 rounded hover:bg-gray-300 transition-colors">
                            编辑
                        </a>
                    </div>
                </div>
            </div>
            @endforeach
            
            @if($cards->count() === 0)
            <div class="col-span-full text-center py-12">
                <i data-lucide="credit-card" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">还没有名片</h3>
                <p class="text-gray-600 mb-6">创建您的第一张数字名片，开始建立个人品牌</p>
                <a href="{{ route('cards.create') }}" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
                    <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                    创建名片
                </a>
            </div>
            @endif
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        lucide.createIcons();
    });
</script>
@endpush