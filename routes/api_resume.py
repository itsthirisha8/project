from flask import Blueprint, request, jsonify, send_file
from flask_login import login_required, current_user
from models import db, Resume, ResumeVersion
from utils.docx_generator import generate_resume_docx
import json
import io

resume_bp = Blueprint('api_resume', __name__, url_prefix='/api/resume')

# ... (previous routes) ...

@resume_bp.route('/export/docx/<int:resume_id>', methods=['GET'])
@login_required
def export_docx(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    if resume.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    file_stream = generate_resume_docx(resume)
    return send_file(
        file_stream,
        as_attachment=True,
        download_name=f"{resume.title.replace(' ', '_')}.docx",
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

@resume_bp.route('/save', methods=['POST'])
@login_required
def save_resume():
    data = request.json
    resume_id = data.get('id')
    title = data.get('title', 'My Resume')
    job_role = data.get('job_role', '')
    content = data.get('content')

    if resume_id:
        resume = Resume.query.get(resume_id)
        if not resume or resume.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Save old version before updating
        old_version = ResumeVersion(
            resume_id=resume.id,
            content=resume.content,
            version_label=f"Auto-save {resume.updated_at.strftime('%Y-%m-%d %H:%M')}"
        )
        db.session.add(old_version)
        
        resume.title = title
        resume.job_role = job_role
        resume.content = json.dumps(content)
    else:
        resume = Resume(
            user_id=current_user.id,
            title=title,
            job_role=job_role,
            content=json.dumps(content)
        )
        db.session.add(resume)

    db.session.commit()
    return jsonify({'success': True, 'id': resume.id})

@resume_bp.route('/<int:resume_id>', methods=['GET'])
@login_required
def get_resume(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    if resume.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'id': resume.id,
        'title': resume.title,
        'job_role': resume.job_role,
        'content': json.loads(resume.content)
    })
