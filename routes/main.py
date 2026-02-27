from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from models import Resume

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    return render_template('index.html')

@main_bp.route('/dashboard')
@login_required
def dashboard():
    resumes = Resume.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', resumes=resumes)

@main_bp.route('/builder/<int:resume_id>')
@login_required
def builder(resume_id=None):
    resume = None
    if resume_id:
        resume = Resume.query.get_or_404(resume_id)
        if resume.user_id != current_user.id:
            return redirect(url_for('main.dashboard'))
    return render_template('builder.html', resume=resume)

@main_bp.route('/preview/<int:resume_id>')
@login_required
def preview(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    if resume.user_id != current_user.id:
        return redirect(url_for('main.dashboard'))
    return render_template('preview.html', resume=resume)

@main_bp.route('/ats_score/<int:resume_id>')
@login_required
def ats_score(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    if resume.user_id != current_user.id:
        return redirect(url_for('main.dashboard'))
    return render_template('ats_score.html', resume=resume)
