<div class="form-group">
    <label>Job Titles</label>
    <div id="job-titles-container">
        <!-- Existing job titles will be populated here -->
    </div>
    <button type="button" id="add-job-title" class="btn btn-primary">+ Add Job Title</button>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        let container = document.getElementById('job-titles-container');
        let jobTitlesInput = document.querySelector('input[name="job_titles"]');
        let addButton = document.getElementById('add-job-title');
        
        // Initialize job titles from the hidden input (if they exist)
        let jobTitles = JSON.parse(jobTitlesInput.value || '[]');
        jobTitles.forEach(function(title) {
            addJobTitleField(title);
        });

        // Function to add a job title field
        function addJobTitleField(value = '') {
            let field = document.createElement('div');
            field.classList.add('input-group', 'mb-3');

            let input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.name = 'job_titles_dynamic[]';
            input.value = value;

            let removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.classList.add('btn', 'btn-danger');
            removeButton.textContent = '-';
            removeButton.onclick = function () {
                field.remove();
                updateJobTitles();
            };

            field.appendChild(input);
            field.appendChild(removeButton);
            container.appendChild(field);
        }

        // Add a new empty field on button click
        addButton.addEventListener('click', function () {
            addJobTitleField();
        });

        // Update hidden input with the JSON value of job titles
        function updateJobTitles() {
            let allJobTitles = Array.from(document.querySelectorAll('input[name="job_titles_dynamic[]"]'))
                .map(input => input.value);
            jobTitlesInput.value = JSON.stringify(allJobTitles);
        }

        // Trigger update when form is submitted
        document.querySelector('form').addEventListener('submit', updateJobTitles);
    });
</script>
