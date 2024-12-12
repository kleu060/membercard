<?php

namespace App\Http\Controllers\Admin;

use App\Models\Image as ImageModel;
use App\Http\Requests\IndividualProfileRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

use App\Services\UploadImageService;
use Illuminate\Http\Request;


use App\Models\Individual;
use App\Models\IndividualProfile;
use App\Models\IndividualTitle;
use App\Models\IndividualContact;
use App\Models\ContactType;

/**
 * Class IndividualProfileCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class IndividualProfileCrudController extends CrudController
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
        CRUD::setModel(\App\Models\IndividualProfile::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/individual-profile');
        CRUD::setEntityNameStrings('individual profile', 'individual profiles');
    }

    
    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        
        $individual_id = request()->individual_id;
        if (backpack_user()->can('admin actions')) {
            
        }
        else if (backpack_user()->can('organization actions')) {
            $organizationId = backpack_user()->relationship_id;
            // CRUD::addClause('whereIn', 'individual_id', function ($query) use ($organizationId) {
            //             $query->select('id') // Select the 'id' column from the individuals table
            //                   ->from('individuals')
            //                   ->where('organization_id', $organizationId);
            //         });

            // Check if any profiles exist for the organization
            
            $hasProfiles = IndividualProfile::whereHas('individual', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            })->exists();

            if (!$hasProfiles) {
                abort(405, 'No profiles available for your organization.');
            }
            CRUD::addClause('whereHas', 'individual', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            });

        }
        elseif (backpack_user()->can('individual actions') ){
            
            if ($individual_id) {
                // Apply a query filter to only show profiles for the specific individual
                // dd($iid);
                CRUD::addClause('where', 'individual_id', $individual_id);   
            }
        }
        
        $individual = Individual::withCount('individualProfiles')->find($individual_id);
        if ( $individual_id) {
            CRUD::removeButton('create');
            if ( $individual->individual_profiles_count < 5 ){
                CRUD::addButtonFromView('top', 'create_individual_profile', 'create_individual_profile', 'end', ['individual_id' => $individual_id]);
            }
        }
        // $ind_id = intval($individual_id);

        

        CRUD::setFromDb(); // set columns from db columns.
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation($individual = null)
    {
        CRUD::setValidation(IndividualProfileRequest::class);
        // CRUD::setFromDb(); // set fields from db columns.

        $contactTypes = ContactType::orderBy('name')->get()->toJson();
        // dd($contactTypes);

        $individual_id = request()->individual_id;

        if ( $individual_id ) {
            $individual = Individual::find($individual_id);
        }

        CRUD::addField([
            'name' => 'custom_text',
            'type' => 'custom_html',
            'value' => '<p>Add Profile to '.$individual->first_name. ' ' . $individual->last_name.'</p>',
        ]);

        CRUD::addField([
            'name' => 'individual_id',
            'type' => 'hidden',
            'value' => $individual_id,
        ]);

        CRUD::field([
            'name'  => 'profile_name', 
            'label' => 'Profile Name',
            'type'  => 'text'
        ]);

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
            'name'  => 'DOB', 
            'label' => 'Date of birth',
            'type'  => 'date'
        ]);

        CRUD::field([
            'name' => 'contacts_dynamic',
            'label' => 'Contacts',
            'type' => 'view',
            'view' => 'vendor.backpack.crud.fields.dynamic_contacts',
            'attributes' => [
                'contactsArray' => json_encode([]),
                'contactTypesArray' => $contactTypes
            ]
        ]);

        CRUD::field([
            'name'  => 'address_line_1',
            'label' => 'Addresss line 1',
            'type'  => 'text' 
        ]);

        CRUD::field([
            'name'  => 'address_line_2',
            'label' => 'Addresss line 2',
            'type'  => 'text' 
        ]);

        CRUD::field([
            'name'  => 'city',
            'label' => 'City',
            'type'  => 'text' 
        ]);

        CRUD::field([
            'name'  => 'state',
            'label' => 'State',
            'type'  => 'text' 
        ]);

        CRUD::field([
            'name'  => 'zip_code',
            'label' => 'Zip Code',
            'type'  => 'text' 
        ]);

        CRUD::field([
            'name'  => 'country',
            'label' => 'Country',
            'type'  => 'text' 
        ]);

        
        CRUD::field([   // Upload
            'name'      => 'image_file',
            'label'     => 'Image',
            'type'      => 'view',
            'view'      => 'vendor.backpack.crud.fields.image_upload',
            // 'withFiles' => false
            'disk'      => 'public',
            'upload'    => true,

        ]);

        // CRUD::field([
        //     'name'  => 'job_titles', // This will store the JSON array of job titles
        //     'label' => 'Job Titles',
        //     'type'  => 'hidden', // Hidden field where you will store all job titles in JSON format
        // ]);
    
        CRUD::field([
            'name' => 'job_titles_dynamic',
            'label' => 'Job Titles',
            'type' => 'view',
            'view' => 'vendor.backpack.crud.fields.dynamic_job_titles',
            'attributes' => [
                'titlesArray' => json_encode([])
            ]
        ]);

        CRUD::field([
            'name'  => 'is_default',
            'label' => 'Default?',
            'type'  => 'checkbox' 
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
        $individualProfile = IndividualProfile::with("individual")->find(CRUD::getCurrentEntry()->id);
        $individual = $individualProfile->individual;
        $profileImage = $individualProfile->image;
        
        $thumbnailPath = null;
        if ( $profileImage ){
            $thumbnailPath = $profileImage->thumbnail_path;
        }

        $titles = [];
        if ( $individualProfile->individualTitles ) {
            $titles = $individualProfile->individualTitles;
        }
        $titlesJson = $titles->toJson();
        
        $contacts = [];
        if ( $individualProfile->individualContacts ) {
            $contacts = $individualProfile->individualContacts;
        }
        $contactsJson = $contacts->toJson();

        $this->setupCreateOperation($individual);

        $contactTypes = ContactType::orderBy('name')->get()->toJson();

        CRUD::field([
            'name' => 'contacts_dynamic',
            'label' => 'Contacts',
            'type' => 'view',
            'view' => 'vendor.backpack.crud.fields.dynamic_contacts',
            'attributes' => [
                'contactsArray' => $contactsJson,
                'contactTypesArray' => $contactTypes
            ]
        ]);

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


        CRUD::field([
            'name' => 'job_titles_dynamic',
            'label' => 'Job Titles',
            'type' => 'view',
            'view' => 'vendor.backpack.crud.fields.dynamic_job_titles',
            'attributes' => [
                'titlesArray' => $titlesJson
            ]
        ]);
    }


    public function store(Request $request)
    {
        
        // Save the individual first
        $response = $this->traitStore();

        // dd($response);

        //Save Image to Storage 
        if ($request->hasFile('image_file')) {
            
            $file = $request->file('image_file');
            $originalPath = 'uploads/images/' . time() . '_' . preg_replace('/ /' , '', $file->getClientOriginalName());
            $thumbnailPath = 'uploads/images/thumbnails/' . time() . '_thumb_' . preg_replace('/ /' , '',$file->getClientOriginalName());
            
            $imageData = $this->uploadImageService->handleImageUpload($file, $originalPath, $thumbnailPath);
            $imageModel = ImageModel::create($imageData);
            // Add the image_id to the request data
            // $request->merge(['image_id' => $imageModel->id]);

            // dd($this->crud->entry->id);
            $individualProfile = IndividualProfile::find($this->crud->entry->id);
            $individualProfile->image_id = $imageModel->id;
            $individualProfile->save();
        }

        

        // After storing the individual, save the job titles
        $this->syncJobTitles($request->input('job_titles'), $this->crud->entry->id);
        $this->syncContacts($request->input('contacts'), $this->crud->entry->id);

        return $response;
    }

    public function update(Request $request)
    {
        $response = $this->traitUpdate();
        if ($request->hasFile('image_file')) {
            
            // Clone the file to ensure it remains accessible
            $file = $request->file('image_file');
            $originalPath = 'uploads/images/' . time() . '_' . preg_replace('/ /' , '', $file->getClientOriginalName());
            $thumbnailPath = 'uploads/images/thumbnails/' . time() . '_thumb_' . preg_replace('/ /' , '',$file->getClientOriginalName());

            $imageData = $this->uploadImageService->handleImageUpload($file, $originalPath, $thumbnailPath);

            $imageModel = ImageModel::create($imageData);

            $individual = CRUD::getCurrentEntry();
            $individual->image_id = $imageModel->id;
            $individual->save();
        }

        // After updating the individual, sync the job titles
        $this->syncJobTitles($request->input('job_titles'), CRUD::getCurrentEntry()->id );

        $this->syncContacts($request->input('contacts'), CRUD::getCurrentEntry()->id );
        return $response;
    }

    protected function syncJobTitles($jobTitlesJson, $individualId)
    {
        $jobTitles = json_decode($jobTitlesJson, true);

        // Remove existing job titles for the individual
        IndividualTitle::where('individual_profile_id', $individualId)->delete();

        // Insert new job titles
        $sort = 0 ;
        foreach ($jobTitles as $title) {
            IndividualTitle::create([
                'individual_profile_id' => $individualId,
                'title' => $title,
                "sort" => $sort
            ]);

            $sort ++;
        }
    }

    protected function syncContacts($contactsJson, $individualId)
    {
        $contacts = json_decode($contactsJson, true);

        // Remove existing job titles for the individual
        IndividualContact::where('individual_profile_id', $individualId)->delete();

        $sort = 0 ;
        foreach ($contacts as $contact) {
            IndividualContact::create([
                'individual_profile_id' => $individualId,
                'contact_type_id' => $contact["contact_type"],
                'contact_value' => $contact["contact"],
                "sort" => $sort
            ]);
            $sort ++;
        }
    }

}
