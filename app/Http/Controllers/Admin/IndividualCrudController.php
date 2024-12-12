<?php

namespace App\Http\Controllers\Admin;



use App\Models\Image as ImageModel;
use App\Models\IndividualTitle;
use App\Http\Requests\IndividualRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

// use Intervention\Image\Laravel\Facades\Image;
// use Intervention\Image\ImageManager;
// use Intervention\Image\Drivers\Gd\Driver;

use App\Services\UploadImageService;
use Illuminate\Http\Request;


/**
 * Class IndividualCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class IndividualCrudController extends CrudController
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
        CRUD::setModel(\App\Models\Individual::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/individual');
        CRUD::setEntityNameStrings('individual', 'individuals');

    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {

        $organizationId = backpack_user()->relationship_id;

        if (!backpack_user()->can('admin actions')) {
            CRUD::addBaseClause('where', 'organization_id', '=', $organizationId);
        }
        CRUD::setFromDb(); // set columns from db columns.
        CRUD::addButtonFromModelFunction('line', 'profileAction', 'profileButton', 'end');
        CRUD::addButtonFromModelFunction('line', 'accountAction', 'accountButton', 'end');

    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(IndividualRequest::class);
        // CRUD::setFromDb(); // set fields from db columns.

        /**
         * Fields can be defined using the fluent syntax:
         * - CRUD::field('price')->type('number');
         */



        if ( backpack_user()->can('admin actions')) {
            CRUD::field([  // Select
                'label'     => "Organisation",
                'type'      => 'select',
                'name'      => 'organization_id', // the db column for the foreign key
            
                // optional
                // 'entity' should point to the method that defines the relationship in your Model
                // defining entity will make Backpack guess 'model' and 'attribute'
                'entity'    => 'organization',
            
                // optional - manually specify the related model and attribute
                'model'     => "App\Models\Organization", // related model
                'attribute' => 'name', // foreign key attribute that is shown to user
            
                // optional - force the related options to be a custom query, instead of all();
                'options'   => (function ($query) {
                    return $query->orderBy('name', 'ASC')->get();
                }), //  you can use this to filter the results show in the select
            ]);
        }
        else {
            $organizationId = backpack_user()->relationship_id;
            CRUD::addField([
                'name' => 'custom_text',
                'type' => 'custom_html',
                'value' => 'Organization: '.backpack_user()->relationship->name.'',
            ]);

            CRUD::addField([
                'name' => 'organization_id',
                'type' => 'hidden',
                'value' => $organizationId,
            ]);
        }

        CRUD::field([
            'name'  => 'first_name', 
            'label' => 'First Name',
            'type'  => 'text'
        ]);

        CRUD::field([
            'name'  => 'last_name',
            'label' => 'Last Name',
            'type'  => 'text' 
        ]);

        CRUD::field([
            'name'  => 'description',
            'label' => 'Description',
            'type'  => 'textarea' 
        ]);

        CRUD::field([
            'name'  => 'route',
            'label' => 'Route',
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
        $this->setupCreateOperation();
    }    
}
