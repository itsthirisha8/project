# 🌐 Cloud Deployment Guide

This guide outlines how to deploy the AI Resume Builder to popular cloud platforms.

## 🚀 Deployment to Render (Recommended)

Render is great for Flask apps because it manages the environment well.

1. **Push your code to GitHub**.
2. **Create a new "Web Service"** on Render.
3. **Connect your repository**.
4. **Configure the Service**:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (Note: You'll need to add `gunicorn` to `requirements.txt`)
5. **Environment Variables**:
   - Add `SECRET_KEY`
   - Add `OPENAI_API_KEY`
   - Add `PYTHON_VERSION`: `3.10.x` or similar.
6. **Deploy**.

## 🚀 Deployment to Heroku

1. **Install Heroku CLI**.
2. **Create a `Procfile`**:
   ```
   web: gunicorn app:app
   ```
3. **Login and Create App**:
   ```bash
   heroku login
   heroku create ai-resume-builder-yourname
   ```
4. **Set Config Vars**:
   ```bash
   heroku config:set SECRET_KEY=your-secret
   heroku config:set OPENAI_API_KEY=sk-...
   ```
5. **Push to Heroku**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push heroku main
   ```

## 🛠️ PostgreSQL (Optional but Recommended for Production)

SQLite is fine for small apps, but if you expect high traffic, switch to PostgreSQL.
1. Add `psycopg2-binary` to `requirements.txt`.
2. Update `DATABASE_URL` in your environment variables to your Postgres connection string.
3. Render/Heroku provide managed Postgres databases.

## ⚠️ Important Considerations

- **Secret Keys**: Never hardcode secret keys. Always use `.env` or system environment variables.
- **Costs**: OpenAI requests are not free. Monitor your usage at `platform.openai.com`.
- **ATS Compliance**: Ensure that any CSS additions don't break the single-column text flow of the preview page.
