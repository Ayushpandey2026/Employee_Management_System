'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import useDebounce from '@/hooks/useDebounce';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import EmployeeFormModal from '@/components/EmployeeFormModal';

const PAGE_SIZE = 10;

const formatSalary = (salary) =>
  salary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let ignore = false;

    const fetchEmployees = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ page, limit: PAGE_SIZE });
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (department) params.set('department', department);
        if (status) params.set('status', status);

        const data = await api.get(`/employees?${params.toString()}`);

        if (!ignore) {
          setEmployees(data.employees);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchEmployees();

    return () => {
      ignore = true;
    };
  }, [page, debouncedSearch, department, status, refreshKey]);

  useEffect(() => {
    api
      .get('/employees/departments')
      .then(setDepartments)
      .catch(() => {});
  }, [refreshKey]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const openAddForm = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const openEditForm = (employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setSelectedEmployee(null);
    setRefreshKey((key) => key + 1);
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await api.delete(`/employees/${employeeToDelete._id}`);
      setEmployeeToDelete(null);

      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setRefreshKey((key) => key + 1);
      }
    } catch (err) {
      setError(err.message);
      setEmployeeToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-gray-500">Search, filter and manage your team.</p>
        </div>
        <button className="btn-primary" onClick={openAddForm}>
          + Add employee
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search by name, email or designation..."
          className="input-field"
          value={search}
          onChange={handleSearchChange}
        />
        <select className="input-field" value={department} onChange={handleDepartmentChange}>
          <option value="">All departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select className="input-field" value={status} onChange={handleStatusChange}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{employee.fullName}</div>
                      <div className="text-xs text-gray-500">{employee.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{employee.phone}</td>
                    <td className="px-4 py-3">{employee.department}</td>
                    <td className="px-4 py-3">{employee.designation}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatSalary(employee.salary)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(employee.dateOfJoining)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          employee.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        onClick={() => openEditForm(employee)}
                        className="mr-3 font-medium text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setEmployeeToDelete(employee)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      </div>

      {formOpen && (
        <EmployeeFormModal
          employee={selectedEmployee}
          departments={departments}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {employeeToDelete && (
        <Modal title="Delete employee" onClose={() => setEmployeeToDelete(null)}>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{employeeToDelete.fullName}</span>? This can&apos;t be
            undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setEmployeeToDelete(null)}>
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}