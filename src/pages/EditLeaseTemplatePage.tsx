// src/pages/EditLeaseTemplatePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../lib/axiosInstance';
import PropertySelect from '../components/PropertySelect';

const EditLeaseTemplatePage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    type: 'residential',
    property_id: '' as number | '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const res = await axios.get(`/lease-templates/edit/${templateId}`);
        setForm({
          name: res.data.name,
          type: res.data.type,
          property_id: res.data.property_id ?? '',
        });
      } catch (err) {
        console.error('Failed to load template:', err);
        setMessage('❌ Failed to load template');
      }
    };
    loadTemplate();
  }, [templateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0] || null;
    setFile(uploaded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('type', form.type);
      data.append('property_id', form.property_id ? form.property_id.toString() : '');
      if (file) data.append('file', file);

      await axios.put(`/lease-templates/${templateId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('✅ Template updated');
      navigate(-1);
    } catch (err: any) {
      console.error('Update failed:', err.response?.data || err.message);
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edit Lease Template</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Template Name" />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>

        <PropertySelect
          value={form.property_id}
          onChange={(id) => setForm(prev => ({ ...prev, property_id: id }))}
        />

        <label>
          Upload File (.docx or .pdf)
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </label>

        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Template'}</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default EditLeaseTemplatePage;