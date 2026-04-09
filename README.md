# 🚀 Learning Management System (LMS)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-MERN-blueviolet)
![Frontend](https://img.shields.io/badge/frontend-React.js-blue)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Database](https://img.shields.io/badge/database-MongoDB-darkgreen)
![Status](https://img.shields.io/badge/status-Active-success)

A production-ready full-stack Learning Management System (LMS) where **Educators create & sell courses** and **Students purchase & learn**, powered by secure payment integration.

---

## 🔗 Live Links
- 📂LIVE DEMO LiNK:-https://learning-management-system-1-68gx.onrender.com

---

## 📌 Overview

This platform is designed as a real-world EdTech solution supporting course monetization, role-based access, and secure transactions. It demonstrates scalable backend architecture and production-level practices.

---

## 🎯 Key Highlights

- Role-based system (**Student / Educator**)  
- Secure course purchase system  
- Razorpay payment integration  
- Scalable backend architecture  
- Redis caching for performance  
- Clean and modular code structure  

---

## 👥 User Roles

### 👨‍🎓 Student
- Register/Login  
- Browse courses  
- Purchase paid courses  
- Access enrolled content  
- Track progress  

### 👨‍🏫 Educator
- Create & manage courses  
- Upload videos/material  
- Track enrollments  
- Monitor course performance  

---

## 💳 Payment Integration

Integrated with Razorpay for secure transactions:

- Order creation from backend  
- Secure payment flow  
- Signature verification  
- Enrollment after successful payment  

---

## 🧱 Tech Stack

**Frontend**
- React.js  
- Tailwind CSS  

**Backend**
- Node.js  
- Express.js  

**Database**
- MongoDB  

**Other Tools**
- JWT Authentication  
- Redis (Caching)  
- Razorpay API  

---

## 🏗️ Architecture

- REST API architecture  
- Controller-Service pattern  
- JWT-based stateless authentication  
- Redis caching layer  
- Modular and scalable folder structure  

---

## 📂 Project Structure


learning-management-system/
│
├── learning-management-system-Backend/ # Backend (Node.js + Express)
│ ├── config/ # Database & environment configuration
│ ├── controller/ # Request handling logic
│ ├── middleware/ # Authentication & error handling
│ ├── model/ # Database schemas
│ ├── route/ # API routes
│ ├── public/ # Static files
│ ├── index.js # Entry point
│ ├── package.json
│ └── package-lock.json
│
├── learning-management-system-fronted/ # Frontend (React + Vite)
│ ├── public/ # Static assets
│ ├── src/ # Main source code
│ ├── utils/ # Helper functions
│ ├── index.html
│ ├── vite.config.js
│ ├── eslint.config.js
│ ├── package.json
│ └── package-lock.json
│
├── .gitignore
└── README.md


---

## 🧠 Architecture Overview

- **Frontend (React)**: Responsible for UI/UX, state management, and API communication  
- **Backend (Node.js + Express)**: Handles business logic, authentication, authorization, and API endpoints  
- **Database (MongoDB)**: Stores user data, courses, enrollments, and transactions  
- **Caching (Redis)**: Improves performance by caching frequently accessed data  
- **Payment Gateway (Razorpay)**: Handles secure course purchase transactions  


