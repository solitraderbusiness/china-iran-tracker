import React, { useState, useEffect } from 'react';
import { getProjects, createProject } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  product_description: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productCount, setProductCount] = useState(1);
  const [sourceLocation, setSourceLocation] = useState("");
  const [description, setDescription] = useState("");
	
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load your projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, navigate]);



    const handleCreateProject = async (e) => {
      e.preventDefault();
      try {
        await createProject({
          name: productName,
          description: description,
          product_url: productUrl,
          product_image: productImage,
          product_count: productCount,
          source_location: sourceLocation
        });
        // Reset form
        setProductName("");
        setProductUrl("");
        setProductImage("");
        setProductCount(1);
        setSourceLocation("");
        setDescription("");
        // Refresh projects
        fetchProjects();
      } 
      catch (error) {
        console.error("Error creating project:", error);
      }
    };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <button
          onClick={() => setShowNewProjectForm(!showNewProjectForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          {showNewProjectForm ? 'Cancel' : 'New Order'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showNewProjectForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Create New Order</h2>
         <form onSubmit={handleCreateProject}>
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Product Name
    </label>
    <input
      type="text"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={productName}
      onChange={(e) => setProductName(e.target.value)}
      required
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Product URL
    </label>
    <input
      type="url"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={productUrl}
      onChange={(e) => setProductUrl(e.target.value)}
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Product Image URL
    </label>
    <input
      type="url"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={productImage}
      onChange={(e) => setProductImage(e.target.value)}
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Product Count
    </label>
    <input
      type="number"
      min="1"
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={productCount}
      onChange={(e) => setProductCount(parseInt(e.target.value))}
      required
    />
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Source Location
    </label>
    <select
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={sourceLocation}
      onChange={(e) => setSourceLocation(e.target.value)}
      required
    >
      <option value="">Select Location</option>
      <option value="Dubai">Dubai</option>
      <option value="Iran">Iran</option>
    </select>
  </div>
  
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Description
    </label>
    <textarea
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={4}
      required
    ></textarea>
  </div>
  
  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  >
    Create Order
  </button>
</form>
 
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600">You don't have any orders yet.</p>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Create your first order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 truncate">
                  Order #{project.id}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.product_description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
