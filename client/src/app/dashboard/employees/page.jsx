'use client';

import { useEffect, useState, useCallback } from 'react';
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
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });

  const [filters, setFilters] = useState({ search: '', department: '', status: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalState, setModalState] = useState({ open: false, employee: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 400);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({ page: filters.page, limit: PAGE_SIZE });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filters.department) params.set('department', filters.department);
      if (filters.status) params.set('status', filters.status);

      const res = await api.get(`/employees?${params}`);
      setEmployees(res.employees);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.department, filters.status, debouncedSearch]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    api.get('/employees/departments').then(setDepartments).catch(() => {});
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`/employees/${deleteTarget._id}`);
      setDeleteTarget(null);

      if (employees.length === 1 && filters.page > 1) {
        setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        loadEmployees();
      }
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
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
        <button
          className="btn-primary"
          onClick={() => setModalState({ open: true, employee: null })}
        >
          + Add employee
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search by name, email or designation..."
          className="input-field"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        <select
          className="input-field"
          value={filters.department}
          onChange={(e) => updateFilter('department', e.target.value)}
        >
          <option value="">All departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          className="input-field"
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
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
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{emp.fullName}</div>
                      <div className="text-xs text-gray-500">{emp.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{emp.phone}</td>
                    <td className="px-4 py-3">{emp.department}</td>
                    <td className="px-4 py-3">{emp.designation}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatSalary(emp.salary)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(emp.dateOfJoining)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          emp.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        onClick={() => setModalState({ open: true, employee: emp })}
                        className="mr-3 font-medium text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(emp)}
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
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        />
      </div>

      {modalState.open && (
        <EmployeeFormModal
          employee={modalState.employee}
          departments={departments}
          onClose={() => setModalState({ open: false, employee: null })}
          onSaved={() => {
            setModalState({ open: false, employee: null });
            loadEmployees();
          }}
        />
      )}

      {deleteTarget && (
        <Modal title="Delete employee" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{deleteTarget.fullName}</span>? This can&apos;t be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
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