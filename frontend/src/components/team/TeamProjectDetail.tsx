import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, getProjectSteps } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Project {
  id: number;
  product_description: string;
  status: string;
  created_at: string;
  user_id: number;
}

interface ProjectStep {
  id: number;
  project_id: number;
  step_number: number;
  step_name: string;
  completed: boolean;
  completed_at: string | null;
}

const TeamProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ProjectStep | null>(null);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const { isAuthenticated, isTeamMember, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isTeamMember) {
      navigate('/team/login');
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
  }, [isAuthenticated, isTeamMember, navigate, projectId]);

  const handleStepComplete = async (stepId: number, stepNumber: number, completed: boolean) => {
    if (completed) return; // Step is already completed
    
    setUpdating(true);
    try {
      // Call the API to mark the step as completed
      const response = await axios.post(
        `http://localhost:8000/api/team/projects/${projectId}/steps/${stepNumber}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the local state
      setSteps(steps.map(step => 
        step.id === stepId 
          ? { ...step, completed: true, completed_at: new Date().toISOString() } 
          : step
      ));
      
      // Update the project status
      const completedStep = steps.find(step => step.id === stepId);
      if (completedStep) {
        setProject(project => project ? { ...project, status: completedStep.step_name } : null);
      }
    } catch (err) {
      console.error('Failed to update step status:', err);
      setError('Failed to update step status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleStepClick = (step: ProjectStep) => {
    setSelectedStep(step);
    setShowStepDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
          onClick={() => navigate('/team/dashboard')}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
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
          onClick={() => navigate('/team/dashboard')}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
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
          onClick={() => navigate('/team/dashboard')}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
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
            <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
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
          <h2 className="text-xl font-semibold mb-6">Order Steps</h2>
          
          <div className="space-y-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleStepClick(step)}
              >
                <div className="mr-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => handleStepComplete(step.id, step.step_number, step.completed)}
                    disabled={updating || step.completed}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-700'}`}>
                    {step.step_name}
                  </h3>
                  {step.completed && step.completed_at && (
                    <p className="text-sm text-gray-500 mt-1">
                      Completed on {new Date(step.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  {step.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
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
                  <p>Team Member</p>
                </div>
              </>
            )}
            
            {!selectedStep.completed && (
              <div className="mb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleStepComplete(selectedStep.id, selectedStep.step_number, selectedStep.completed);
                    setShowStepDetails(false);
                  }}
                  disabled={updating}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Mark as Completed"}
                </button>
              </div>
            )}
            
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
            <div className="mb-4">
              <h3 className="font-semibold">Attachments</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="block p-2 border border-gray-200 rounded text-gray-600 italic">
                  No attachments available
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowStepDetails(false)}
              className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamProjectDetail;
