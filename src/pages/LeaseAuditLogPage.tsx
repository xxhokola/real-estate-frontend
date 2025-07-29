import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@/lib/axiosInstance';

interface LogEntry {
  action: string;
  email: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export default function LeaseAuditLogPage() {
  const { leaseId } = useParams();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`/leases/${leaseId}/audit-log`);
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching audit log:', err);
        setError('Could not load audit log.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [leaseId]);

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'IP', 'User Agent'];
    const rows = logs.map(log => [
      new Date(log.created_at).toISOString(),
      log.email,
      log.action,
      log.ip_address,
      log.user_agent.replaceAll(',', '')
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease_${leaseId}_audit_log.csv`;
    a.click();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📜 Lease Audit Log</h2>
        <button
          onClick={handleExportCSV}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ⬇️ Export CSV
        </button>
      </div>

      {loading && <p>Loading log...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 border">Timestamp</th>
              <th className="px-2 py-1 border">User</th>
              <th className="px-2 py-1 border">Action</th>
              <th className="px-2 py-1 border">IP</th>
              <th className="px-2 py-1 border">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((entry, i) => (
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{new Date(entry.created_at).toLocaleString()}</td>
                <td className="px-2 py-1">{entry.email}</td>
                <td className="px-2 py-1">{entry.action}</td>
                <td className="px-2 py-1">{entry.ip_address}</td>
                <td className="px-2 py-1">{entry.user_agent.slice(0, 40)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
