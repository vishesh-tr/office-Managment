import React from 'react';
import { FiFlag, FiUser, FiCalendar } from 'react-icons/fi';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'text-red-600';
    case 'High': return 'text-orange-600';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const IssueFormFields = ({ formData, setFormData, team, isSubmitting, errors, setErrors }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: '' }));
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const member = team.find((m: any) => m.name === e.target.value);
    setFormData((prev: any) => ({
      ...prev,
      assignedTo: e.target.value,
      assignedToId: member ? member.rank.toString() : '',
    }));
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <input name="title" value={formData.title} onChange={handleChange} disabled={isSubmitting} className={`w-full px-4 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} rows={4} className={`w-full px-4 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2"><FiFlag className="inline w-4 h-4 mr-1" /> Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-2 border rounded-lg">
            {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className={`mt-1 text-xs ${getPriorityColor(formData.priority)}`}>{formData.priority} priority</div>
        </div>

        <div>
          <label className="block text-sm mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-2 border rounded-lg">
            {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2"><FiUser className="inline w-4 h-4 mr-1" /> Assignee</label>
          <select value={formData.assignedTo} onChange={handleAssigneeChange} disabled={isSubmitting} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Unassigned</option>
            {team.map((member: any) => (
              <option key={member.rank} value={member.name}>{member.name} - {member.role}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2"><FiCalendar className="inline w-4 h-4 mr-1" /> Deadline</label>
          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} disabled={isSubmitting} className={`w-full px-4 py-2 border rounded-lg ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.deadline && <p className="text-sm text-red-600">{errors.deadline}</p>}
        </div>
      </div>
    </>
  );
};

export default IssueFormFields;
