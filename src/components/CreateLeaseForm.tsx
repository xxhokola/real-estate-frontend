import React, { useEffect, useState } from 'react';
import axios from '../lib/axiosInstance';
import TemplateEditorModal from './TemplateEditorModal';

interface CreateLeaseFormProps {
  unitId: number;
  propertyId: number;
  onSuccess: () => void;
}

const CreateLeaseForm: React.FC<CreateLeaseFormProps> = ({ unitId, propertyId, onSuccess }) => {
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    rent_amount: '',
    due_day: 1,
    payment_frequency: 'monthly',
    late_fee: 50,
    late_fee_percent: 5,
    grace_period_days: 3,
    security_deposit: 0,
    template_id: '',
  });

  const [templates, setTemplates] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const loadTemplates = async () => {
    try {
      const res = await axios.get(`/lease-templates/${propertyId}?include_base=true`);
      setTemplates(res.data);
    } catch (err: any) {
      console.error('Failed to load templates:', err);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [propertyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'template_id') setPreviewHtml(null);
    setForm(prev => ({
      ...prev,
      [name]: ['due_day', 'late_fee', 'grace_period_days', 'late_fee_percent', 'security_deposit'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handlePreview = async () => {
    if (!form.template_id) return;

    try {
      const res = await axios.get(`/lease-templates/edit/${form.template_id}`);
      const styledHtml = `
        <style>
          body { color: #000; background: #fff; font-family: sans-serif; line-height: 1.5; padding: 1rem; }
          h1, h2, h3, h4, strong { color: #000; }
        </style>
        ${res.data.content}
      `;
      setPreviewHtml(styledHtml);
    } catch (err) {
      console.error('Failed to load template preview:', err);
    }
  };

  const handleOpenEditor = async () => {
    if (!form.template_id) return;
    const tpl = templates.find(t => t.template_id === form.template_id);
    if (tpl) setSelectedTemplate(tpl);
    setShowEditor(true);
  };

  const handleTemplateSaved = () => {
    setShowEditor(false);
    loadTemplates();
    handlePreview();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const landlord_id = payload?.user_id;

      await axios.post('/leases', {
        ...form,
        unit_id: unitId,
        landlord_id,
      });

      setMessage('✅ Lease created!');
      onSuccess();
    } catch (err: any) {
      console.error('Lease error:', err.response?.data || err.message);
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label>Start Date <input type="date" name="start_date" onChange={handleChange} required /></label>
      <label>End Date <input type="date" name="end_date" onChange={handleChange} required /></label>
      <label>Rent Amount <input name="rent_amount" type="number" onChange={handleChange} required /></label>
      <label>Due Day <input name="due_day" type="number" min={1} max={31} onChange={handleChange} value={form.due_day} /></label>
      <label>Frequency
        <select name="payment_frequency" value={form.payment_frequency} onChange={handleChange}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>
      <label>Late Fee <input name="late_fee" type="number" onChange={handleChange} value={form.late_fee} /></label>
      <label>Late Fee % <input name="late_fee_percent" type="number" onChange={handleChange} value={form.late_fee_percent} /></label>
      <label>Grace Period (days) <input name="grace_period_days" type="number" onChange={handleChange} value={form.grace_period_days} /></label>
      <label>Security Deposit <input name="security_deposit" type="number" onChange={handleChange} value={form.security_deposit} /></label>

      {templates.length === 0 ? (
        <p style={{ color: 'orange' }}>
          ⚠️ No lease templates found. <a href="/lease-templates/create" style={{ color: '#007bff', textDecoration: 'underline' }}>Click here to create one.</a>
        </p>
      ) : (
        <>
          <label>
            Lease Template
            <select name="template_id" value={form.template_id} onChange={handleChange} required>
              <option value="">-- Select Template --</option>
              {templates.map((tpl) => (
                <option key={tpl.template_id} value={tpl.template_id}>
                  {tpl.name} {tpl.property_id ? '' : '(Global)'}
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="button" onClick={handlePreview} disabled={!form.template_id}>Preview</button>
            <button type="button" onClick={handleOpenEditor} disabled={!form.template_id}>Edit Template</button>
          </div>
        </>
      )}

      {previewHtml && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem', maxHeight: '500px', overflow: 'auto', backgroundColor: '#fff', color: '#000' }}>
          <h4>📄 Template Preview</h4>
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}

      <button type="submit">Save Lease</button>
      {message && <p>{message}</p>}

      {showEditor && form.template_id && (
        <TemplateEditorModal
          templateId={form.template_id}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleTemplateSaved}
        />
      )}
    </form>
  );
};

export default CreateLeaseForm;