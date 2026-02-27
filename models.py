from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user') # 'user' or 'admin'
    resumes = db.relationship('Resume', backref='author', lazy=True)

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False, default='My Resume')
    job_role = db.Column(db.String(100))
    # content will store the JSON string of all resume sections
    content = db.Column(db.Text, nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Versioning
    versions = db.relationship('ResumeVersion', backref='resume', lazy=True, cascade="all, delete-orphan")

    def set_content(self, data):
        self.content = json.dumps(data)

    def get_content(self):
        return json.loads(self.content)

class ResumeVersion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resume.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    version_label = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ATSAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resume.id'), nullable=False)
    score = db.Column(db.Integer)
    missing_keywords = db.Column(db.Text) # Stored as JSON or comma separated
    suggestions = db.Column(db.Text)
    job_description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
