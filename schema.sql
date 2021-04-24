CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department
(
    id INTEGER NOT NULL
    AUTO_INCREMENT,
name VARCHAR
    (100) NOT NULL,
PRIMARY KEY
    (id)
);


    CREATE TABLE role
    (
        id INTEGER NOT NULL
        AUTO_INCREMENT,
    title VARCHAR
        (50) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY
        (id),
    FOREIGN KEY
        (department_id) REFERENCES  department
        (id) ON
        DELETE CASCADE
);

        CREATE TABLE employee
        (
            id INT NOT NULL
            AUTO_INCREMENT,
    first_name VARCHAR
            (30) NOT NULL,
    last_name VARCHAR
            (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY
            (id),
    FOREIGN KEY
            (role_id) REFERENCES role
            (id) ON
            DELETE CASCADE,
    FOREIGN KEY (manager_id)
            REFERENCES employee
            (id) ON
            DELETE CASCADE
);


            -- DEPARTMENT SEEDS -----
            INSERT INTO department
                (name)
            VALUE
            ("Sales");
            INSERT INTO department
                (name)
            VALUE
            ("Engineering");
            INSERT INTO department
                (name)
            VALUE
            ("Finance");
            INSERT INTO department
                (name)
            VALUE
            ("Legal");

            -- EMPLOYEE ROLE SEEDS -------
            INSERT INTO role
                (title, salary, department_id)
            VALUE
            ("Lead Engineer",
            150000,
            2
            );
            INSERT INTO role
                (title, salary, department_id)
            VALUE
            ("Legal Team Lead",
            250000,
            4
            );
            INSERT INTO role
                (title, salary, department_id)
            VALUE
            ("Accountant",
            125000,
            3
            );
            INSERT INTO role
                (title, salary, department_id)
            VALUE
            ("Sales Lead",
            100000,
            1
            );
            INSERT INTO role
                (title, salary, department_id)
            VALUE
            ("Salesperson",
            80000,
            1
            );
            INSERT INTO role
                (title, salary, department_id)
            VALUE
            ("Software Engineer",
            120000,
            2
            );
            INSERT INTO role
                (title, salary, department_id)
            VALUE
            ("Lawyer",
            190000,
            4
            );

            -- EMPLOYEE SEEDS -------
            INSERT INTO employee
                (first_name, last_name, manager_id, role_id)
            VALUE
            ("Son",
            "Goku",
            null,
            1
            );
            INSERT INTO employee
                (first_name, last_name, manager_id, role_id)
            VALUE
            ("Naruto",
            "Uzamaki",
            null,
            2
            );
            INSERT INTO employee
                (first_name, last_name, manager_id, role_id)
            VALUE
            ("Itadori","Yuuji",null,3
            );
            INSERT INTO employee
                (first_name, last_name, manager_id, role_id)
            VALUE
            ("Diana",
            "Prince",
            1,
            4
            );
            INSERT INTO employee
                (first_name, last_name, manager_id, role_id)
            VALUE
            ("Selena",
            "Kyle",
            4,
            5
            );
            INSERT INTO employee
                (first_name, last_name, manager_id, role_id)
            VALUE
            ("Barbara",
            "Gordon",
            1,
            6
            );
            INSERT INTO employee
                (first_name, last_name, manager_id, role_id)
            VALUE
            ("Harley",
            "Quinn",
            2,
            7
            );


            -- SELECTING FOR CREATING
            --TABLES IN OUR SQL WORKBENCH
            SELECT *
            FROM department;
            SELECT *
            FROM role;
            SELECT *
            FROM employee;
