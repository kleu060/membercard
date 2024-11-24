<!DOCTYPE html>
<html>
    <head>
        <title>@yield("page-title")</title>
        @vite(['resources/sass/app.scss', 'resources/js/app.js'])
    </head>
    <body>
        @yield("app-content")
    </body>
</html>