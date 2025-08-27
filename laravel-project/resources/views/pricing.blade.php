@extends('layouts.app')

@section('title', '价格方案 - APEXCARD')

@section('content')
<div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                选择适合您的方案
            </h1>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                灵活的定价方案，满足不同用户的需求
            </p>
        </div>

        <div class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
            <!-- Free Tier -->
            <div class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div class="p-6">
                    <h2 class="text-lg leading-6 font-medium text-gray-900">免费版</h2>
                    <p class="mt-4 text-sm text-gray-500">适合个人用户试用</p>
                    <p class="mt-8">
                        <span class="text-4xl font-extrabold text-gray-900">¥0</span>
                        <span class="text-base font-medium text-gray-500">/月</span>
                    </p>
                    <a href="{{ route('auth.register') }}" class="mt-8 block w-full bg-gray-800 text-white border border-gray-800 rounded-md py-2 text-sm font-semibold text-white hover:bg-gray-900">
                        开始使用
                    </a>
                </div>
                <div class="px-6 pt-6 pb-8">
                    <h3 class="text-xs font-medium text-gray-900 uppercase tracking-wide">包含功能</h3>
                    <ul class="mt-6 space-y-4">
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">1张数字名片</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">基础模板</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">社交分享</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">基础统计</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Pro Tier -->
            <div class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div class="p-6">
                    <h2 class="text-lg leading-6 font-medium text-gray-900">专业版</h2>
                    <p class="mt-4 text-sm text-gray-500">适合专业人士和小企业</p>
                    <p class="mt-8">
                        <span class="text-4xl font-extrabold text-gray-900">¥29</span>
                        <span class="text-base font-medium text-gray-500">/月</span>
                    </p>
                    <a href="{{ route('auth.register') }}" class="mt-8 block w-full bg-blue-600 text-white border border-blue-600 rounded-md py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        立即升级
                    </a>
                </div>
                <div class="px-6 pt-6 pb-8">
                    <h3 class="text-xs font-medium text-gray-900 uppercase tracking-wide">包含所有免费版功能，加上：</h3>
                    <ul class="mt-6 space-y-4">
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">10张数字名片</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">高级模板</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">名片扫描</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">高级统计</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">数据同步</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Enterprise Tier -->
            <div class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div class="p-6">
                    <h2 class="text-lg leading-6 font-medium text-gray-900">企业版</h2>
                    <p class="mt-4 text-sm text-gray-500">适合中大型企业</p>
                    <p class="mt-8">
                        <span class="text-4xl font-extrabold text-gray-900">¥99</span>
                        <span class="text-base font-medium text-gray-500">/月</span>
                    </p>
                    <a href="{{ route('auth.register') }}" class="mt-8 block w-full bg-blue-600 text-white border border-blue-600 rounded-md py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        联系销售
                    </a>
                </div>
                <div class="px-6 pt-6 pb-8">
                    <h3 class="text-xs font-medium text-gray-900 uppercase tracking-wide">包含所有专业版功能，加上：</h3>
                    <ul class="mt-6 space-y-4">
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">无限数字名片</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">自定义模板</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">团队管理</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">API 接入</span>
                        </li>
                        <li class="flex space-x-3">
                            <i data-lucide="check" class="h-5 w-5 text-green-500"></i>
                            <span class="text-sm text-gray-500">专属客服</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection