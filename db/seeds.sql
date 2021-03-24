INSERT INTO departments (name)
    VALUES ("Management"),("Sales");

INSERT INTO roles (title, salary, department_id)
    VALUES ("Manager", 60000, 1), ("Salesperson", 65000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ("Henry", "Jones", 1, NULL), ("Ralph", "Robertson", 2, 1), ("Jeremiah", "Johnson", 2, 1);