<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6f63c283-87d5-4af3-9fbc-5a4ffab88c18

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set your configuration in the root [.env](.env) file (Copy from [.env.example](backend/.env.example) if missing):
   - `MONGODB_URI`: Your MongoDB connection string (e.g., Atlas or local)
   - `GOOGLE_CLIENT_ID`: Your Google OAuth2 Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth2 Client Secret
   - `GEMINI_API_KEY`: Your Gemini API key for AI features

   > [!TIP]
   > If using MongoDB Atlas, ensure your current IP address is whitelisted in the Atlas Network Access settings!

3. Run the app:
   `npm run dev` (This starts both frontend and backend)
