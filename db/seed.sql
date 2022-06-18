
/*Sample Data I found online for the OFFICE FANS.*/
INSERT INTO departments(dept_name)
VALUES 
('Management'),
('Sales'),
('Warehouse'),
('Human Resources'),
('Quality Control'),
('Office Management'),
('Accounting');

INSERT INTO roles(title, salary, dept_id)
VALUES
('Regional Manager', 100000, 1),
('Sales Rep', 67000, 2),
('HR Rep', 72000, 4),
('Warehouse Worker', 45000, 3),
('Receptionist', 47000, 6),
('Accountant', 89000, 7);

INSERT INTO employees(first_name, last_name, role_id, manager_id) 
VALUES
('Michael', 'Scott', 1, 1),
('Pam', 'Beesly', 5, 1),
('Jim', 'Halpert', 2, 1)

