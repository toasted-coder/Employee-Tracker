//Importing dependencies and the connection object created in connection.js
const mySQL = require("mySQL");
const inquirer = require("inquirer");
const connection = require("./config/connection");

//Inquirer prompt
const init = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View department",
        "View role",
        "View employee",
        "Add department",
        "Add role",
        "Add employee",
        "Update employee",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add department":
          addDepartment();
          break;

        case "Add role":
          addRole();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "View department":
          viewDepartment();
          break;

        case "View role":
          viewRole();
          break;

        case "View employee":
          viewEmployee();
          break;

        case "Update employee":
          updateEmployee();
          break;

        case "Exit":
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// viewAllEmployees function
const viewAllEmployees = () => {
  const query = "SELECT * FROM employees";
  connection.query(query, (err, res) => {
    console.log(`${res.length} employees found!`);
    res.forEach(({ first_name, last_name, role_id, manager_id }, i) => {
      const num = i + 1;
      console.log(
        `${num} || ${first_name} ${last_name} || Role ID: ${role_id} || Manager ID: ${manager_id}`
      );
    });
    start();
  });
};

// viewEmpsByMngr function
const viewEmpsByMngr = () => {
  connection.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees',
    (err, res) => {
      inquirer
        .prompt([
          {
            name: "manager",
            type: "list",
            message: `Whose supervisees would you like to view?`,
            choices: res,
          },
        ])
        .then((answer) => {
          // Manager info
          const mngrIndex = res.filter((mngr) => {
            return mngr.name === answer.manager;
          });

          const mngrChoice = mngrIndex[0].id;

          const query = "SELECT * FROM employees WHERE ?";

          const condit = [{ manager_id: mngrChoice }];

          connection.query(query, condit, (err, res) => {
            if (res.length) {
              console.log(`${res.length} employees found!`);
              res.forEach(({ first_name, last_name, role_id }, i) => {
                const num = i + 1;
                console.log(
                  `${num} || ${first_name} ${last_name} || Role ID: ${role_id}`
                );
              });
              start();
            } else {
              console.log(`This employee has no supervisees.`);
              start();
            }
          });
        });
    }
  );
};

// viewAllDepartments function
const viewAllDepartments = () => {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    console.log(`${res.length} matches found!`);
    res.forEach(({ name }, i) => {
      const num = i + 1;
      console.log(`${num} || ${name}`);
    });
    start();
  });
};

// viewAllRoles function
const viewAllRoles = () => {
  const query = "SELECT * FROM roles";
  connection.query(query, (err, res) => {
    console.log(`${res.length} roles found!`);
    res.forEach(({ title, salary, department_id }, i) => {
      const num = i + 1;
      console.log(
        `${num} || Title: ${title} || Salary: ${salary} || Department ID: ${department_id}`
      );
    });
    start();
  });
};

// addRole function
const addRole = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: `What is the name of the role?`,
        },

        {
          name: "salary",
          type: "input",
          message: `What is the salary for this position?`,
        },

        {
          name: "department",
          type: "list",
          message: "To which department does this role belong?",
          choices: res,
        },
      ])
      .then((answer) => {
        const departIndex = res.filter((dept) => {
          return dept.name === answer.department;
        });

        const departID = departIndex[0].id;

        const query = "INSERT INTO roles SET ?";

        const roleInfo = {
          title: answer.title,
          salary: answer.salary,
          department_id: departID,
        };

        connection.query(query, roleInfo, (err, res) => {
          console.log(`Role: ${answer.title} has been created!`);
          start();
        });
      });
  });
};

// addEmployee function
const addEmployee = () => {
  connection.query(
    "SELECT id, first_name AS name FROM employees",
    (err, mngrs) => {
      connection.query("SELECT id, title AS name FROM roles", (err, roles) => {
        inquirer
          .prompt([
            {
              name: "first_name",
              type: "input",
              message: `What is the employee's first name?`,
            },

            {
              name: "last_name",
              type: "input",
              message: `What is the employee's last name?`,
            },

            {
              name: "role",
              type: "list",
              message: `What is the employee's role?`,
              choices: roles,
            },

            {
              name: "manager",
              type: "list",
              message: `Who is the employee's manager?`,
              choices: mngrs,
            },
          ])
          .then((answer) => {
            const rolesIndex = roles.filter((role) => {
              return role.name === answer.role;
            });

            const roleId = rolesIndex[0].id;

            const mngrIndex = mngrs.filter((mngr) => {
              return mngr.name === answer.manager;
            });

            const mngrID = mngrIndex[0].id;

            const query = "INSERT INTO employees SET ?";

            const empInfo = {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: roleId,
              manager_id: mngrID,
            };

            connection.query(query, empInfo, (err, res) => {
              console.log(
                `${answer.first_name} ${answer.last_name} has been added!`
              );
              start();
            });
          });
      });
    }
  );
};

// addDepartment function
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: `What is the name of the department?`,
      },
    ])
    .then((answer) => {
      const query = "INSERT INTO departments SET ?";

      const departInfo = { name: answer.name };

      connection.query(query, departInfo, (err, res) => {
        console.log(`Department: ${answer.name} has been created!`);
        start();
      });
    });
};

// updateEmployeeRole function
const updateEmployeeRole = () => {
  connection.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees',
    (err, emps) => {
      connection.query("SELECT id, title AS name FROM roles", (err, roles) => {
        inquirer
          .prompt([
            {
              name: "employee",
              type: "list",
              message: `Which employee's role would you like to update?`,
              choices: emps,
            },

            {
              name: "role",
              type: "list",
              message: `What is this employee's new role?`,
              choices: roles,
            },
          ])
          .then((answer) => {
            // Employee info
            const empIndex = emps.filter((emp) => {
              return emp.name === answer.employee;
            });

            const empChoice = empIndex[0].id;

            // Roles info
            const rolesIndex = roles.filter((role) => {
              return role.name === answer.role;
            });

            const roleChoice = rolesIndex[0].id;

            connection.query(
              "UPDATE employees SET ? WHERE ?",
              [
                {
                  role_id: roleChoice,
                },
                {
                  id: empChoice,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log(`${answer.employee}'s role has been updated!`);
                start();
              }
            );
          });
      });
    }
  );
};

// updateEmployeeMgr function
const updateEmployeeMgr = () => {
  connection.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees',
    (err, emps) => {
      connection.query(
        'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees',
        (err, mngrs) => {
          inquirer
            .prompt([
              {
                name: "employee",
                type: "list",
                message: `Which employee's manager would you like to update?`,
                choices: emps,
              },
              {
                name: "manager",
                type: "list",
                message: `To whom does this employee now report?`,
                choices: mngrs,
              },
            ])
            .then((answer) => {
              // Employee info
              const empIndex = emps.filter((emp) => {
                return emp.name === answer.employee;
              });

              const empChoice = empIndex[0].id;

              // Managers info
              const mngrIndex = mngrs.filter((mngr) => {
                return mngr.name === answer.manager;
              });

              const mngrChoice = mngrIndex[0].id;

              connection.query(
                "UPDATE employees SET ? WHERE ?",
                [
                  {
                    manager_id: mngrChoice,
                  },
                  {
                    id: empChoice,
                  },
                ],
                (err, res) => {
                  if (err) throw err;
                  console.log(`${answer.employee}'s manager has been updated!`);
                  start();
                }
              );
            });
        }
      );
    }
  );
};

connection.connect((err) => {
  if (err) throw err;
  start();
});
