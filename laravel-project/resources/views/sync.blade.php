@extends('layouts.app')

@section('title', '数据同步 - APEXCARD')

@section('content')
<div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                数据同步
            </h1>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                轻松同步您的联系人数据到各种平台
            </p>
        </div>

        <div class="mt-12">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">同步选项</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">选择您要同步的平台和服务</p>
                </div>
                <div class="border-t border-gray-200">
                    <dl>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Google 联系人</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    连接 Google
                                </button>
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Microsoft Outlook</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    连接 Outlook
                                </button>
                            </dd>
                        </div>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">iPhone 联系人</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    连接 iPhone
                                </button>
                            </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">CSV 导入</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input type="file" accept=".csv" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

        <div class="mt-8">
            <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i data-lucide="info" class="h-5 w-5 text-blue-400"></i>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-blue-800">同步说明</h3>
                        <div class="mt-2 text-sm text-blue-700">
                            <ul class="list-disc list-inside space-y-1">
                                <li>同步过程是双向的，确保您的联系人信息始终保持最新</li>
                                <li>支持增量同步，只更新发生变化的信息</li>
                                <li>您的数据安全是我们的首要任务</li>
                                <li>可以设置自动同步时间间隔</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection