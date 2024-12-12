
<template>
    <main class="card-container">
        <section class="card-header">
            <img class="banner" :src="bannerImage">
            <div class="thumbnail-container">
                <img class="thumbnail" :src="thumbnail" />
            </div>
            <div class="select-profile">
                <div class="profile-dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Select Profile
                    </button>
                    <ul class="dropdown-menu profile-dropdown-menu">

                        <li v-for="profile in localProfiles" :key="profile.id">
                            <button class="dropdown-item" @click="selectProfile(profile.id)">
                                {{ profile.profile_name }}
                            </button>
                        </li>

<!--                         
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li> -->
                    </ul>
                </div>
            </div>
        </section>
        <section class="card-profile-body layout-intent">
            <div class="profile-name large-bold">{{ first_name }}{{ last_name }}</div>
            <!-- <div class="profile-title">資深區域經理</div> -->
            <ul class="profile-title-list card-list">
                <li class="profile-title" v-for="(title, index) in titles" :key="index">
                    {{ title.title }}
                </li>
            </ul>
            <div class="profile-description" v-html="formattedDescription"></div>
        </section>
        <section class="card-contact-list layout-intent">
            <ul class="profile-contact-list card-list">
                <li class="contact" v-for="(contact, index) in contacts" :key="index">
                    <a v-if="contact.contact_type && contact.contact_type.name === 'Phone'" :href="`tel:${contact.contact_value}`"> 
                        <i :class="contact.contact_type.icon_class"></i>{{contact.contact_value}}
                    </a>
                    <a v-else-if="contact.contact_type && contact.contact_type.name === 'Email'" :href="`mailto:${contact.contact_value}`"> 
                        <i :class="contact.contact_type.icon_class"></i>{{contact.contact_value}}
                    </a>
                    <a v-else="contact.contact_type" :href="`{{contact.contact_value}}`"> 
                        <i :class="contact.contact_type.icon_class"></i>{{contact.contact_value}}
                    </a>
                </li>
                
            </ul>
        </section>
        <section class="card-save-contact layout-intent">
            <a :href="vcfDownloadUrl" class="btn btn-primary"><i class="las la-address-book"></i>Save Contact</a>
        </section>
    </main>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
            this.fetchIndividualProfile();
            this.fetchIndividualData();
        },
        props: {
            route: {
                type: String,
                required: true
            },
            profileId: {
                type: String,
                default: ""
            },
            individualProfiles: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                banner_image: null,
                thumbnail: null,
                first_name: null, // holds the API response data
                last_name: null, // holds the API response data
                titles: null, // holds the API response data
                description: "", // holds the API response data
                contacts: null, // holds the API response data
                localProfileId: this.profileId, // Initialize local state from prop
                localProfiles: [...this.individualProfiles], // Initialize local state from prop

            };
        },
        methods: {
            async fetchIndividualData() {
                try {
                    const response = await axios.get(`/api/individual/${this.route}/${this.localProfileId}`);
                    
                    // Assign the response data to the component’s data properties
                    this.bannerImage = response.data.organizationImage.original_path; 
                    this.thumbnail = response.data.individualProfile.image.original_path; 
                    this.first_name = response.data.individualProfile.profile.first_name; 
                    this.last_name = response.data.individualProfile.profile.last_name;
                    this.description = response.data.individualProfile.profile.description;
                    this.titles = response.data.individualProfile.titles;
                    this.contacts = response.data.individualProfile.contacts;
                    
                } catch (error) {
                    console.error("Error fetching individual data:", error);
                }
            },
            async fetchIndividualProfile() {
                try {
                    const response = await axios.get(`/api/individualProfile/${this.route}`);
                    console.log(response.data);
                    this.localProfiles = response.data;
                    // console.log(this. response.data);
                    // this.$emit("update:individualProfiles", response.data); // Update parent state if using v-model
                } catch (error) {
                    console.error("Error fetching individual profile data:", error);
                }

            },
            selectProfile(selectedProfileId) {
                console.log("Selected profile:", selectedProfileId);
                // this.$emit("update:profileId", profileId); // Notify parent of selection
                this.localProfileId = selectedProfileId;
                this.fetchIndividualData();
            },
            
        },
        computed: {
            formattedDescription() {
                // Replace \r\n, \n, or \r with <br />
                return this.description.replace(/(\r\n|\n|\r)/g, "<br />");
            },
            vcfDownloadUrl() {
                // Construct the URL based on the props
                return `/api/downloadvcf/${this.route}/${this.profileId || ''}`;
            },
            telUrl(tel) {
                return "tel:"+this.telUrl;
            }


        }
        
    }
</script>