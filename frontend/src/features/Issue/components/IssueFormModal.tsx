import React, { useEffect, useState } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { createIssue, showNotification, updateIssue } from '../issueSlice';
import { CreateIssueData, Issue, UpdateIssueData } from '../issueTypes';
import IssueFormFields from './IssueFormFields';
import TagInput from './TagInput';

interface IssueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  issue?: Issue | null;
}

// Add custom types for priority and status
type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
type Status = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

//Define form data interface using those types
interface IssueFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  assignedToId: string;
  deadline: string;
  tags: string[];
}

const IssueFormModal: React.FC<IssueFormModalProps> = ({
  isOpen,
  onClose,
  projectId,
  issue,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { team } = useSelector((state: RootState) => state.team);

  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
    assignedToId: '',
    deadline: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (issue) {
        setFormData({
          title: issue.title,
          description: issue.description,
          priority: issue.priority as Priority,
          status: issue.status as Status,
          assignedTo: issue.assignedTo || '',
          assignedToId: issue.assignedToId || '',
          deadline: issue.deadline ? issue.deadline.split('T')[0] : '',
          tags: issue.tags || [],
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          status: 'Open',
          assignedTo: '',
          assignedToId: '',
          deadline: '',
          tags: [],
        });
      }
      setTagInput('');
      setErrors({});
    }
  }, [isOpen, issue]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.deadline && new Date(formData.deadline) < new Date())
      newErrors.deadline = 'Deadline cannot be in the past';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (issue) {
        const updateData: UpdateIssueData = { ...formData };
        await dispatch(updateIssue({ issueId: issue._id, projectId, updateData }));
        dispatch(showNotification({ message: 'Issue Updated', description: `"${formData.title}" updated successfully.`, type: 'success' }));
      } else {
        const createData: CreateIssueData = { ...formData, projectId };
        await dispatch(createIssue(createData));
        dispatch(showNotification({ message: 'Issue Created', description: `"${formData.title}" created successfully.`, type: 'success' }));
      }
      onClose();
    } catch (error) {
      dispatch(showNotification({ message: 'Error', description: `Failed to ${issue ? 'update' : 'create'} issue.`, type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">{issue ? 'Edit Issue' : 'Create New Issue'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}><FiX className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <IssueFormFields
            formData={formData}
            setFormData={setFormData}
            team={team}
            isSubmitting={isSubmitting}
            errors={errors}
            setErrors={setErrors}
          />
          <TagInput
            tagInput={tagInput}
            setTagInput={setTagInput}
            tags={formData.tags}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg" disabled={isSubmitting}>
              {isSubmitting && <FiLoader className="w-4 h-4 animate-spin" />}
              {issue ? 'Update Issue' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueFormModal;
