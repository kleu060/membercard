<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Individual;
use App\Models\IndividualProfile;

use Symfony\Component\HttpFoundation\StreamedResponse;

class IndividualController extends Controller
{
    public function show($route, $profile_id = null)
    {        
        // Fetch the Individual by the route field
        $individual = Individual::with('individualProfiles.individualContacts.contactType')->where('route', $route)
                                ->first();
                                
        if (!$individual) {
            return response()->json([
                "ERR" => "001",
                "message" => "No profile found"
            ]);
        }
        // Fetch the specific individual profile or the default profile if not provided
        $profile = $profile_id 
            ? $individual->individualProfiles()->with('individualContacts.contactType')->find($profile_id)
            : $individual->individualProfiles()->with('individualContacts.contactType')->where('is_default', true)->first();

        $organization = $individual->organization;

        // Hide the organization image to prevent duplication
        if ( $profile ) {

            $individual->organization->makeHidden('image');
            $profile->makeHidden('image');
            $profile->makeHidden('individualContacts');
            $profile->makeHidden('individualTitles');

            return response()->json([
                // 'organization' => $organization,
                'organizationImage' => $organization->image,
                'individual' => $individual,
                'individualProfile' => [
                    'profile' => $profile,
                    'image' => $profile->image,
                    'titles' => $profile->individualTitles,
                    'contacts' => $profile->individualContacts,
                ]
            ]);
        }
        else {
            return response()->json([
                "ERR" => "002",
                "message" => "No profile found"
            ]);
        }
    }

    public function getIndividualProfile($route) {
        $individual = Individual::where('route', $route)
                                ->first();

        $individualProfiles = IndividualProfile::where("individual_id", $individual->id)->get();
        if ( $individualProfiles ){
            return response()->json($individualProfiles);
        }
        else {
            return response()->json([
                "ERR" => "002",
                "message" => "No individual profile found"
            ]);
        }
    }

    public function downloadVcf($route, $profile_id = null) {
        // Fetch the Individual by the route field
        $individual = Individual::where('route', $route)
                                ->first();

        $profile = $profile_id 
        ? $individual->individualProfiles()->with('individualContacts.contactType')->find($profile_id)
        : $individual->individualProfiles()->with('individualContacts.contactType')->where('is_default', true)->first();

        // Construct the vCard content
        $vcfData = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "FN:{$profile->first_name} {$profile->last_name}",
            "N:{$profile->last_name};{$profile->first_name};;;",
        ];
        // dd($profile->individualContacts);
        
        foreach ($profile->individualContacts as $contact) {

            if ($contact->contactType->name == 'Phone') {
                $vcfData[] = "TEL;TYPE=CELL:{$contact->contact_value}";
            } elseif ($contact->contactType->name == 'Email') {
                $vcfData[] = "EMAIL:{$contact->contact_value}";
            }
        }

        $vcfData[] = "END:VCARD";
        $vcfContent = implode("\n", $vcfData);

        // Create the file name
        $fileName = "{$profile->first_name}_{$profile->last_name}.vcf";

        // Create a StreamedResponse to handle the download
        return new StreamedResponse(function () use ($vcfContent) {
            echo $vcfContent;
        }, 200, [
            "Content-Type" => "text/vcard",
            "Content-Disposition" => "attachment; filename={$fileName}",
        ]);
    }
}
