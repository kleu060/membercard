<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\UserRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

use Backpack\PermissionManager\app\Http\Controllers\UserCrudController as BaseUserCrudController;

class CustomUserCrudController extends BaseUserCrudController
{
    public function setup()
    {
        parent::setup(); // Keep the existing setup logic

        // Add or modify your custom logic
        if (!backpack_user()->can('admin actions')) {
            CRUD::denyAccess(['list', 'show', 'create', 'update', 'delete']);
        }

        // Add your custom setup configurations if needed
    }
}