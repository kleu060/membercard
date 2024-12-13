<?php
namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use App\Models\User;
use App\Models\Individual;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;


class IndividualAccountCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation { store as traitStore; }
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation { update as traitUpdate; }
    

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        CRUD::setModel(\App\Models\User::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/individual-account');
        CRUD::setEntityNameStrings('individual-account', 'Individual Account');

        // Disable specific operations
        CRUD::denyAccess('list'); // Disables the list view
        CRUD::denyAccess('delete'); // Disables the delete button/action

    }


    public function create()
    {
        $individual_id = request()->individual_id;

        if ($individual_id) {
            $user = User::where('relationship_id', $individual_id)
                        ->where('relationship_type', 'App\Models\Individual')
                        ->first();

            if ($user) {
                return redirect()->route('individual-account.edit', ['id' => $user->id]);
            }
        }

        return parent::create(); // Proceed with the default Backpack create logic
    }

    protected function setupCreateOperation()
    {
        $individual_id = request()->individual_id;
        if ( $individual_id ) {
            $individual = Individual::find($individual_id);
        }
        else{
            abort(405, 'Individual not defined');
        }
        CRUD::addField([
            'name' => 'custom_text',
            'type' => 'custom_html',
            'value' => '<p>Create account for individual '.$individual->first_name. ' ' . $individual->last_name.'</p>',
        ]);

        CRUD::field([
            'name'  => 'individual_id', 
            'label' => $individual_id,
            'type'  => 'hidden',
            'value' => $individual_id
        ]);

        CRUD::field([
            'name'  => 'name', 
            'label' => 'Name',
            'type'  => 'text'
        ]);

        CRUD::field([
            'name'  => 'email', 
            'label' => 'Email',
            'type'  => 'text'
        ]);

        CRUD::field([
            'name'  => 'password', 
            'label' => 'Password',
            'type'  => 'text'
        ]);
    }

    /**
     * Define what happens when the Update operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-update
     * @return void
     */
    protected function setupUpdateOperation()
    {
        $user_id = CRUD::getCurrentEntryId();
        $user = User::find( $user_id);

        CRUD::addField([
            'name' => 'custom_text',
            'type' => 'custom_html',
            'value' => '<p>Email: '.$user->email.'</p>',
        ]);


        CRUD::field([
            'name'  => 'password', 
            'label' => 'Password',
            'type'  => 'password',
            'value' => ''
        ]);
    }    

    public function store(Request $request)
    {
        // $response = $this->traitStore(); // Save the entry using Backpack's default store logic
        // $response = $this->traitStore();

        // $data = $request();
        $user_model_fqn = config('backpack.base.user_model_fqn');
        $user = new $user_model_fqn();

        $user = $user_model_fqn::create([
            'name' =>  $request->name,
            'backpack_authentication_column'() => $request->email,
            'password' => Hash::make($request->password),
            'relationship_type' => 'App\Models\Individual',
            'relationship_id' => $request->individual_id,
        ]);

        $user->assignRole('Individual');

         // Set a success notification in the session
        \Alert::success('User created successfully.')->flash();

        // Redirect to the home page
        return redirect()->route('individual-account.edit', ['id' => $user->id]); // Replace 'home' with your actual home route name

    }
}