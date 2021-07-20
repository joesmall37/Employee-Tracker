DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department
(
    id INT NOT NULL,
    department_id VARCHAR (30) NOT NULL,
    PRIMARY KEY (id),
);
CREATE TABLE role (
    id INT NOT NULL,
    title VARCHAR (30) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL,
    INDEX role_id (department_id),
    FOREIGN KEY (department_id)
    REFERENCES (department_id) ON DELETE CASCADE,
    PRIMARY KEY (id),
);
CREATE TABLE employee (
    id INT NOT NULL,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL,
    INDEX role_ind (role_id),
    FOREIGN KEY (role_id),
    REFERENCES role (id),
    ONDELETE CASCADE,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

            INSERT INTO department
                (department_name)
            VALUES
                ("Operations"),
                ("Investment Banking"),
                ("Technology");

            INSERT INTO role
                (title, salary, department_id)
            VALUES
                ("Managing Director", 3000000, 2),
                ("Director", 1000000, 2),
                ("Vice President", 190000, 1),
                ("Senior Analyst", 80000, 2),
                ("Senior Engineer", 1100000, 3),
                ("Junior Engineerr", 85000, 3),
                ("Product Manager", 110000, 3),
                ("Junior Analyst", 30000, 3),
                ("Intern", 28000, 1);

            INSERT INTO employee
                (first_name, last_name, role_id, manager_id, department_id)
            VALUES
                ("Sidney", "Silverstien", 2, 1,1),
                ("James", "Decker", 2, 3, 3),
                ("Mason", "Nixon", 1, 2, 2);
