import React, { useState } from 'react';
import IssueList from '../components/IssueList';
import IssueFormModal from '../components/IssueFormModal';
import { Issue } from '../issueTypes';

interface IssuePageProps {
  projectId: string;
}

const IssuePage: React.FC<IssuePageProps> = ({ projectId }) => {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const handleCreateIssue = () => {
    setEditingIssue(null);
    setShowIssueModal(true);
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setShowIssueModal(true);
  };

  const handleCloseModal = () => {
    setShowIssueModal(false);
    setEditingIssue(null);
  };

  return (
    <div className="p-4">
      <IssueList
        projectId={projectId}
        onCreateIssue={handleCreateIssue}
        onEditIssue={handleEditIssue}
        onViewIssue={() => {}}
      />
      <IssueFormModal
        isOpen={showIssueModal}
        onClose={handleCloseModal}
        projectId={projectId}
        issue={editingIssue}
      />
    </div>
  );
};

export default IssuePage;
