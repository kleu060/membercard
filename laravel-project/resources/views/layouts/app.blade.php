<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'APEXCARD - 数字名片管理平台')</title>
    <meta name="description" content="@yield('description', '专业的数字名片管理平台，支持多种模板设计，社交媒体链接整合，产品展示等功能')">
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    
    @stack('styles')
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- API Token (if available) -->
    @auth
        @php
            try {
                $token = auth()->user()->tokens()->where('name', 'app')->first();
                if (!$token) {
                    $token = auth()->user()->createToken('app');
                }
                echo '<meta name="api-token" content="' . e($token->plainTextToken) . '">';
            } catch (\Exception $e) {
                // Silently fail if token creation fails
                echo '<meta name="api-token" content="">';
            }
        @endphp
    @endauth
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <div class="flex items-center">
                    <a href="{{ route('home') }}" class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i data-lucide="briefcase" class="w-5 h-5 text-white"></i>
                        </div>
                        <span class="text-xl font-bold">APEXCARD</span>
                    </a>
                </div>

                <!-- Navigation -->
                <nav class="hidden md:flex space-x-8">
                    <a href="{{ route('home') }}" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">首页</a>
                    <a href="{{ route('features') }}" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">功能</a>
                    <a href="{{ route('templates') }}" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">模板</a>
                    <a href="{{ route('pricing') }}" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">定价</a>
                </nav>

                <!-- User Actions -->
                <div class="flex items-center space-x-4">
                    @guest
                        <a href="{{ route('auth.signin') }}" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">登录</a>
                        <a href="{{ route('auth.register') }}" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">注册</a>
                    @else
                        <a href="{{ route('dashboard') }}" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">仪表板</a>
                        <form action="{{ route('auth.logout') }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">退出</button>
                        </form>
                    @endguest
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i data-lucide="briefcase" class="w-5 h-5 text-white"></i>
                        </div>
                        <span class="text-xl font-bold">APEXCARD</span>
                    </div>
                    <p class="text-gray-400">专业的数字名片管理平台，让您的名片更智能、更专业。</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">产品</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">数字名片</a></li>
                        <li><a href="{{ route('scan') }}" class="hover:text-white transition-colors">名片扫描</a></li>
                        <li><a href="{{ route('job-market') }}" class="hover:text-white transition-colors">求职市场</a></li>
                        <li><a href="{{ route('features') }}" class="hover:text-white transition-colors">功能特色</a></li>
                        <li><a href="{{ route('marketplace') }}" class="hover:text-white transition-colors">市场推广</a></li>
                        <li><a href="{{ route('pricing') }}" class="hover:text-white transition-colors">价格方案</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">企业定制</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">支持</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">帮助中心</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">使用教程</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">API文档</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">关注我们</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i data-lucide="facebook" class="w-6 h-6"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i data-lucide="twitter" class="w-6 h-6"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i data-lucide="linkedin" class="w-6 h-6"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i data-lucide="mail" class="w-6 h-6"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 APEXCARD. 保留所有权利。</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // Initialize Lucide icons
        lucide.createIcons();
    </script>
    
    @stack('scripts')
</body>
</html>