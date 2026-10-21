# Google OAuth Client Setup Guide

Follow these steps to configure real Google Sign-In and "Switch Account" flow for your **Bangalore Restaurant Reuse Survey** web application.

---

## 1. Create a Google Cloud Project & OAuth Client ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project (e.g. `Bangalore Restaurant Survey`).
3. Navigate to **APIs & Services** > **OAuth consent screen**:
   - Choose **User Type**: `External` (or `Internal` if testing within a workspace domain).
   - Fill in **App Name** (`Bangalore Restaurant Survey`), **User support email**, and **Developer contact information**.
   - Click **Save and Continue** through Scopes (default `email`, `profile`, `openid` are sufficient).
   - Under **Test users**, add your testing Google email addresses if the app is in testing mode.
4. Navigate to **APIs & Services** > **Credentials**:
   - Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
   - Select **Application type**: `Web application`.
   - Set **Name**: `Restaurant Survey Web Client`.
   - Under **Authorized JavaScript origins**, add:
     - `http://localhost:5173`
     - `http://localhost:5174`
   - Under **Authorized redirect URIs**, add:
     - `http://localhost:5173`
     - `http://localhost:5174`
     - `http://localhost:5000/api/auth/google/callback`
   - Click **Create**.

---

## 2. Configure Environment Variables

Copy your **Client ID** and **Client Secret** from Google Cloud Console into your local `.env` file:

```env
# Frontend environment variables (Vite)
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"

# Backend environment variables (Express)
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
DATABASE_URL="file:./dev.db"
PORT=5000
```

> **Security Note:** `GOOGLE_CLIENT_SECRET` is kept strictly on the Node.js Express backend and is never exposed to the frontend browser bundle.

---

## 3. Running the Application

1. Start the Express backend server:
   ```bash
   npm run server
   ```
2. Start the Vite React frontend dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (or `http://localhost:5174`).

---

## 4. How the Google Sign-In & Switch Account Flow Works

- **Google Sign-In**: Clicking "Sign in with Google" prompts the Google Identity Services modal.
- **Account Verification**: The Google ID token / credential is sent to the backend `/api/auth/google` endpoint for server-side verification using `google-auth-library`.
- **Verified Email Prefill**: Once verified, the authenticated Google email automatically populates the survey's Email Address field.
- **Switch Account**: Clicking **"Switch account"** triggers Google's OAuth selector with `prompt=select_account`, opening Google's official account chooser interface so users can pick another Google account or choose "Use another account".
- **Fallback**: If a user skips Google sign-in or is offline, manual email input remains fully functional.
