import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamMemberCard from '../TeamMemberCard';

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiMail: () => <div data-testid="mail-icon">Mail</div>,
  FiPhone: () => <div data-testid="phone-icon">Phone</div>,
  FiPlus: () => <div data-testid="plus-icon">Plus</div>,
  FiTrash2: () => <div data-testid="trash-icon">Trash</div>,
  FiX: () => <div data-testid="x-icon">X</div>,
}));

const mockUser = {
  name: 'Vishesh',
  role: 'Frontend Developer',
  avatar: '/test-avatar.jpg',
  projects: ['Project A', 'Project B'],
  rank: 1,
  email: 'john@example.com',
  phone: '+1234567890'
};

const mockProps = {
  user: mockUser,
  availableProjects: ['Project A', 'Project B', 'Project C', 'Project D'],
  onRemoveMember: jest.fn(),
  onAddProject: jest.fn(),
  onRemoveProject: jest.fn()
};

describe('TeamMemberCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Basic Rendering', () => {
    it('renders user name and role correctly', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      expect(screen.getByText('Vishesh')).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // rank
    });

    it('renders avatar with correct src and alt', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const avatar = screen.getByAltText('Vishesh');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', '/test-avatar.jpg');
    });

    it('renders projects correctly', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      expect(screen.getByText('Project A')).toBeInTheDocument();
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });

  // Contact information tests
  describe('Contact Information', () => {
    it('renders email link when email is provided', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const emailLink = screen.getByRole('link', { name: /mail/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
    });

    it('renders phone link when phone is provided', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const phoneLink = screen.getByRole('link', { name: /phone/i });
      expect(phoneLink).toHaveAttribute('href', 'tel:+1234567890');
    });

    it('does not render contact info when not provided', () => {
      const userWithoutContact = { ...mockUser, email: undefined, phone: undefined };
      render(<TeamMemberCard {...mockProps} user={userWithoutContact} />);
      
      expect(screen.queryByTestId('mail-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('phone-icon')).not.toBeInTheDocument();
    });
  });

  // Role color tests
  describe('Role Color Assignment', () => {
    it('assigns blue color for developer role', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const roleSpan = screen.getByText('Frontend Developer');
      expect(roleSpan).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('assigns purple color for manager role', () => {
      const managerUser = { ...mockUser, role: 'Project Manager' };
      render(<TeamMemberCard {...mockProps} user={managerUser} />);
      
      const roleSpan = screen.getByText('Project Manager');
      expect(roleSpan).toHaveClass('bg-purple-100', 'text-purple-700');
    });

    it('assigns pink color for design role', () => {
      const designUser = { ...mockUser, role: 'UI Designer' };
      render(<TeamMemberCard {...mockProps} user={designUser} />);
      
      const roleSpan = screen.getByText('UI Designer');
      expect(roleSpan).toHaveClass('bg-pink-100', 'text-pink-700');
    });
  });

  // Add Project functionality tests
  describe('Add Project Functionality', () => {
    it('shows add project dropdown when Add Project button is clicked', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const addButton = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addButton);
      
      expect(screen.getByText('Select a project...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('filters out already assigned projects from dropdown', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const addButton = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addButton);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      // Should only show Project C and Project D (not A and B which are already assigned)
      expect(screen.getByText('Project C')).toBeInTheDocument();
      expect(screen.getByText('Project D')).toBeInTheDocument();
    });

    it('calls onAddProject when project is selected and Add button clicked', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const addButton = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addButton);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'Project C' } });
      
      const confirmAddButton = screen.getByRole('button', { name: 'Add' });
      fireEvent.click(confirmAddButton);
      
      expect(mockProps.onAddProject).toHaveBeenCalledWith(1, 'Project C');
    });

    it('hides add project dropdown when Cancel button is clicked', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const addButton = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addButton);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Select a project...')).not.toBeInTheDocument();
    });
  });

  // Remove Project functionality tests
  describe('Remove Project Functionality', () => {
    it('shows remove button on project hover', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const projectTag = screen.getByText('Project A');
      fireEvent.mouseEnter(projectTag);
      
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('calls onRemoveProject when remove button is clicked', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const projectTag = screen.getByText('Project A');
      fireEvent.mouseEnter(projectTag);
      
      const removeButton = screen.getByTestId('x-icon').parentElement;
      fireEvent.click(removeButton!);
      
      expect(mockProps.onRemoveProject).toHaveBeenCalledWith(1, 'Project A');
    });

    it('hides remove button on mouse leave', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const projectTag = screen.getByText('Project A');
      fireEvent.mouseEnter(projectTag);
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      
      fireEvent.mouseLeave(projectTag);
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });
  });

  // Delete Member functionality tests
  describe('Delete Member Functionality', () => {
    it('shows confirm delete buttons when delete button is clicked', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const deleteButton = screen.getByTestId('trash-icon').parentElement;
      fireEvent.click(deleteButton!);
      
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('calls onRemoveMember when Confirm button is clicked', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const deleteButton = screen.getByTestId('trash-icon').parentElement;
      fireEvent.click(deleteButton!);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      fireEvent.click(confirmButton);
      
      expect(mockProps.onRemoveMember).toHaveBeenCalledWith(1);
    });

    it('hides confirm delete buttons when Cancel button is clicked', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const deleteButton = screen.getByTestId('trash-icon').parentElement;
      fireEvent.click(deleteButton!);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);
      
      expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument();
      expect(screen.getByTestId('trash-icon')).toBeInTheDocument(); // Back to original state
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('renders "No projects assigned" when user has no projects', () => {
      const userWithoutProjects = { ...mockUser, projects: [] };
      render(<TeamMemberCard {...mockProps} user={userWithoutProjects} />);
      
      expect(screen.getByText('No projects assigned')).toBeInTheDocument();
    });

    it('does not call onAddProject when no project is selected', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const addButton = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addButton);
      
      const confirmAddButton = screen.getByRole('button', { name: 'Add' });
      fireEvent.click(confirmAddButton);
      
      expect(mockProps.onAddProject).not.toHaveBeenCalled();
    });

    it('does not call onAddProject when empty project is selected', () => {
      render(<TeamMemberCard {...mockProps} />);
      
      const addButton = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addButton);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '   ' } }); // whitespace only
      
      const confirmAddButton = screen.getByRole('button', { name: 'Add' });
      fireEvent.click(confirmAddButton);
      
      expect(mockProps.onAddProject).not.toHaveBeenCalled();
    });
  });
});