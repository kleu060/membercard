@extends('layouts.app')

@section('title', '注册 - APEXCARD')

@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                <i data-lucide="user-plus" class="h-8 w-8 text-blue-600"></i>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                创建新账户
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                或者
                <a href="{{ route('auth.signin') }}" class="font-medium text-blue-600 hover:text-blue-500">
                    登录已有账户
                </a>
            </p>
        </div>

        @if(session('error'))
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i data-lucide="alert-circle" class="h-5 w-5 text-red-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-800">{{ session('error') }}</p>
                    </div>
                </div>
            </div>
        @endif

        @if($errors->any())
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i data-lucide="alert-circle" class="h-5 w-5 text-red-400"></i>
                    </div>
                    <div class="ml-3">
                        <div class="text-sm text-red-800">
                            <ul class="list-disc list-inside">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        @endif

        <form class="mt-8 space-y-6" action="{{ route('auth.register') }}" method="POST">
            @csrf
            
            <div class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">姓名</label>
                    <input id="name" name="name" type="text" autocomplete="name" required 
                           class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                           placeholder="请输入您的姓名" 
                           value="{{ old('name') }}">
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">邮箱地址</label>
                    <input id="email" name="email" type="email" autocomplete="email" required 
                           class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                           placeholder="请输入您的邮箱地址" 
                           value="{{ old('email') }}">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
                    <input id="password" name="password" type="password" autocomplete="new-password" required 
                           class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                           placeholder="请输入密码（至少8位）">
                </div>

                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">确认密码</label>
                    <input id="password_confirmation" name="password_confirmation" type="password" autocomplete="new-password" required 
                           class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                           placeholder="请再次输入密码">
                </div>
            </div>

            <div class="flex items-center">
                <input id="agree-terms" name="agree_terms" type="checkbox" required 
                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
                    我同意 <a href="#" class="text-blue-600 hover:text-blue-500">服务条款</a> 和 <a href="#" class="text-blue-600 hover:text-blue-500">隐私政策</a>
                </label>
            </div>

            <div>
                <button type="submit" 
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                        <i data-lucide="user-plus" class="h-5 w-5 text-blue-500 group-hover:text-blue-400"></i>
                    </span>
                    创建账户
                </button>
            </div>
        </form>

        <div class="mt-6">
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-gray-50 text-gray-500">或者使用社交账户注册</span>
                </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
                <div>
                    <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <i data-lucide="facebook" class="h-5 w-5 text-blue-600"></i>
                        <span class="ml-2">Facebook</span>
                    </a>
                </div>
                <div>
                    <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <i data-lucide="github" class="h-5 w-5 text-gray-900"></i>
                        <span class="ml-2">GitHub</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection