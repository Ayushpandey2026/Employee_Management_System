const Employee = require('../models/Employee');

const getDashboardStats = async (req, res, next) => {
  try {
    const result = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          activeEmployees: {
            $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] },
          },
          inactiveEmployees: {
            $sum: { $cond: [{ $eq: ['$status', 'INACTIVE'] }, 1, 0] },
          },
          departments: { $addToSet: '$department' },
        },
      },
      {
        $project: {
          _id: 0,
          totalEmployees: 1,
          activeEmployees: 1,
          inactiveEmployees: 1,
          totalDepartments: { $size: '$departments' },
        },
      },
    ]);

    const stats = result[0] || {
      totalEmployees: 0,
      activeEmployees: 0,
      inactiveEmployees: 0,
      totalDepartments: 0,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };