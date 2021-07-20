const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'company_db'
});

const start = () => {
    inquirer
        .prompt({
            name: 'wantTo',
            type: 'list',
            message: 'What would you like to do?',
            choices: ["View All Employees", "View All Employees by Department", "Add Employee", "Add Department", "Add Role", "Update Employee Role", "Exit"],
        })
        .then((answer) => {
            switch (answer.wantTo) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Employees by Department":
                    console.log("See all employees by department");
                    employeeByDepartment();
                    break;
                case "Add Employee":
                    console.log("Add Employee selected");
                    createEmployee();
                    break;
                case "Add Department":
                    console.log("Add Department selected");
                    addDepartment();
                    break;
                case "Add Role":
                    console.log("Add Role selected");
                    addRole();
                    break;
                case "Update Employee Role":
                    console.log("Update employee role selected");
                    updateEmployeeRole();
                    break;
                case "Exit":
                    connection.end();
            }
        });
};

const viewAllEmployees = () => {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary FROM role JOIN employee ON employee.role_id = role.id JOIN department ON department.id = role.department_id;"
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

const employeeByDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        inquirer
            .prompt({
                name: 'chosenDepartment',
                type: 'list',
                message: 'Which Department would you like to view?',
                choices() {
                    const departmentArray = [];
                    res.forEach(({ department_name }) => {
                        departmentArray.push(department_name);
                    });
                    return departmentArray;
                },
            })
            .then((answer) => {
                let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name FROM role JOIN employee ON employee.role_id = role.id JOIN department ON department.id = role.department_id WHERE ?"
                connection.query(query, { department_name: answer.chosenDepartment }, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            })
    })
};

const createEmployee = () => {
    inquirer
        .prompt([{
            name: 'employeeFirstName',
            type: 'input',
            message: 'What is the first name of the new employee?',
        },
        {
            name: 'employeeLastName',
            type: 'input',
            message: 'What is the last name of the new employee?',
        },
        {
            name: 'employeeDepartment',
            type: 'input',
            message: 'What is the department of the new employee?',
        },
        {
            name: 'employeeRole',
            type: 'input',
            message: 'What is the role of the new employee?',
        },
        {
            name: 'employeeManager',
            type: 'input',
            message: 'Who is the manager of the new employee?',
        }])
        .then((answer) => {
            let query2 = connection.query("SELECT id FROM role WHERE title = ?", [answer.employeeRole], (err, res) => {
                let query = "INSERT INTO employee SET ?";
                connection.query(query,
                    [
                        {
                            first_name: answer.employeeFirstName,
                            last_name: answer.employeeLastName,
                            role_id: res[0].id
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log("New Employee Added");
                        start();
                    }
                )
            });
        })
};

const addDepartment = () => {
    inquirer
        .prompt({
            name: 'addedDepartment',
            type: 'input',
            message: 'What is the name of the department you would like to add?',
        })
        .then((answer) => {
            let query = "INSERT INTO department SET ?"
            connection.query(query, { department_name: answer.addedDepartment }, (err, res) => {
                if (err) throw err;
                console.log(answer.addedDepartment + " has been added.");
                start();
            })
        })
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'addedDepartment',
                    type: 'list',
                    message: 'What is the name of the department you would like to add the role to?',
                    choices() {
                        const departmentArray = [];
                        res.forEach(({ department_name }) => {
                            departmentArray.push(department_name);
                        });
                        return departmentArray;
                    },
                },
                {
                    name: 'addedRole',
                    type: 'input',
                    message: 'What is the name of the role you would like to add?',
                },
                {
                    name: 'addedSalary',
                    type: 'input',
                    message: 'What is the salary of the new role?',
                },
            ])
            .then((answer) => {
                let query2 = connection.query("SELECT id FROM department WHERE department_name = ?", [answer.addedDepartment], (err, res) => {
                    let query = "INSERT INTO role SET ?";
                    connection.query(query,
                        [
                            {
                                title: answer.addedRole,
                                salary: answer.addedSalary,
                                department_id: res[0].id
                            },
                        ],
                        (err, res) => {
                            if (err) throw err;
                            console.log("New Role Added");
                            start();
                        }
                    )
                });
            })
    })
};

updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'list',
                    message: 'What is the first name of the employee would you like to update?',
                    choices() {
                        const firstNameArray = [];
                        res.forEach(({ first_name }) => {
                            firstNameArray.push(first_name);
                        });
                        return firstNameArray;
                    },
                },
                {
                    name: 'lastName',
                    type: 'list',
                    message: 'What is the last name of the employee would you like to update?',
                    choices() {
                        const lastNameArray = [];
                        res.forEach(({ last_name }) => {
                            lastNameArray.push(last_name);
                        });
                        return lastNameArray;
                    },
                },
                {
                    name: 'updatedRole',
                    type: 'input',
                    message: 'What would you like their new role to be?',
                },
            ])
            .then((answer) => {
                let query1 = "SELECT id FROM employee WHERE first_name = ? AND last_name =?";
                connection.query(query1, [answer.firstName, answer.lastName], (err, res) => {
                    let query = "UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE id = ?";
                    connection.query(query, [answer.updatedRole, res[0].id], (err, res) => {
                        if (err) throw err;
                        console.log("employee updated");
                        start();
                    })
                })

            })
    })

};

connection.connect((err) => {
    if (err) throw err;
    console.log("Successful connection");
    start();
});
