# VoEx — Voice Expense Tracker

A fast, modern, voice-powered expense tracker built with a full-stack JavaScript setup. Users can log expenses by speaking or typing, and the system automatically parses, cleans, and categorizes the input using Gemini AI.

The goal: make expense tracking effortless, quick, and natural.

⸻

🚀 Features

🎤 Voice Input  
Tap the mic, speak your expense (“250 for pizza”), and it gets processed instantly.

💬 Command Interface  
A clean, full-screen command UI where users can type or speak commands.

🤖 AI-Powered Parsing  
Uses Google Gemini to extract:
- Amount
- Category
- Description
- Date
- Optional location  
Even with messy voice transcripts.

📊 Dashboard
- Monthly total
- Daily average
- Most spent category
- Recent transactions
- Fully responsive layout

🗃️ Local Database (Prisma + PostgreSQL)  
All expenses are stored securely and can be queried easily.

🧩 Modular Architecture  
Backend services (refine.service, gemini.service) are separated for clarity and easy maintenance.

⸻

🏗️ Tech Stack

Frontend
- React + Vite
- Zustand (state mgmt)
- Framer Motion
- Tailwind + shadcn/ui
- SpeechRecognition API

Backend
- Node + Express
- Prisma ORM
- PostgreSQL
- Google Gemini (Generative AI SDK)

⸻

📡 How It Works (High-Level)
1. User speaks or types an expense  
2. The text is sent to a refinement endpoint  
3. Gemini cleans + parses the data  
4. User confirms the result  
5. Backend saves it to the database  
6. Dashboard updates in real-time

⸻
