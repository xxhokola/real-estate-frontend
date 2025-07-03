import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../lib/axiosInstance';
import ScopedUnitForm from '../components/ScopedUnitForm';

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    axios.get(`/properties/${propertyId}`)
      .then(res => {
        setProperty(res.data.property);
        setUnits(res.data.units);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load property:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [propertyId]);

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏢 {property.address}</h2>
      <p>{property.city}, {property.state} {property.zip_code}</p>
      <p>Type: {property.property_type} | Units: {property.num_units}</p>

      <hr />
      <h3>Units</h3>
      {units.length === 0 ? (
        <p>No units yet.</p>
      ) : (
        <ul>
          {units.map((unit) => (
            <li key={unit.unit_id}>
              Unit {unit.unit_number} — {unit.bedrooms} beds, {unit.bathrooms} baths, {unit.sqft} sqft — ${unit.rent_amount}
              <br />
              Status: {unit.is_occupied ? 'Occupied' : 'Vacant'}
              {/* Optional: Display future leases here */}
            </li>
          ))}
        </ul>
      )}

      <ScopedUnitForm propertyId={propertyId!} onSuccess={loadData} />
    </div>
  );
};

export default PropertyDetailPage;