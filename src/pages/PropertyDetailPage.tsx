import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../lib/axiosInstance';
import ScopedUnitForm from '../components/ScopedUnitForm';
import CreateLeaseForm from '../components/CreateLeaseForm';
import AssignTenantForm from '../components/AssignTenantForm';

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  const loadData = () => {
    axios
      .get(`/properties/${propertyId}`)
      .then((res) => {
        setProperty(res.data.property);
        setUnits(res.data.units);
        setLoading(false);
      })
      .catch((err) => {
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
      <p>
        {property.city}, {property.state} {property.zip_code}
      </p>
      <p>
        Type: {property.property_type} | Total Units: {property.num_units}
      </p>

      <hr />
      <h3>Units</h3>
      {units.length === 0 ? (
        <p>No units yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {units.map((unit) => (
            <li
              key={unit.unit_id}
              style={{
                marginBottom: '2rem',
                border: '1px solid #444',
                padding: '1rem',
                borderRadius: '6px',
                backgroundColor: '#1a1a1a',
                color: '#f0f0f0',
              }}
            >
              <strong>Unit {unit.unit_number}</strong>
              <br />
              {unit.bedrooms} {unit.bedrooms === 1 ? 'bedroom' : 'bedrooms'} ·{' '}
              {unit.bathrooms} {unit.bathrooms === 1 ? 'bathroom' : 'bathrooms'} ·{' '}
              {unit.sqft} sqft
              <br />
              Rent: ${unit.rent_amount} / month
              <br />
              Status: {unit.is_occupied ? 'Occupied' : 'Vacant'}
              <br />
              <button
                style={{ marginTop: '0.5rem' }}
                onClick={() =>
                  setSelectedUnit(
                    selectedUnit === unit.unit_id ? null : unit.unit_id
                  )
                }
              >
                {selectedUnit === unit.unit_id ? 'Cancel' : 'Create Lease'}
              </button>

              {selectedUnit === unit.unit_id && (
                <CreateLeaseForm
                  unitId={unit.unit_id}
                  propertyId={property.property_id}
                  onSuccess={() => {
                    setSelectedUnit(null);
                    loadData();
                  }}
                />
              )}

              {unit.leases?.length > 0 ? (
                unit.leases.map((lease: any) => (
                  <div
                    key={lease.lease_id}
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#1e1e1e',
                      color: '#f0f0f0',
                      border: '1px solid #444',
                      borderRadius: '6px',
                    }}
                  >
                    <strong>Lease #{lease.lease_id}</strong>
                    <br />
                    Start: {lease.start_date} → End: {lease.end_date}
                    <br />
                    Rent: ${lease.rent_amount} due on day {lease.due_day} of each{' '}
                    {lease.payment_frequency}
                    <br />
                    Deposit: ${lease.security_deposit}
                    <br />
                    Late fee: ${lease.late_fee} + {lease.late_fee_percent}%
                    <br />
                    <button
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => downloadSignedLease(lease.lease_id)}
                    >
                      📄 Download Signed Lease
                    </button>
                    <br />
                    <strong>Tenants:</strong>
                    <br />
                    {lease.tenants?.length > 0 ? (
                      lease.tenants.map((t: any) => (
                        <div key={t.user_id} style={{ color: '#ccc' }}>
                          {t.name} ({t.email}){' '}
                          {t.is_primary ? '[Primary]' : ''}
                        </div>
                      ))
                    ) : (
                      <em style={{ color: '#999' }}>No tenants assigned.</em>
                    )}

                    <AssignTenantForm
                      leaseId={lease.lease_id}
                      onAssigned={loadData}
                    />
                  </div>
                ))
              ) : (
                <p style={{ marginTop: '1rem' }}>No leases for this unit.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <hr />
      <ScopedUnitForm propertyId={propertyId!} onSuccess={loadData} />
    </div>
  );
};

const downloadSignedLease = async (leaseId: number) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `http://localhost:3000/leases/${leaseId}/signed-pdf`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error('Download failed');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease_${leaseId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('❌ Could not download signed lease.');
    console.error(err);
  }
};

export default PropertyDetailPage;