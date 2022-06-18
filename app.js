/*Importing packages/connection */


const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const cTable = require('console.table');
const connection = require('./config/connection');

const initOptions = ['View all Employees', 'Add Employee', 'Update Employee Role', 'View all Roles', 'Add Role', 'View all Departments', 'Add Department', 'Exit'];


const viewEmployeesQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name, r.salary, CONCAT(m.first_name," ",m.last_name) AS "manager"
FROM employees AS e
LEFT JOIN roles AS r 
ON r.id = e.role_id 
LEFT JOIN departments AS d 
ON d.id = r.dept_id
LEFT JOIN employees AS m 
ON m.id = e.manager_id
ORDER BY e.id;`;
const addEmployeeQuestions = [
  {
    name: 'fn',
    type: 'input',
    message: 'What is your first name?'
  },
  {
    name: 'ln',
    type: 'input',
    message: 'What is your last name?'
  },
  {
    name: 'empRole',
    type: 'input',
    message: 'What is your role title?'
  },
  {
    name: 'empMgr',
    type: 'input',
    message: 'What is your manager\'s name?'
  }
]
const roleQuery = 'SELECT * from roles;';

const startApp = () => {
  inquirer.prompt({
    name: 'initQuestion',
    type: 'list',
    message: 'Select an option',
    choices: initOptions
  }).then(answer => {
    const initAnswer = answer.initQuestion;
    if (initAnswer === 'View all Employees') {
      viewEmployees();
    } else if (initAnswer === 'Add Employee') {
      addEmployee();
    } else if (initAnswer === 'Update Employee Role') {
      updateRole();
    } else if (initAnswer === 'View all Roles') {
      viewRoles();
    } else if (initAnswer === 'Add Role') {
      addRole();
    } else if (initAnswer === 'View all Departments') {
      viewDept();
    } else if (initAnswer === 'Add Department') {
      addDept();
    } else {
      // end
      connection.end();
    }
  });
}

/*The second form .query(sqlString, values, callback) https://www.npmjs.com/package/mysql */
/*View Employees Function */
const viewEmployees = () => {
  connection.query(viewEmployeesQuery, (err, results) => {
    if (err) throw err;
    console.log(' ');
    console.table(chalk.green('All Employees'), results)
    startApp();
  })
}

/*Add Employees Function */

const addEmployee = () => {
    const query = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
      (SELECT id FROM roles WHERE title = ? ), 
      (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`;
    inquirer.prompt(addEmployeeQuestions).then((answer) => {
      connection.query(query, [answer.fn, answer.ln, answer.empRole, answer.empMgr], (err, results) => {
        if (err) throw err;
        console.log(chalk.green('Employee successfully added'));
        startApp();
      });
    });
}
/*Update Role Function */

const updateRole = () => {
  const query = `SELECT CONCAT (first_name," ",last_name) AS full_name FROM employees; SELECT title FROM roles`;
  connection.query(query, (err, results) => {
    if (err) throw err;

    inquirer.prompt([
      {
        name: 'empl',
        type: 'list',
        choices: function () {
          let choiceArray = results[0].map(choice => choice.full_name);
          return choiceArray;
        },
        message: 'Select an employee to update their role:'
      },
      {
        name: 'newRole',
        type: 'list',
        choices: function () {
          let choiceArray = results[1].map(choice => choice.title);
          return choiceArray;
        }
      }
    ]).then((answer) => {
      connection.query(`UPDATE employees 
            SET role_id = (SELECT id FROM roles WHERE title = ? ) 
            WHERE id = (SELECT id FROM(SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`, [answer.newRole, answer.empl], (err, results) => {
        if (err) throw err;
        startApp();
      })
    })
  })
}
/*View Roles Function */

const viewRoles = () => {
  let query = `SELECT * FROM roles`;
  connection.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(' ');
    console.table(chalk.yellow('All Roles'), results);
    /*startApp() keeps the application looping unless they choose to exit */
    startApp();
  })
}
/*Add Role Function */

const addRole = () => {

  inquirer.prompt([
    {
      name: 'newTitle',
      type: 'input',
      message: 'Enter the role new title:'
    },
    {
      name: 'newSalary',
      type: 'input',
      message: 'Enter the salary for the new Title:'
    },
    {
      name: 'dept',
      type: 'input',
      message: 'What is the Department name for this new role?'
    }
  ]).then((answer) => {
    connection.query(
      `INSERT INTO roles(title, salary, dept_id) 
                VALUES
                (?, ?, 
                (SELECT id FROM departments WHERE dept_name = ?));`,
                [answer.newTitle, answer.newSalary, answer.dept], 
    )
    startApp();

  })
}
/*View Departments Function */

const viewDept = () => {
  query = `SELECT * FROM departments`;
  connection.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    console.log('');
    console.table(chalk.yellow('All Departments'), results)
    startApp();
  });
}
/*Add Department Function */

const addDept = () => {
  inquirer.prompt([
    {
      name: 'newDept',
      type: 'input',
      message: 'Enter the name of the Department to add:'
    }
  ]).then((answer) => {
    connection.query(`INSERT INTO departments(dept_name) VALUES( ? )`, answer.newDept)
    startApp();
  })
}

startApp();