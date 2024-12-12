<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Backpack\CRUD\app\Http\Controllers\Auth\RegisterController as BackpackRegisterController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

use App\Models\Organization;
use Spatie\Permission\Models\Role;


class RegisterController extends BackpackRegisterController
{

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $user_model_fqn = config('backpack.base.user_model_fqn');
        $user = new $user_model_fqn();
        $users_table = $user->getTable();
        $email_validation = backpack_authentication_column() == 'email' ? 'email|' : '';

        return Validator::make($data, [
            // 'name' => 'required|max:255',
            backpack_authentication_column() => 'required|'.$email_validation.'max:255|unique:'.$users_table,
            'password' => 'required|min:6|confirmed',
            'organization_name' => 'required',
            'organization_email' => 'required|email',
        ]);
    }
    
    
    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Auth\Authenticatable
     */
    protected function create(array $data)
    {

        $organisation = Organization::create([
            'name' => $data['organization_name'],
            'email_address' => $data['organization_email'],
        ]);

        $user_model_fqn = config('backpack.base.user_model_fqn');
        $user = new $user_model_fqn();

        $user = $user_model_fqn::create([
            'name' => $data['name'],
            backpack_authentication_column() => $data[backpack_authentication_column()],
            'password' => Hash::make($data['password']),
            'relationship_type' => 'App\Models\Organization',
            'relationship_id' => $organisation->id,
            
        ]);

        // Debugging: Check if the "Organization" role exists
        // $role = Role::where('name', 'Organization')->first();
        // if (!$role) {
        // }

        // Assign the role to the user
        $user->assignRole('Organization');
        return $user;
    }
}
