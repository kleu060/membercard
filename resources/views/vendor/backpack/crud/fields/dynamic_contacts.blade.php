<div class="form-group">
<?php //dd( $field['attributes']['contactTypesArray'] ) ?>

    <input type="hidden" name="contacts" /> 
    <label>Contacts</label>
    <div id="contacts-container">
        <!-- Existing job titles will be populated here -->
    </div>
    <button type="button" id="add-contact" class="btn btn-primary">+ Add Contact</button>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        let container = document.getElementById('contacts-container');
        let contactsInput = document.querySelector('input[name="contacts"]');
        let addButton = document.getElementById('add-contact');

        // let contactTypeDropdown = "<select>";
        // let contactTypes = JSON.parse(@json($field['attributes']['contactTypesArray']) || '[]');
        // contactTypes.forEach(function(contactType)) {
        //     contactTypeDropdown += "<option value='"+contactType.id+"'>"+contactType.name+"</option>"
        // }
        // let contactTypeDropdown += "</select>";
        
        // Initialize job titles from the hidden input (if they exist)
        let contacts = JSON.parse( @json($field['attributes']['contactsArray']) || '[]');
        contacts.forEach(function(contact) {   
            addContactField(contact.contact_value, contact.contact_type_id);
        });


        // Function to add a job title field
        function addContactField(value = '' , contactTypeId = '') {
            let field = document.createElement('div');
            field.classList.add('input-group', 'mb-3');

            let input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.name = 'contacts_dynamic[]';
            input.value = value;
            
            let contactTypes = JSON.parse(@json($field['attributes']['contactTypesArray']) || '[]');
            let contactTypeSelectList = document.createElement('select');
            contactTypeSelectList.classList.add('form-select');

            contactTypeSelectList.name = 'contact_types_dynamic[]';
            contactTypes.forEach(contactType => {
                const opt = document.createElement('option');
                opt.value = contactType.id;
                opt.textContent = contactType.name;
                if ( contactTypeId == contactType.id ) {
                    opt.selected = true;
                }
                contactTypeSelectList.appendChild(opt);
            });

            //Remove Button
            let removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.classList.add('btn', 'btn-danger');
            removeButton.textContent = '-';
            removeButton.onclick = function () {
                field.remove();
                updateContact();
            };

            // Up Button
            let upButton = document.createElement('button');
            upButton.type = 'button';
            upButton.classList.add('btn', 'btn-secondary');
            upButton.textContent = '↑';
            upButton.onclick = function () {
                moveUp(field);
            };

            // Down Button
            let downButton = document.createElement('button');
            downButton.type = 'button';
            downButton.classList.add('btn', 'btn-secondary');
            downButton.textContent = '↓';
            downButton.onclick = function () {
                moveDown(field);
            };


            field.appendChild(input);
            field.appendChild(contactTypeSelectList);
            field.appendChild(upButton);
            field.appendChild(downButton);
            field.appendChild(removeButton);

            container.appendChild(field);
        }

        // Add a new empty field on button click
        addButton.addEventListener('click', function () {
            addContactField();
        });

        // Update hidden input with the JSON value of job titles
        function updateContacts() {
            // let allContacts = Array.from(document.querySelectorAll('input[name="contacts_dynamic[]"]'))
            //     .map(input => input.value);
            // contactsInput.value = JSON.stringify(allContacts);

            // Get all the contact text fields
            const contactTextFields = Array.from(document.querySelectorAll('input[name="contacts_dynamic[]"]'));

            // Create an array to store each contact with its associated type
            const allContacts = contactTextFields.map((textField, index) => {
                // Get the associated contact type select list by finding the select with the same index
                const contactType = document.querySelectorAll('select[name="contact_types_dynamic[]"]')[index];
                
                // Return an object with the contact text and the selected contact type
                return {
                    contact: textField.value,
                    contact_type: contactType ? contactType.value : null // Set to null if no associated type found
                };
            });
            contactsInput.value = JSON.stringify(allContacts);

        }

        // Function to move a field up
        function moveUp(field) {
            let previous = field.previousElementSibling;
            if (previous) {
                container.insertBefore(field, previous);
                updateContacts();
            }
        }

        // Function to move a field down
        function moveDown(field) {
            let next = field.nextElementSibling;
            if (next) {
                container.insertBefore(next, field);
                updateContacts();
            }
        }

        // Trigger update when form is submitted
        document.querySelector('form').addEventListener('submit', updateContacts);
    });
</script>
