<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\OrganizationRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use Intervention\Image\Facades\Image as ImageIntervention;
use Illuminate\Http\Request;
use App\Services\UploadImageService;

use App\Models\Image as ImageModel;
use app\Models\Organization;

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

    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation { store as traitStore; }
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation { update as traitUpdate; }

    public function __construct(UploadImageService $uploadImageService)
    {
        parent::__construct();
        $this->uploadImageService = $uploadImageService;
    }

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        
        if (backpack_user()->can('admin actions')) {
            CRUD::allowAccess(['list', 'show', 'create', 'update', 'delete']);
        }
        else if (backpack_user()->can('organization actions')) {
            CRUD::denyAccess(['create', 'de;ete']);
        }
        else {
            CRUD::denyAccess(['list', 'show', 'create', 'update', 'delete']);
        }
        

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
        $organizationId = backpack_user()->relationship_id;
        CRUD::addBaseClause('where', 'id', '=', $organizationId);
        CRUD::setFromDb(); // set columns from db columns.

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


        CRUD::field([   // Upload
            'name'      => 'image_file',
            'label'     => 'Image',
            'type'      => 'view',
            'view'      => 'vendor.backpack.crud.fields.image_upload',
            // 'withFiles' => false
            'disk'      => 'public',
            // 'path' => 'uploads/profile_images',
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
        $organizationId = backpack_user()->relationship_id;

        // Get the ID of the current entry being accessed
        $currentEntryId = $this->crud->getCurrentEntryId();

        // Check if the current entry matches the allowed ID
        if ($currentEntryId != $organizationId) {
            abort(403, 'You are not allowed to edit this organization.');
        }


        $this->setupCreateOperation();

        $Organization = Organization::find(CRUD::getCurrentEntry()->id);
        $organizationImage = $Organization->image;
        $thumbnailPath = null;
        if ( $organizationImage ){
            $thumbnailPath = $organizationImage->thumbnail_path;
        }


        CRUD::field([   // Upload
            'name'      => 'image_file',
            'label'     => 'Image',
            'type'      => 'view',
            'view'      => 'vendor.backpack.crud.fields.image_upload',
            // 'withFiles' => false
            'disk'      => 'public',
            'upload'    => true,
            'attributes' => [
                'thumbnailPath' => $thumbnailPath
            ]

        ]);

    }


    public function store(Request $request)
    {
        $response = $this->traitStore();


        if ($request->hasFile('image_file')) {
            
            $file = $request->file('image_file');
            $this->handleImageUplaod($file, $this->crud->entry->id);
        }

        return $response;
    }

    public function update(Request $request)
    {
        $response = $this->traitUpdate();

        // Handle image upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $this->handleImageUplaod($file, $this->crud->entry->id);
        }
        
        return $response;
    }

    function handleImageUplaod($file, $id){
        $originalPath = 'uploads/images/' . time() . '_' . preg_replace('/ /' , '', $file->getClientOriginalName());
        $thumbnailPath = 'uploads/images/thumbnails/' . time() . '_thumb_' . preg_replace('/ /' , '',$file->getClientOriginalName());
        
        $imageData = $this->uploadImageService->handleImageUpload($file, $originalPath, $thumbnailPath);
        $imageModel = ImageModel::create($imageData);
        // Add the image_id to the request data
        // $request->merge(['image_id' => $imageModel->id]);

        // dd($this->crud->entry->id);
        $organization = Organization::find($id);
        $organization->image_id = $imageModel->id;
        $organization->save();
        
    }


    
}
