document.addEventListener('DOMContentLoaded', async () => {
    const resumeTitleInput = document.getElementById('resume-title');
    const saveBtn = document.getElementById('btn-save');
    const previewBtn = document.getElementById('btn-preview');
    const atsScoreBtn = document.getElementById('btn-ats-score');
    const saveStatus = document.getElementById('save-status');

    const urlParts = window.location.pathname.split('/');
    let currentResumeId = urlParts[urlParts.length - 1];
    if (isNaN(currentResumeId)) currentResumeId = null;

    // Load existing data if edit mode
    if (currentResumeId) {
        try {
            const response = await fetch(`/api/resume/${currentResumeId}`);
            const data = await response.json();
            populateForm(data);
        } catch (error) {
            console.error('Failed to load resume:', error);
        }
    }

    // Dynamic Row Handlers
    window.addExperience = function (data = {}) {
        const list = document.getElementById('experience-list');
        const div = document.createElement('div');
        div.className = 'entry-card';
        div.innerHTML = `
            <span class="remove-entry" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></span>
            <div class="grid grid-2">
                <div class="form-group"><label class="form-label">Title</label><input type="text" class="form-input" placeholder="Senior Dev" value="${data.title || ''}"></div>
                <div class="form-group"><label class="form-label">Company</label><input type="text" class="form-input" placeholder="Tech Inc" value="${data.company || ''}"></div>
                <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" placeholder="Global" value="${data.location || ''}"></div>
                <div class="form-group"><label class="form-label">Dates</label><input type="text" class="form-input" placeholder="2020 - Present" value="${data.dates || ''}"></div>
            </div>
            <div class="form-group">
                <textarea class="form-input" rows="3" placeholder="Description...">${data.description || ''}</textarea>
            </div>
        `;
        list.appendChild(div);
    };

    window.addEducation = function (data = {}) {
        const list = document.getElementById('education-list');
        const div = document.createElement('div');
        div.className = 'entry-card';
        div.innerHTML = `
            <span class="remove-entry" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></span>
            <div class="grid grid-2">
                <div class="form-group"><label class="form-label">Degree</label><input type="text" class="form-input" placeholder="B.S. CS" value="${data.degree || ''}"></div>
                <div class="form-group"><label class="form-label">School</label><input type="text" class="form-input" placeholder="University X" value="${data.school || ''}"></div>
                <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" placeholder="City" value="${data.location || ''}"></div>
                <div class="form-group"><label class="form-label">Dates</label><input type="text" class="form-input" placeholder="2016 - 2020" value="${data.dates || ''}"></div>
            </div>
        `;
        list.appendChild(div);
    };

    window.addProject = function (data = {}) {
        const list = document.getElementById('projects-list');
        const div = document.createElement('div');
        div.className = 'entry-card';
        div.innerHTML = `
            <span class="remove-entry" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></span>
            <div class="form-group"><label class="form-label">Project Name</label><input type="text" class="form-input" value="${data.name || ''}"></div>
            <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" rows="2">${data.description || ''}</textarea></div>
        `;
        list.appendChild(div);
    };

    window.addCertification = function (data = {}) {
        const list = document.getElementById('certification-list');
        const div = document.createElement('div');
        div.className = 'entry-card';
        div.innerHTML = `
            <span class="remove-entry" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></span>
            <div class="grid grid-2">
                <div class="form-group"><label class="form-label">Title</label><input type="text" class="form-input" value="${data.title || ''}"></div>
                <div class="form-group"><label class="form-label">Issuer</label><input type="text" class="form-input" value="${data.issuer || ''}"></div>
            </div>
        `;
        list.appendChild(div);
    };

    // Save Logic
    saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const data = collectFormData();

        try {
            const response = await fetch('/api/resume/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                currentResumeId = result.id;
                if (!window.location.href.includes(currentResumeId)) {
                    window.history.pushState({}, '', `/builder/${currentResumeId}`);
                }
                saveStatus.innerText = 'Saved ' + new Date().toLocaleTimeString();
                saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
            }
        } catch (error) {
            console.error('Save failed:', error);
            saveBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        } finally {
            setTimeout(() => {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Now';
            }, 2000);
        }
    });

    previewBtn.addEventListener('click', () => {
        if (currentResumeId) window.location.href = `/preview/${currentResumeId}`;
        else alert("Please save your resume first!");
    });

    atsScoreBtn.addEventListener('click', () => {
        if (currentResumeId) window.location.href = `/ats_score/${currentResumeId}`;
        else alert("Please save your resume first!");
    });

    function collectFormData() {
        const content = {
            personal: {},
            summary: document.querySelector('[name="summary"]').value,
            experience: [],
            education: [],
            projects: [],
            skills: document.querySelector('[name="skills"]').value,
            certifications: [],
            achievements: document.querySelector('[name="achievements"]').value,
            languages: document.querySelector('[name="languages"]').value
        };

        // Personal
        document.querySelectorAll('#section-personal .form-input').forEach(input => {
            content.personal[input.name] = input.value;
        });

        // Experience
        document.querySelectorAll('#experience-list .entry-card').forEach(card => {
            const inputs = card.querySelectorAll('input');
            content.experience.push({
                title: inputs[0].value,
                company: inputs[1].value,
                location: inputs[2].value,
                dates: inputs[3].value,
                description: card.querySelector('textarea').value
            });
        });

        // Education
        document.querySelectorAll('#education-list .entry-card').forEach(card => {
            const inputs = card.querySelectorAll('input');
            content.education.push({ degree: inputs[0].value, school: inputs[1].value, location: inputs[2].value, dates: inputs[3].value });
        });

        // Projects
        document.querySelectorAll('#projects-list .entry-card').forEach(card => {
            content.projects.push({ name: card.querySelector('input').value, description: card.querySelector('textarea').value });
        });

        // Certifications
        document.querySelectorAll('#certification-list .entry-card').forEach(card => {
            const inputs = card.querySelectorAll('input');
            content.certifications.push({ title: inputs[0].value, issuer: inputs[1].value });
        });

        return {
            id: currentResumeId,
            title: resumeTitleInput.value,
            job_role: content.personal.full_name ? ('Resume of ' + content.personal.full_name) : 'Resume',
            content: content
        };
    }

    function populateForm(data) {
        resumeTitleInput.value = data.title;
        const c = data.content;

        // Personal
        document.querySelectorAll('#section-personal .form-input').forEach(input => {
            input.value = c.personal[input.name] || '';
        });

        document.querySelector('[name="summary"]').value = c.summary || '';
        document.querySelector('[name="skills"]').value = c.skills || '';
        document.querySelector('[name="achievements"]').value = c.achievements || '';
        document.querySelector('[name="languages"]').value = c.languages || '';

        // Dynamic lists
        if (c.experience) c.experience.forEach(exp => addExperience(exp));
        if (c.education) c.education.forEach(edu => addEducation(edu));
        if (c.projects) c.projects.forEach(prj => addProject(prj));
        if (c.certifications) c.certifications.forEach(cert => addCertification(cert));

        // If lists empty, add one empty row for better UX? 
        // Let's not for now to keep it clean.
    }
});
