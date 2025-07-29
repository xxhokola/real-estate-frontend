import React, { useEffect, useState } from 'react';
import axios from '@/lib/axiosInstance';

interface Signer {
  user_id: string;
  full_name: string;
  role: 'tenant' | 'landlord';
  signed: boolean;
  signed_at?: string;
}

interface Props {
  leaseId: number;
}

export default function SignatureStatusPanel({ leaseId }: Props) {
  const [signers, setSigners] = useState<Signer[]>([]);

  const loadSignatures = async () => {
    try {
      const res = await axios.get(`/leases/${leaseId}/signatures`);
      setSigners(res.data);
    } catch (err) {
      console.error('❌ Failed to load signers:', err);
    }
  };

  useEffect(() => {
    loadSignatures();
    const interval = setInterval(loadSignatures, 30000);
    return () => clearInterval(interval);
  }, [leaseId]);

  return (
    <div className="mb-4">
      <h3 className="text-md font-semibold mb-2">Signature Status</h3>
      <ul className="space-y-1 text-sm">
        {signers.map((s) => (
          <li key={s.user_id}>
            {s.signed ? '✅' : '⏳'} <strong>{s.full_name}</strong> ({s.role})
            {s.signed_at && (
              <span className="text-gray-500"> — {new Date(s.signed_at).toLocaleString()}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}