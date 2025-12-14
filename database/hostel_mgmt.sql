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

-- Sample
INSERT INTO students (student_id, name, phone, room_number, hostel_id)
VALUES
('S1001','Amit Kumar','9000000001','101',(SELECT id FROM hostels WHERE name='North Hostel')),
('S1002','Priya Sharma','9000000002','102',(SELECT id FROM hostels WHERE name='North Hostel')),
('S1003','Raj Verma','9000000003','201',(SELECT id FROM hostels WHERE name='South Hostel'));

CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  audience ENUM('all','hostel') NOT NULL DEFAULT 'all',
  hostel_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_notice
    CHECK ((audience='all' AND hostel_id IS NULL) OR (audience='hostel' AND hostel_id IS NOT NULL)),
  FOREIGN KEY (hostel_id) REFERENCES hostels(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Samples
INSERT INTO notices (title, body, audience)
VALUES ('Welcome', 'Welcome to new semester!', 'all');

INSERT INTO notices (title, body, audience, hostel_id)
VALUES ('Water Supply Issue', 'Water supply off tomorrow', 'hostel',
        (SELECT id FROM hostels WHERE name='North Hostel'));

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
VALUES ('S1001',(SELECT hostel_id FROM students WHERE student_id='S1001'),'Electrical','Tube light not working');

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

-- Sample Leave Request
INSERT INTO leave_applications (student_id, hostel_id, from_date, to_date, reason)
VALUES ('S1002',(SELECT hostel_id FROM students WHERE student_id='S1002'),
        '2025-11-20','2025-11-22','Family Function');
