<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\IndividualRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

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
        CRUD::setValidation(IndividualRequest::class);
        CRUD::setFromDb(); // set fields from db columns.

        /**
         * Fields can be defined using the fluent syntax:
         * - CRUD::field('price')->type('number');
         */

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

        CRUD::field([   // Upload
            'name'      => 'image_id',
            'label'     => 'Image',
            'type'      => 'upload',
            'withFiles' => true
        ]);

        $this->crud->addField([
            'name'  => 'job_titles', // This will store the JSON array of job titles
            'label' => 'Job Titles',
            'type'  => 'hidden', // Hidden field where you will store all job titles in JSON format
        ]);
    
        CRUD::field([
            'name' => 'job_titles_dynamic',
            'label' => 'Job Titles',
            'type' => 'view',
            'view' => 'vendor.backpack.crud.fields.dynamic_job_titles',
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

    public function store(Request $request)
    {
        // Save the individual first
        $response = $this->traitStore();

        // After storing the individual, save the job titles
        $this->syncJobTitles($request->input('job_titles'), $this->crud->entry->id);

        return $response;
    }

    public function update(Request $request)
    {
        // Update the individual
        $response = $this->traitUpdate();

        // After updating the individual, sync the job titles
        $this->syncJobTitles($request->input('job_titles'), CRUD::getCurrentEntry()->id );

        return $response;
    }

    protected function syncJobTitles($jobTitlesJson, $individualId)
    {
        $jobTitles = json_decode($jobTitlesJson, true);

        // Remove existing job titles for the individual
        IndividualTitle::where('individual_id', $individualId)->delete();

        // Insert new job titles
        foreach ($jobTitles as $title) {
            IndividualTitle::create([
                'individual_id' => $individualId,
                'title' => $title
            ]);
        }
    }

    protected function handleImageUpload($file)
    {
        // Paths where images will be saved
        $originalPath = 'uploads/images/' . time() . '_' . $file->getClientOriginalName();
        $thumbnailPath = 'uploads/images/thumbnails/' . time() . '_thumb_' . $file->getClientOriginalName();

        // Save the original image
        $file->move(public_path('uploads/images'), $originalPath);

        // Create the thumbnail and save it
        $thumbnailImage = Image::make(public_path($originalPath))->resize(300, 300, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        $thumbnailImage->save(public_path($thumbnailPath));

        // Return the paths to save them in the database
        return [
            'original_path' => $originalPath,
            'thumbnail_path' => $thumbnailPath,
        ];
    }
}
