'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';

const formatDateForInput = (isoDate) => 
  isoDate ? new Date(isoDate).toISOString().slice(0, 10) : '';

export default function EmployeeFormModal({ employee, departments, onClose, onSaved }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    payload.salary = Number(payload.salary);

    try {
      if (employee?._id) {
        await api.put(`/employees/${employee._id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={employee ? 'Edit Employee' : 'Add Employee'} onClose={onClose}>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
          <input
            name="fullName"
            defaultValue={employee?.fullName || ''}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={employee?.email || ''}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              defaultValue={employee?.phone || ''}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
            <input
              name="department"
              list="department-options"
              defaultValue={employee?.department || ''}
              className="input-field"
              required
            />
            <datalist id="department-options">
              {departments.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Designation</label>
            <input
              name="designation"
              defaultValue={employee?.designation || ''}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              min="0"
              defaultValue={employee?.salary ?? ''}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date of joining</label>
            <input
              type="date"
              name="dateOfJoining"
              defaultValue={formatDateForInput(employee?.dateOfJoining)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            defaultValue={employee?.status || 'ACTIVE'}
            className="input-field"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : employee ? 'Save changes' : 'Add employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
}