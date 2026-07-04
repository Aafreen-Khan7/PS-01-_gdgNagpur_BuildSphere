# 🏥 CareBridge – AI Discharge to Home Assistant

## 🌐 Live Deployment
👉 https://carebridge-486787434702.us-west1.run.app

---

## 📌 Overview

**CareBridge** is an AI-powered healthcare assistant designed to simplify hospital discharge instructions and improve patient recovery at home.

It converts complex medical discharge notes into:
- Simple language explanations
- Visual medicine schedules
- Color-coded emergency warnings
- Daily recovery checklists

The system ensures patients and caregivers clearly understand post-hospital care instructions, reducing confusion and readmission risks.

---

## 🚀 Problem Statement

Patients often leave hospitals with:
- Complex medical prescriptions
- Hard-to-understand discharge summaries
- No structured recovery guidance

This leads to:
- Medication errors
- Missed follow-ups
- Increased stress for families
- Poor recovery outcomes

---

## 💡 Solution

CareBridge transforms discharge notes into a **structured AI-generated recovery plan** that is:

- Easy to understand
- Visual and interactive
- Mobile-friendly
- Accessible via QR code or link

---

## ⚙️ Key Features

### 1️⃣ AI Discharge Simplifier (Core Feature)
- Accepts raw doctor/nurse discharge notes
- Uses AI (LLM integration) to convert medical text into:
  - Simple summary
  - Medicine instructions
  - Diet guidelines
  - Follow-up schedule
  - Emergency warning levels (Red/Yellow/Green)

---

### 2️⃣ Patient Recovery Dashboard
A clean, interactive interface for patients that includes:
- 💊 Medicine schedule tracker
- 🟢🟡🔴 Symptom warning system
- ☑️ Daily recovery checklist
- 📅 Follow-up reminders
- 👨‍👩‍👧 Shared access for family members

---

### 3️⃣ Firebase Integration (Backend-Lite)
- Firestore stores:
  - Patient records
  - AI-generated discharge plans
  - QR access links
- Real-time retrieval of patient recovery data
- Persistent cloud-based storage

---

### 4️⃣ QR-Based Access System
- Each discharge generates a unique QR code
- Patients can access their recovery dashboard instantly
- No login required for patients (frictionless UX)

---

## 🧠 AI Integration

CareBridge uses LLM-based AI to:
- Convert medical jargon into simple language
- Structure discharge instructions into JSON format
- Generate patient-friendly explanations
- Categorize symptoms into Red/Yellow/Green risk levels

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion (animations)
- React Router DOM

### Backend / Services
- Firebase Firestore (database)
- Firebase Hosting (optional deployment)
- OpenAI / Gemini API (AI processing)

### Utilities
- QR Code Generator
- Zustand (state management)
- i18n (multilingual support ready)

---

## 📊 System Workflow

```text
Doctor/Nurse enters discharge notes
        ↓
AI processes and structures data
        ↓
Data stored in Firebase Firestore
        ↓
QR code generated for patient access
        ↓
Patient opens dashboard via link/QR
        ↓
Recovery plan displayed (medicines, diet, warnings)
