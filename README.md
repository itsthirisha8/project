# 🚀 AI-Powered Resume Builder

A full-stack, ATS-friendly resume builder with AI assistance, real-time scoring, and professional exporting.

## ✨ Features
- **User Authentication**: Secure signup and login.
- **AI Chat Assistant**: Real-time help for writing summaries and experience bullets.
- **ATS-Friendly Templates**: Clean, single-column designs that pass HR screening systems.
- **ATS Score Checker**: Match your resume against any job description with AI-driven feedback.
- **Multi-format Export**: Download as professional DOCX or Print to PDF.
- **Dark Mode**: Soft and modern UI with light/dark theme support.
- **Dashboard**: Manage multiple resumes and view career analytics.

## 🛠️ Tech Stack
- **Backend**: Python Flask
- **Frontend**: HTML, Vanilla CSS, JavaScript
- **Database**: SQLite (SQLAlchemy)
- **AI**: OpenAI API (GPT-3.5)
- **Utilities**: `python-docx` for document generation

## 📋 Installation & Local Setup

1. **Clone the project**:
   ```bash
   cd "flask project"
   ```

2. **Set up Virtual Environment** (Optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Open `.env` and add your OpenAI API Key:
   ```
   SECRET_KEY=your-secret-key
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

5. **Initialize Database**:
   The database will be automatically created on first run.

6. **Run the Application**:
   ```bash
   python app.py
   ```
   Visit `http://127.0.0.1:5000` in your browser.

## 🔑 Admin Access
To access the admin panel at `/admin`, change the `role` to `'admin'` for your user in the `resume_builder.db` using a SQLite browser or the Flask shell.

## 📝 License
MIT License. Built with ❤️ for your career success.
