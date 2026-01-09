# 🚀 URLMinify App - Advanced URL Shortener with Analytics

**URL Minify** is a high-performance Full-Stack URL shortening application built with the **MERN Stack**. While part of a Full Stack domain, this project specifically showcases advanced **Backend Engineering** principles, including REST API design, database optimization, and real-time analytics tracking.

## 🌟 Key Features
- **Custom Short Codes:** Users can define their own branded links.
- **Real-time Analytics:** Tracks total clicks and last-clicked timestamps.
- **Data Visualization:** Interactive charts using Recharts to monitor link performance.
- **Glassmorphic UI:** Modern, responsive interface built with Tailwind CSS and Framer Motion.
- **Secure Architecture:** Robust error handling and CORS configurations.

## 🛠️ Technical Stack
- **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide React.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Atlas) with Mongoose ODM.
- **API Testing:** Postman.
- **Deployment:** - **Frontend:** Vercel (Optimized for Edge delivery).
  - **Backend:** Koyeb (High-availability Instance).

## 🏗️ Backend Architecture
The core of this project lies in its scalable backend:
- **Hybrid Deletion Logic:** Supports deletion via both MongoDB `_id` and `shortCode`.
- **Atomic Increments:** Efficiently updates click counts using MongoDB persistence.
- **Middleware Integration:** Implements Express JSON parsing and CORS for secure cross-origin communication.

### ✨ Developed by
**Rehman-Dev288**
*Passionate Full-Stack Developer | Backend Specialist*

# 🚀 Live Demo & Repo
- **Live Demo:** [https://urlminify-app.vercel.app/]