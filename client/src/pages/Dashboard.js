import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResume } from '../contexts/ResumeContext';
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Calendar,
  User,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { resumes, loading, fetchResumes, deleteResume } = useResume();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    resumeCount: 0,
    workExperienceCount: 0,
    educationCount: 0,
    skillsCount: 0
  });

  useEffect(() => {
    fetchResumes();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { authService } = await import('../services/authService');
      const data = await authService.getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDeleteResume = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const result = await deleteResume(id);
      if (result.success) {
        toast.success('Resume deleted successfully');
      } else {
        toast.error(result.message || 'Failed to delete resume');
      }
    }
  };

  const handleCreateResume = () => {
    navigate('/resume-builder');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your resumes and create new ones to land your dream job.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resumeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Work Experience</p>
                <p className="text-2xl font-bold text-gray-900">{stats.workExperienceCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Education</p>
                <p className="text-2xl font-bold text-gray-900">{stats.educationCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-2xl font-bold text-gray-900">{stats.skillsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCreateResume}
              className="btn btn-primary btn-lg group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Create New Resume
            </button>
            <Link
              to="/profile"
              className="btn btn-outline btn-lg"
            >
              <User className="w-5 h-5 mr-2" />
              Update Profile
            </Link>
          </div>
        </div>

        {/* Resumes List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
            <span className="text-sm text-gray-500">
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first resume to get started on your job search journey.
              </p>
              <button
                onClick={handleCreateResume}
                className="btn btn-primary btn-lg group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Create Your First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {resume.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {resume.first_name} {resume.last_name}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        resume.template === 'modern' 
                          ? 'bg-blue-100 text-blue-800'
                          : resume.template === 'classic'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {resume.template}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      Updated {formatDate(resume.updated_at)}
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/resume-builder/${resume.id}`}
                        className="btn btn-outline btn-sm flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <Link
                        to={`/resume-preview/${resume.id}`}
                        className="btn btn-outline btn-sm flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Link>
                      <button
                        onClick={() => handleDeleteResume(resume.id, resume.title)}
                        className="btn btn-outline btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
