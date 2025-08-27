@extends('layouts.app')

@section('title', '功能特色 - APEXCARD')

@section('content')
<div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                强大的功能特色
            </h1>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                为您提供全方位的数字名片管理解决方案
            </p>
        </div>

        <div class="mt-10">
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Feature 1 -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <i data-lucide="credit-card" class="h-6 w-6"></i>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">数字名片</h3>
                    <p class="mt-2 text-base text-gray-500">
                        创建专业的数字名片，支持多种模板和自定义设计
                    </p>
                </div>

                <!-- Feature 2 -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                        <i data-lucide="camera" class="h-6 w-6"></i>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">名片扫描</h3>
                    <p class="mt-2 text-base text-gray-500">
                        快速扫描纸质名片，自动识别并保存联系人信息
                    </p>
                </div>

                <!-- Feature 3 -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                        <i data-lucide="briefcase" class="h-6 w-6"></i>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">求职市场</h3>
                    <p class="mt-2 text-base text-gray-500">
                        连接求职者和招聘企业，提供专业的求职平台
                    </p>
                </div>

                <!-- Feature 4 -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                        <i data-lucide="calendar" class="h-6 w-6"></i>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">预约管理</h3>
                    <p class="mt-2 text-base text-gray-500">
                        智能预约系统，轻松管理您的时间和会议安排
                    </p>
                </div>

                <!-- Feature 5 -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                        <i data-lucide="share-2" class="h-6 w-6"></i>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">社交分享</h3>
                    <p class="mt-2 text-base text-gray-500">
                        一键分享到各大社交平台，扩大您的人脉网络
                    </p>
                </div>

                <!-- Feature 6 -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <i data-lucide="bar-chart" class="h-6 w-6"></i>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-900">数据分析</h3>
                    <p class="mt-2 text-base text-gray-500">
                        详细的数据统计和分析，帮助您了解名片效果
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection