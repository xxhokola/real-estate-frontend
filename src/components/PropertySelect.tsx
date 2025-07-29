// src/components/PropertySelect.tsx
import React, { useEffect, useState } from 'react';
import axios from '../lib/axiosInstance';

interface Property {
  property_id: number;
  address: string;
}

interface Props {
  value: number | '';
  onChange: (id: number | '') => void;
}

const PropertySelect: React.FC<Props> = ({ value, onChange }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/my-properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <label>
      Property
      <select
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        disabled={loading}
        required
      >
        <option value="">-- Select Property --</option>
        {properties.map((p) => (
          <option key={p.property_id} value={p.property_id}>
            {p.address}
          </option>
        ))}
      </select>
    </label>
  );
};

export default PropertySelect;