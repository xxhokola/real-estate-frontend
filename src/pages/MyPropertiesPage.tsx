import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axiosInstance';
import CreatePropertyForm from '../components/CreatePropertyForm';

const MyPropertiesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/my-properties')
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch properties:', err);
        setLoading(false);
      });
  }, []);

  const handleCreateSuccess = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 My Properties</h2>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {properties.map((property) => (
            <li
              key={property.property_id}
              style={{
                marginBottom: '1.5rem',
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '6px',
              }}
            >
              <Link to={`/properties/${property.property_id}`}>
                <strong>{property.address}</strong>
              </Link>
              <br />
              {property.city}, {property.state} {property.zip_code}
              <br />
              Type: {property.property_type} | Units: {property.num_units}
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h3>Create a New Property</h3>
      <CreatePropertyForm onSuccess={handleCreateSuccess} />
    </div>
  );
};

export default MyPropertiesPage;