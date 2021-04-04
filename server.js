//Importing dependencies and the connection object created in connection.js
const mySQL = require("mySQL");
const inquirer = require("inquirer");
const connection = require("./config/connection");
const consoleTable = require("console-table");

//Inquirer prompt
const run = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View departments",
        "View roles",
        "View employees",
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

        case "View departments":
          viewAllDepartments();
          break;

        case "View roles":
          viewAllRoles();
          break;

        case "View employees":
          viewAllEmployees();
          break;

        case "Update employee role":
          updateEmployeeRole();
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
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    console.log(`${res.length} employees found!`);
    res.forEach(({ first_name, last_name, role_id, manager_id }, i) => {
      const num = i + 1;
      console.log(
        `${num} || ${first_name} ${last_name} || Role ID: ${role_id} || Manager ID: ${manager_id}`
      );
    });
    run();
  });
};

// viewEmpsByMngr function
const viewEmpsByMngr = () => {
  connection.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
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

          const query = "SELECT * FROM employee WHERE ?";

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
              run();
            } else {
              console.log(`This employee has no supervisees.`);
              run();
            }
          });
        });
    }
  );
};

// viewAllDepartments function
const viewAllDepartments = () => {
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    console.log(`${res.length} matches found!`);
    res.forEach(({ name }, i) => {
      const num = i + 1;
      console.log(`${num} || ${name}`);
    });
    run();
  });
};

// viewAllRoles function
const viewAllRoles = () => {
  const query = "SELECT * FROM role";
  connection.query(query, (err, res) => {
    console.log(`${res.length} role found!`);
    res.forEach(({ title, salary, department_id }, i) => {
      const num = i + 1;
      console.log(
        `${num} || Title: ${title} || Salary: ${salary} || Department ID: ${department_id}`
      );
    });
    run();
  });
};

// addRole function
const addRole = () => {
  connection.query("SELECT * FROM department", (err, res) => {
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

        const query = "INSERT INTO role SET ?";

        const roleInfo = {
          title: answer.title,
          salary: answer.salary,
          department_id: departID,
        };

        connection.query(query, roleInfo, (err, res) => {
          console.log(`Role: ${answer.title} has been created!`);
          run();
        });
      });
  });
};

// addEmployee function
const addEmployee = () => {
  connection.query(
    "SELECT id, first_name AS name FROM employee",
    (err, mngrs) => {
      connection.query("SELECT id, title AS name FROM role", (err, role) => {
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
              choices: role,
            },

            {
              name: "manager",
              type: "list",
              message: `Who is the employee's manager?`,
              choices: mngrs,
            },
          ])
          .then((answer) => {
            const rolesIndex = role.filter((role) => {
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
              run();
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
      const query = "INSERT INTO department SET ?";

      const departInfo = { name: answer.name };

      connection.query(query, departInfo, (err, res) => {
        console.log(`Department: ${answer.name} has been created!`);
        run();
      });
    });
};

// updateEmployeeRole function
const updateEmployeeRole = () => {
  connection.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees',
    (err, emps) => {
      connection.query("SELECT id, title AS name FROM role", (err, role) => {
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
              choices: role,
            },
          ])
          .then((answer) => {
            // Employee info
            const empIndex = emps.filter((emp) => {
              return emp.name === answer.employee;
            });

            const empChoice = empIndex[0].id;

            // Roles info
            const rolesIndex = role.filter((role) => {
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
                run();
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
                  run();
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
  run();
});
