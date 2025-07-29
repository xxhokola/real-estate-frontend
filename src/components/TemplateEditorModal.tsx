// src/components/TemplateEditorModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from '../lib/axiosInstance';

interface Props {
  templateId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const TemplateEditorModal: React.FC<Props> = ({ templateId, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    type: 'residential',
  });

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && templateId) {
      axios.get(`/lease-templates/edit/${templateId}`)
        .then(res => {
          setForm({
            name: res.data.name,
            type: res.data.type,
          });
        })
        .catch(err => console.error('Failed to load template:', err));
    }
  }, [isOpen, templateId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('type', form.type);
      if (file) data.append('file', file);

      await axios.put(`/lease-templates/${templateId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('✅ Template updated');
      setTimeout(() => {
        onSave?.();
        onClose();
        setMessage('');
      }, 1000);
    } catch (err: any) {
      console.error('Save failed:', err);
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Edit Lease Template" style={{
      content: {
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%', maxWidth: '700px'
      }
    }}>
      <h2>Edit Lease Template</h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Template Name" />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>

      <label>Replace File
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      </label>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Template'}
        </button>
      </div>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </Modal>
  );
};

export default TemplateEditorModal;