{{-- This file is used for menu items by any Backpack v6 theme --}}
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('dashboard') }}"><i class="la la-home nav-icon"></i> {{ trans('backpack::base.dashboard') }}</a></li>


@if(backpack_user()->can('admin actions'))
    <x-backpack::menu-dropdown title="Users" icon="la la-puzzle-piece">
        <x-backpack::menu-dropdown-header title="Authentication" />
        <x-backpack::menu-dropdown-item title="Users" icon="la la-user" :link="backpack_url('user')" />
        <x-backpack::menu-dropdown-item title="Roles" icon="la la-group" :link="backpack_url('role')" />
        <x-backpack::menu-dropdown-item title="Permissions" icon="la la-key" :link="backpack_url('permission')" />
    </x-backpack::menu-dropdown>
@endif

@if(backpack_user()->can('orgnaization actions')) 
    <x-backpack::menu-item title="Organizations" icon="la la-question" :link="backpack_url('organization')" />
@endif

<x-backpack::menu-item title="Individuals" icon="la la-question" :link="backpack_url('individual')" />
<!-- <x-backpack::menu-item title="Individual profiles" icon="la la-question" :link="backpack_url('individual-profile')" /> -->
<!-- <x-backpack::menu-item title="Individual accounts" icon="la la-question" :link="backpack_url('individual-account')" /> -->