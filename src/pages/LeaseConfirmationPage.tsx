import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@/lib/axiosInstance';

export default function LeaseConfirmationPage() {
  const { leaseId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const res = await axios.get(`/leases/${leaseId}/signed-pdf`, {
          responseType: 'blob'
        });
        const url = URL.createObjectURL(res.data);
        setPdfUrl(url);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch signed PDF:', err);
        setError('Unable to load signed lease PDF.');
        setLoading(false);
      }
    };

    fetchPDF();
  }, [leaseId]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎉 Lease Fully Signed</h2>

      {loading && <p>Loading signed lease PDF...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-4 text-green-700">
            All parties have signed. The lease is now fully executed.
          </p>

          <a
            href={pdfUrl}
            download={`lease-${leaseId}.pdf`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ⬇️ Download Signed Lease
          </a>

          <div className="mt-4">
            <a
              href={`/leases/${leaseId}/audit-log`}
              className="text-blue-500 underline hover:text-blue-700"
            >
              📜 View Lease Audit Log
            </a>
          </div>
        </>
      )}
    </div>
  );
}
