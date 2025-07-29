// src/pages/CreateLeaseTemplatePage.tsx
import React, { useState } from 'react';
import axios from '../lib/axiosInstance';
import { useNavigate } from 'react-router-dom';
import PropertySelect from '../components/PropertySelect';
import { Editor } from '@tinymce/tinymce-react';

const CreateLeaseTemplatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    content: '',
    type: 'residential',
    property_id: '' as number | '',
  });

  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setForm((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post('/lease-templates', {
        ...form,
        property_id: form.property_id || null, // global if not selected
      });

      setMessage('✅ Template created');
      navigate(-1);
    } catch (err: any) {
      console.error('Template creation failed:', err);
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create Lease Template</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Template name"
          required
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>

        <PropertySelect
          value={form.property_id}
          onChange={(id) =>
            setForm((prev) => ({ ...prev, property_id: id }))
          }
        />

        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          value={form.content}
          onEditorChange={handleEditorChange}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | removeformat | help'
          }}
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Template'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateLeaseTemplatePage;