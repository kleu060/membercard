@extends("master")
@section('page-title', 'Digital Card')

@section('app-content')
<!-- {{ $route }} -->
<div id="app">
    <standard-card :route="'{{ $route }}'" :profile-id="'{{ $profile_id }}'"></standard-card>
</div>
@endSection