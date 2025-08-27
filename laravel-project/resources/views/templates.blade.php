@extends('layouts.app')

@section('title', '模板中心 - APEXCARD')

@section('content')
<div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                精美名片模板
            </h1>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                选择适合您风格的模板，快速创建专业名片
            </p>
        </div>

        <div class="mt-12">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Template 1 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <i data-lucide="layout-template" class="h-16 w-16 text-white"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">商务经典</h3>
                        <p class="mt-2 text-gray-600">简洁大方的商务风格，适合专业人士</p>
                        <div class="mt-4">
                            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                使用模板
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Template 2 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <i data-lucide="palette" class="h-16 w-16 text-white"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">创意设计</h3>
                        <p class="mt-2 text-gray-600">充满创意的设计，展现您的个性</p>
                        <div class="mt-4">
                            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                使用模板
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Template 3 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <i data-lucide="sparkles" class="h-16 w-16 text-white"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">现代简约</h3>
                        <p class="mt-2 text-gray-600">现代简约风格，时尚而不失专业</p>
                        <div class="mt-4">
                            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                使用模板
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Template 4 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <i data-lucide="zap" class="h-16 w-16 text-white"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">动感活力</h3>
                        <p class="mt-2 text-gray-600">充满活力的设计，适合年轻创业者</p>
                        <div class="mt-4">
                            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                使用模板
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Template 5 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <i data-lucide="sun" class="h-16 w-16 text-white"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">温暖阳光</h3>
                        <p class="mt-2 text-gray-600">温暖明亮的色调，给人亲切感</p>
                        <div class="mt-4">
                            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                使用模板
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Template 6 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <i data-lucide="crown" class="h-16 w-16 text-white"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">高端奢华</h3>
                        <p class="mt-2 text-gray-600">奢华大气的设计，彰显尊贵身份</p>
                        <div class="mt-4">
                            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                使用模板
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection