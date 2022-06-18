CREATE DATABASE employeetracker_db;
USE employeetracker_db;

CREATE TABLE departments (
  id INT auto_increment PRIMARY KEY,
  dept_name VARCHAR(30)
);

CREATE TABLE roles (
  id INT auto_increment PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(8,2),
  dept_id INT,
  FOREIGN KEY(dept_id)
  REFERENCES departments(id)
);

CREATE TABLE employees (
  id INT auto_increment PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY(role_id) 
  REFERENCES roles(id)
);



