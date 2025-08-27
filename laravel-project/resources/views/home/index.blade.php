@extends('layouts.app')

@section('title', 'APEXCARD - 专业数字名片管理平台')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <section class="py-20 px-4">
        <div class="container mx-auto text-center">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    专业数字名片管理平台
                </h1>
                <div class="space-y-6 mb-12">
                    <div class="flex items-center justify-center space-x-4">
                        <div class="text-blue-600">
                            <i data-lucide="users" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900">智能名片管理</h3>
                            <p class="text-lg text-gray-600">一站式数字名片解决方案</p>
                            <p class="text-gray-500">支持多种模板设计，实时预览，一键分享</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-center space-x-4">
                        <div class="text-blue-600">
                            <i data-lucide="share-2" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900">社交网络整合</h3>
                            <p class="text-lg text-gray-600">多平台链接管理</p>
                            <p class="text-gray-500">支持微信、LinkedIn、Facebook等主流社交平台</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-center space-x-4">
                        <div class="text-blue-600">
                            <i data-lucide="smartphone" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900">移动端优化</h3>
                            <p class="text-lg text-gray-600">随时随地管理名片</p>
                            <p class="text-gray-500">响应式设计，支持手机扫码分享</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="{{ route('auth.register') }}" class="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                        立即开始
                        <i data-lucide="arrow-right" class="w-5 h-5 ml-2 inline"></i>
                    </a>
                    <a href="{{ route('features') }}" class="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors">
                        了解更多
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Preview -->
    <section class="py-16 px-4 bg-white">
        <div class="container mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">核心功能</h2>
                <p class="text-xl text-gray-600">为专业人士和企业打造的完整名片解决方案</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                    <div class="flex justify-center mb-4">
                        <i data-lucide="globe" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">多模板设计</h3>
                    <p class="text-sm text-gray-600 mb-2">丰富的名片模板库</p>
                    <p class="text-gray-500 text-sm">支持现代、经典、创意等多种风格，满足不同行业需求</p>
                </div>
                
                <div class="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                    <div class="flex justify-center mb-4">
                        <i data-lucide="share-2" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">一键分享</h3>
                    <p class="text-sm text-gray-600 mb-2">多种分享方式</p>
                    <p class="text-gray-500 text-sm">支持二维码、链接、社交媒体等多种分享渠道</p>
                </div>
                
                <div class="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                    <div class="flex justify-center mb-4">
                        <i data-lucide="link" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">社交链接</h3>
                    <p class="text-sm text-gray-600 mb-2">整合社交平台</p>
                    <p class="text-gray-500 text-sm">统一管理各平台社交链接，提升个人品牌影响力</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="container mx-auto text-center">
            <h2 class="text-4xl font-bold text-white mb-6">开启您的数字名片之旅</h2>
            <div class="space-y-4 mb-8">
                <p class="text-2xl text-white mb-4">让您的名片更智能、更专业</p>
                <p class="text-xl text-blue-100">立即注册，体验完整的数字名片管理功能</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="{{ route('auth.register') }}" class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
                    免费注册
                    <i data-lucide="arrow-right" class="w-5 h-5 ml-2 inline"></i>
                </a>
                <a href="{{ route('features') }}" class="bg-transparent border border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                    了解功能
                </a>
            </div>
        </div>
    </section>
</div>
@endsection

@push('scripts')
<script>
    // Initialize Lucide icons
    document.addEventListener('DOMContentLoaded', function() {
        lucide.createIcons();
    });
</script>
@endpush