DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
);

CREATE TABLE roles (
    `id` INT NOT NULL,
    `title` VARCHAR(30) NOT NULL,
    `salary` DECIMAL,
    `department_id` INT,
    PRIMARY KEY(id),
    FOREIGN KEY (`department_id`) REFERENCES departments (`id`),
);

CREATE TABLE employees (
    `id` VARCHAR(30) INT NOT NULL,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `role_id` INT,
    `manager_id` INT DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`role_id`) REFERENCES roles (`id`),
    FOREIGN KEY (`manager_id`) REFERENCES employees (`id`),
);

SELECT * FROM employees;
SELECT * FROM departments;
SELECT * FROM roles;