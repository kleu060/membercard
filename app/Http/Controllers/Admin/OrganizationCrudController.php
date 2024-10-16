<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\OrganizationRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use Intervention\Image\Facades\Image as ImageIntervention;


/**
 * Class OrganizationCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class OrganizationCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        CRUD::setModel(\App\Models\Organization::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/organization');
        CRUD::setEntityNameStrings('organization', 'organizations');
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        CRUD::setFromDb(); // set columns from db columns.

        /**
         * Columns can be defined using the fluent syntax:
         * - CRUD::column('price')->type('number');
         */



    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(OrganizationRequest::class);
        CRUD::setFromDb(); // set fields from db columns.

        // and on subfields:

        CRUD::addField([
            'name' => 'image',
            'type' => 'upload',
            'label' => 'Profile Image',
            'upload' => true,
            'disk' => 'public',
            'path' => 'uploads/profile_images',
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


    public function store()
    {
        $response = $this->traitStore();

        $this->handleImageUpload();
        return $response;
    }

    public function update()
    {
        $response = $this->traitUpdate();

        // Handle image upload
        $this->handleImageUpload();

        return $response;
    }


    protected function handleImageUpload()
    {
        $request = $this->crud->getRequest();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('uploads/profile_images', 'public');
            $thumbnailPath = 'uploads/profile_images/thumbnails/' . basename($path);

            // Create thumbnail
            $img = ImageIntervention::make(storage_path("app/public/{$path}"))
                ->resize(150, 150)
                ->save(storage_path("app/public/{$thumbnailPath}"));

            // Save image paths to the images table
            $imageModel = Image::create([
                'original_path' => $path,
                'thumbnail_path' => $thumbnailPath,
            ]);

            // Update the user image_id
            $user = $this->crud->getCurrentEntry();
            $user->image_id = $imageModel->id;
            $user->save();
        }
    }
}
