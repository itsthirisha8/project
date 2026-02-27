from flask import Blueprint, request, jsonify
from flask_login import login_required
import openai
import os
from config import Config

ai_bp = Blueprint('api_ai', __name__, url_prefix='/api/ai')

openai.api_key = Config.OPENAI_API_KEY

@ai_bp.route('/chat', methods=['POST'])
@login_required
def chat():
    data = request.json
    user_message = data.get('message')

    if not openai.api_key:
        return jsonify({'reply': "OpenAI API key is not configured. Please add it to your .env file."})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional career coach and resume expert. Help the user write impactful, ATS-friendly resume content. Keep responses concise and professional."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'reply': f"Error: {str(e)}"})

@ai_bp.route('/ats_score', methods=['POST'])
@login_required
def ats_score():
    data = request.json
    resume_text = data.get('resume_text')
    job_description = data.get('job_description')

    prompt = f"""
    Analyze the following resume against the job description.
    Resume: {resume_text}
    Job Description: {job_description}
    
    Provide:
    1. Match percentage (0-100)
    2. Missing keywords
    3. 3 suggestions for improvement
    
    Format as JSON: {{"score": 85, "missing_keywords": ["Python", "AWS"], "suggestions": ["...", "...", "..."]}}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an ATS (Applicant Tracking System) analyzer."},
                {"role": "user", "content": prompt}
            ]
        )
        # Parse the JSON from AI response (safely)
        import json
        analysis = json.loads(response.choices[0].message.content)
        return jsonify(analysis)
    except Exception as e:
        return jsonify({'error': str(e)})
