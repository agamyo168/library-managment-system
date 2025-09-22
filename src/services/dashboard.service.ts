import sequelize from '../configs/db-connection.config';
import Departments from '../models/departments.model';
import Employees from '../models/employees.model';

const countEmployees = async () => {
  console.log((await Employees.count()) + ' employees found.');
  return Employees.findAndCountAll();
};
const findDepartmentDistribution = async () => {
  const result = await sequelize.query(
    `SELECT d."deptName", COUNT(*)
     FROM Employees e LEFT JOIN Departments d ON e."departmentId" = d.id
     GROUP BY d."deptName";`
  );
  return result[0];
};
const findRecentEmployees = async () => {
  //Fetch Last 10 employees hired recently
  const result = await sequelize.query(
    `SELECT *
     FROM Employees
     ORDER BY "hireDate" DESC
     LIMIT 10;`
  );
  console.log(result[0]);
  return result[0];
};

export { countEmployees, findDepartmentDistribution, findRecentEmployees };
