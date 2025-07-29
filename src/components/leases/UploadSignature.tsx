import React, { useEffect, useState, useRef } from 'react';
import axios from '@/lib/axiosInstance';

interface Props {
  leaseId: string;
  templateHtml: string;
  onSigned?: () => void;
}

export default function UploadSignature({ leaseId, templateHtml, onSigned }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 100, y: 500 });
  const [canSign, setCanSign] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const me = await axios.get('/auth/me');
        const { id, role } = me.data;

        const res = await axios.get(`/leases/${leaseId}/signatures`);
        const signers = res.data;

        const current = signers.find((s: any) => s.user_id === id);
        if (current?.signed) {
          setHasSigned(true);
          return;
        }

        const allTenantsSigned = signers
          .filter((s: any) => s.role === 'tenant')
          .every((t: any) => t.signed);

        if (role === 'tenant') {
          setCanSign(true);
        } else if (role === 'landlord' && allTenantsSigned) {
          setCanSign(true);
        } else {
          setError('Landlord can only sign after all tenants have signed.');
        }
      } catch (err) {
        console.error('Failed to determine eligibility:', err);
        setError('Unable to determine signing permissions.');
      }
    };

    checkEligibility();
  }, [leaseId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data } = await axios.post(`/leases/${leaseId}/signature-upload-url`);
    const { uploadUrl, fileUrl } = data;

    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
    });

    setImageUrl(fileUrl);
  };

  const handlePlacement = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  const handleSubmit = async () => {
    if (!imageUrl) return;
    await axios.post(`/leases/${leaseId}/signatures`, {
      signature_image_url: imageUrl,
      signature_position: position,
    });
    alert('✅ Signature submitted!');
    onSigned?.();
  };

  if (hasSigned) {
    return <p className="text-green-600">✅ You’ve already signed this lease.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Upload and Place Your Signature</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {canSign ? (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

          <div
            ref={containerRef}
            className="relative border border-gray-300 p-4 bg-white"
            style={{ height: 800, overflow: 'auto' }}
            onClick={handlePlacement}
          >
            <div dangerouslySetInnerHTML={{ __html: templateHtml }} />

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Signature"
                style={{
                  position: 'absolute',
                  left: position.x,
                  top: position.y,
                  maxWidth: '200px',
                }}
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit Signature
          </button>
        </>
      ) : (
        <p className="text-gray-500">⏳ Waiting for eligibility to sign...</p>
      )}
    </div>
  );
}