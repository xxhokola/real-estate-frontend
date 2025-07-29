// src/components/leases/AssignLeaseTemplateForm.tsx
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axiosInstance'; // ✅ Use '@/lib/axiosInstance' if you’re using Vite path alias

interface Template {
  template_id: number;
  name: string;
  type: string;
}

interface Props {
  leaseId: number;
  propertyId: number;
  onAssigned?: () => void;
}

export default function AssignLeaseTemplateForm({ leaseId, propertyId, onAssigned }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`/lease-templates/${propertyId}?include_base=true`);
        setTemplates(res.data);
      } catch (err: any) {
        console.error('Failed to fetch templates:', err.response?.data || err.message);
      }
    };

    fetchTemplates();
  }, [propertyId]);

  const handleAssign = async () => {
    if (!selectedId) return;

    try {
      await axios.put(`/leases/${leaseId}/template`, {
        template_id: selectedId,
      });

      setMessage('✅ Template assigned!');
      if (onAssigned) onAssigned();
    } catch (err: any) {
      console.error('Failed to assign template:', err.response?.data || err.message);
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4 className="font-semibold mb-1">Assign a Lease Template</h4>

      <select
        value={selectedId || ''}
        onChange={(e) => setSelectedId(Number(e.target.value))}
        className="border rounded px-2 py-1 mb-2"
      >
        <option value="" disabled>
          -- Select a template --
        </option>
        {templates.map((tpl) => (
          <option key={tpl.template_id} value={tpl.template_id}>
            {tpl.name} ({tpl.type})
          </option>
        ))}
      </select>

      <div>
        <button
          onClick={handleAssign}
          disabled={!selectedId}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Assign Template
        </button>
      </div>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}