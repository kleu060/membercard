<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width, viewport-fit=cover">
        <title>@yield("page-title")</title>
        @vite(['resources/sass/app.scss', 'resources/js/app.js'])
    </head>
    <body>
        @yield("app-content")
    </body>
</html>