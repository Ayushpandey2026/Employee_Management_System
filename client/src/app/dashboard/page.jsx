'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  const value = (key) => (stats ? stats[key] : '-');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">A quick overview of your workforce.</p>
        </div>
        <Link href="/dashboard/employees" className="btn-primary">
          View employees
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Employees" value={value('totalEmployees')} />
        <StatCard title="Active" value={value('activeEmployees')} accent="text-green-600" />
        <StatCard title="Inactive" value={value('inactiveEmployees')} accent="text-red-600" />
        <StatCard title="Departments" value={value('totalDepartments')} accent="text-amber-600" />
      </div>
    </div>
  );
}