const express = require('express');
const {
  createEmployee,
  getEmployees,
  getDepartments,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.route('/').get(getEmployees).post(createEmployee);

router.get('/departments', getDepartments);

router.route('/:id').get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
