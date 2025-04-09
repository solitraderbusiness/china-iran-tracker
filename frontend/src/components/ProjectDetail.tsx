import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, getProjectSteps } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  product_description: string;
  status: string;
  created_at: string;
}

interface ProjectStep {
  id: number;
  project_id: number;
  step_number: number;
  step_name: string;
  completed: boolean;
  completed_at: string | null;
}

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStep, setSelectedStep] = useState<ProjectStep | null>(null);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjectDetails = async () => {
      try {
        if (!projectId) return;
        
        const projectData = await getProject(parseInt(projectId));
        setProject(projectData);
        
        const stepsData = await getProjectSteps(parseInt(projectId));
        setSteps(stepsData);
      } catch (err) {
        console.error('Failed to fetch project details:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [isAuthenticated, navigate, projectId]);

  const handleStepClick = (step: ProjectStep) => {
    setSelectedStep(step);
    setShowStepDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Project not found
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Order #{project.id}</h1>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {project.status}
            </span>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Product Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{project.product_description}</p>
          </div>
          <div className="text-sm text-gray-500">
            Created on {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Order Progress</h2>
          
          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className="relative flex items-start cursor-pointer"
                  onClick={() => handleStepClick(step)}
                >
                  {/* Step indicator */}
                  <div className={`absolute left-0 w-6 h-6 rounded-full ${
                    step.completed 
                      ? 'bg-green-500' 
                      : step.step_number === steps.find(s => !s.completed)?.step_number
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-300'
                  } flex items-center justify-center z-10`}>
                    {step.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="ml-10">
                    <h3 className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-700'}`}>
                      {step.step_name}
                    </h3>
                    {step.completed && step.completed_at && (
                      <p className="text-sm text-gray-500 mt-1">
                        Completed on {new Date(step.completed_at).toLocaleDateString()}
                      </p>
                    )}
                    {!step.completed && step.step_number === steps.find(s => !s.completed)?.step_number && (
                      <p className="text-sm text-blue-500 mt-1">
                        In progress
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Details Modal */}
      {showStepDetails && selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedStep.step_name}</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold">Status</h3>
              <p className={selectedStep.completed ? "text-green-600" : "text-yellow-600"}>
                {selectedStep.completed ? "Completed" : "Pending"}
              </p>
            </div>
            
            {selectedStep.completed && (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold">Completed On</h3>
                  <p>{selectedStep.completed_at ? new Date(selectedStep.completed_at).toLocaleString() : "N/A"}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold">Completed By</h3>
                  <p>{"Team Member"}</p>
                </div>
                
                {/* Notes section - would be populated from backend if available */}
                <div className="mb-4">
                  <h3 className="font-semibold">Notes</h3>
                  <p className="text-gray-600 italic">
                    {selectedStep.step_number === 1 
                      ? "Order has been received and is being processed." 
                      : "No additional notes available."}
                  </p>
                </div>
                
                {/* Attachments section - would be populated from backend if available */}
                {selectedStep.step_number === 1 && (
                  <div className="mb-4">
                    <h3 className="font-semibold">Attachments</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="block p-2 border border-gray-200 rounded text-gray-600 italic">
                        No attachments available
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <button
              onClick={() => setShowStepDetails(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
