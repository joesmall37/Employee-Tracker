const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const env = require("dotenv").config();

// Initialize Express

const app = express();

// Connection

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    // password: process.env.db_password,
    database: "employee_db",
});

// Parse request as JSON

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connection ID

connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected as ID ${connection.threadId}`);
    startPrompt();
});

// Inquirer prompt to prompt user for information

function startPrompt() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: [
                    "View All Employees?",
                    "View All Employee's By Roles?",
                    "View all Emplyees By Deparments",
                    "Update Employee",
                    "Add Employee?",
                    "Add Role?",
                    "Add Department?"
                ]
            }
        ])
        .then(function (answers) {
            switch (answers.choice) {
                case "View All Employees?":
                    viewAllEmployees();
                    break;

                case "View All Employee's By Roles?":
                    viewAllRoles();
                    break;
                case "View all Emplyees By Departments":
                    viewAllDepartments();
                    break;

                case "Add Employee?":
                    addEmployee();
                    break;

                case "Update Employee":
                    updateEmployee();
                    break;

                case "Add Role?":
                    addRole();
                    break;

                case "Add Department?":
                    addDepartment();
                    break;

            }
        })
}

// View All Employees

function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

// View Roles

function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

// View Departments

function viewAllDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

// Add Role function for titles for Add Employee prompt

let roleArr = [];

function selectRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

// Add Select Manager roles for Add Employee prompt

let managerArr = [];

function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name);
        }

    })
    return managerArr;
}
// Add Employee function

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter their first name "
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
        let roleId = selectRole().indexOf(val.role) + 1
        let managerId = selectManager().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(val)
                startPrompt()
            })

    })
}

// Update Employee

function updateEmployee() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
        // console.log(res)
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "lastName",
                type: "rawlist",
                choices: function () {
                    let lastName = [];
                    for (let i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the Employee's last name? ",
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: selectRole()
            },
        ]).then(function (val) {
            let roleId = selectRole().indexOf(val.role) + 1;

            connection.query("UPDATE employee SET ? WHERE ?",
                [{
                    last_name: val.lastName

                },
                {
                    role_id: roleId

                }],
                function (err) {
                    if (err) throw err
                    console.table(val)
                    startPrompt()
                })

        });
    });

}

// Add Employee Role

function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "Title",
                type: "input",
                message: "What is the roles Title?"
            },
            {
                name: "Salary",
                type: "input",
                message: "What is the Salary?"

            }
        ]).then(function (res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.Title,
                    salary: res.Salary,
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )

        });
    });
}

// Add Department

function addDepartment() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        let query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name

            },
            function (err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })

}
