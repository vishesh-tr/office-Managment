import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import SEO from '../../../components/SEO';

interface Project {
  _id: string;
  title: string;
  short: string;
  color?: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:4008/project/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading project...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <SEO title="Project Detail Page" description="This is my Project Detail page" />
      <h2>{project.title}</h2>
      <p><strong>Short Code:</strong> {project.short}</p>
      {project.color && <p><strong>Color:</strong> {project.color}</p>}
    </div>
  );
};

export default ProjectDetails;
