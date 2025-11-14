# 📚 Hostel Management System

A complete Hostel Management System (HMS) built using Node.js, Express, MySQL, and a lightweight HTML/CSS/JS frontend.
This project manages students, rooms, allotments, leaves, maintenance, and notices — all through a simple API-driven admin panel.

## 🚀 Features

### 🔐 Authentication

- Admin login system

- Secure route handling

- Token-based authentication (demo token — can be upgraded to JWT)

### 🧑‍🎓 Student Management

- Add new students

- View all registered students

- Update or delete student entries

### 🏠 Room & Hostel Management

- Add and manage hostel blocks

- Add, view, update, or delete rooms

- Track room capacity and availability

### 🛏 Allotment System

- Assign students to rooms

- Track who is allotted to which hostel/room

- Update or vacate room allotments

### 📝 Leave Management

- Students can request leaves

- Admin can approve/reject leave requests

### 🛠 Maintenance Requests

- Students can raise complaints

- Admin can track status (pending/resolved)

### 📢 Notices

- Admin can publish notices displayed on frontend

## 🏗️ Tech Stack

### Frontend

- HTML5 / CSS3

- JavaScript (Vanilla)

- Fetch API for backend communication

### Backend

- Node.js

- Express.js

- MySQL2 (Promise-based)

### Database

- MySQL

- Structured SQL schema included (database/hostel_database.sql)

## 📁 Project Structure

hostel-dbms/

├── backend/

│   ├── db/

│   │   ├── db.js

│   │   └── index.js

│   ├── routes/

│   │   ├── auth.js

│   │   ├── students.js

│   │   ├── rooms.js

│   │   ├── hostels.js

│   │   ├── allotments.js

│   │   ├── leaves.js

│   │   ├── maintenance.js

│   │   └── notices.js

│   ├── server.js

│   ├── package.json

│   └── .env

│

├── frontend/

│   ├── index.html

│   ├── admin/

│   │   ├── allotment.html

│   │   └── ...

│   ├── css/

│   ├── js/

│   │   ├── frontend.js

│   │   └── admin-allotment.js

│

└── database/── hostel_database.sql

## 🔧 Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/your-username/hostel-dbms.git

cd hostel-dbms/backend

## 2️⃣Install backend dependencies

`npm install`

## 3️⃣ Configure environment variables

Create .env inside /backend:

DB_HOST=localhost

DB_USER=root

DB_PASS=yourpassword

DB_NAME=hostel_mgmt_database

PORT=5500

## 4️⃣ Import the MySQL Database

Open MySQL and run:

`SOURCE database/hostel_database.sql;`


(or import using phpMyAdmin / MySQL Workbench)

## 5️⃣ Start the Backend Server
npm start


Server runs at:
👉 http://localhost:5500

## 6️⃣ Open the Frontend

Simply open frontend/index.html in a browser.

(Or use Live Server in VS Code)

# To be updated soon

📜 License

This project is open-source under the MIT License.
