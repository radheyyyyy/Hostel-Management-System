# 📘 Hostel Management System

A simple Hostel Management System web application designed for students and beginners to understand full-stack development using HTML, CSS, Node.js, Express, and MySQL.

This project can be used for:

* College mini / major projects

* Learning full-stack web development

* Hostel or student management system demos


## 🚀 Features

* Student Login System

* Admin Dashboard

* Student Dashboard

* Hostel & Student Data Management

* MySQL Database Integration

* Simple and beginner-friendly UI


## 🛠️ Tech Stack
### Frontend

* HTML5

* CSS3

* JavaScript

### Backend

* Node.js

* Express.js

### Database

* MySQL



## 📂 Project Structure

Hostel Management System/

│

├── backend/

│   ├── server.js

│   ├── package.json

│   ├── package-lock.json

│   └── .env

│

├── frontend/

│   ├── admin-dashboard.html

│   ├── student-dashboard.html

│   ├── student-login.html

│   └── styles.css

│

├── database/

│   └── hostel_mgmt.sql

│

└── README.md

## ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/hostel-management-system.git
cd hostel-management-system
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```bash
PORT=3000

DB_HOST=localhost

DB_USER=root #change it if needed

DB_PASSWORD=your_password

DB_NAME=hostel_mgmt
```
## 🔧 Database Configuration (Important)

After cloning the project, you **must update the database credentials**
inside the `backend/server.js` file according to your system.

### Example:
```js
// ===== DB CONFIG =====
const dbConfig = {
  host: 'localhost',
  user: 'root',          // change if needed
  password: '',          // your MySQL password
  database: 'hostel_mgmt', // your database name
  port: 3306
};
```
### 3️⃣ Database Setup

1. Open **phpMyAdmin** or MySQL CLI

2. Create a database named:
```bash
CREATE DATABASE hostel_mgmt;
```

3. Import the file:
```bas
database/hostel_mgmt.sql
```
### 4️⃣ Run the Server
```bash
node server.js
```

Server will start at:
```bash
http://localhost:5500
```
### 5️⃣ Frontend Usage

* Open `frontend/student-login.html` in your browser

* Admin and Student dashboards can be accessed after login

## 👨‍🎓 Who Can Use This Project?

* BCA / MCA / B.Tech / Diploma Students

* Beginners learning Node.js & MySQL

* Students working on academic projects

## 📌 Important Notes

* This project is made for learning purposes

* Security features are basic

* Feel free to improve UI, validation, and authentication

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository

1. Create a new branch

1. Make your changes

1. Submit a Pull Request

## 📜 License

This project is licensed under the MIT License

You are free to use, modify, and distribute it for educational purposes.

## ⭐ Support

If this project helped you:

* Give it a ⭐ on GitHub

* Share it with other students

## 📧 Contact

Author: Rajyavardhan Radhey

Course: CSE (AI)

University: Chhatrapati Shahu Ji Maharaj University, Kanpur

## 📌 Recommended Extra Files for GitHub

You should also add these files:

`.gitignore`
```bash
node_modules/
.env
```
`LICENSE`

Use **MIT License** (best for student projects)
