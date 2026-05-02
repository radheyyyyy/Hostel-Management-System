DROP DATABASE IF EXISTS hostel_database;
CREATE DATABASE hostel_database;
USE hostel_database;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

INSERT INTO admins (username, password)
VALUES ('radhey', 'god');   -- Change password later

CREATE TABLE hostels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) UNIQUE,
  address VARCHAR(255)
);

-- Sample Data
INSERT INTO hostels (name, address) VALUES
('Shiva ji Boys Hostel', 'CSJMU'),
('Sawaran Hostel', 'CSJMU');

CREATE TABLE students (
  student_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  room_number VARCHAR(20),
  hostel_id INT NOT NULL,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
INSERT INTO students (student_id, name, phone, room_number, hostel_id) VALUES
('S001', 'Rahul Sharma', '9876543210', '101', 1),
('S002', 'Anjali Verma', '9123456780', '102', 1),
('S003', 'Amit Kumar', '9988776655', '103', 1),
('S004', 'Priya Singh', '9012345678', '104', 1),
('S005', 'Vikas Yadav', '9090909090', '105', 1),
('S006', 'Neha Gupta', '9345678123', '106', 1),
('S007', 'Rohit Mehta', '9765432109', '107', 1),
('S008', 'Sneha Reddy', '9654321870', '108', 1),
('S009', 'Karan Patel', '9543216789', '109', 1),
('S010', 'Pooja Nair', '9432109876', '110', 1),

('S011', 'Arjun Das', '9321098765', '201', 2),
('S012', 'Meera Iyer', '9210987654', '202', 2),
('S013', 'Suresh Babu', '9109876543', '203', 2),
('S014', 'Lakshmi Devi', '9098765432', '204', 2),
('S015', 'Manoj Tiwari', '9987654321', '205', 2),
('S016', 'Kavita Joshi', '9876501234', '206', 2),
('S017', 'Deepak Chauhan', '9765401235', '207', 2),
('S018', 'Aisha Khan', '9654301236', '208', 2),
('S019', 'Nitin Agarwal', '9543201237', '209', 2),
('S020', 'Simran Kaur', '9432101238', '210', 2);

CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  audience ENUM('all','hostel') NOT NULL DEFAULT 'all',
  hostel_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
INSERT INTO notices (title, body, audience)
VALUES (
  'Semester Reopening',
  'All students are informed that the new semester will commence from 10th August. Please report to your respective hostels before the date.',
  'all'
);
CREATE TABLE maintenance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL,
  hostel_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open','in_progress','closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Example
INSERT INTO maintenance_requests (student_id, hostel_id, category, description)
VALUES (
  'S001',
  (SELECT hostel_id FROM students WHERE student_id = 'S001'),
  'Electrical',
  'Fan is not working properly'
);

CREATE TABLE leave_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL,
  hostel_id INT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
INSERT INTO leave_applications (student_id, hostel_id, from_date, to_date, reason) VALUES
('S001', 1, '2025-11-10', '2025-11-12', 'Family Function'),
('S002', 1, '2025-11-15', '2025-11-16', 'Medical Checkup'),
('S003', 1, '2025-11-18', '2025-11-20', 'Personal Work'),
('S004', 1, '2025-11-22', '2025-11-25', 'Festival छुट्टी'),
('S005', 1, '2025-11-05', '2025-11-06', 'Urgent Travel'),

('S011', 2, '2025-11-12', '2025-11-14', 'Family Visit'),
('S012', 2, '2025-11-20', '2025-11-22', 'Sister Marriage'),
('S013', 2, '2025-11-25', '2025-11-27', 'Health Issue'),
('S014', 2, '2025-11-08', '2025-11-09', 'Personal Reason'),
('S015', 2, '2025-11-30', '2025-12-02', 'Festival Leave');
CREATE TABLE leave_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL,
  hostel_id INT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostels(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
        '2025-11-20','2025-11-22','Family Function');
