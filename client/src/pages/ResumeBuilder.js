import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  User, 
  Briefcase, 
  GraduationCap, 
  Star,
  Plus,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Form Components
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import WorkExperienceForm from '../components/forms/WorkExperienceForm';
import EducationForm from '../components/forms/EducationForm';
import SkillsForm from '../components/forms/SkillsForm';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentResume, 
    loading, 
    fetchResume, 
    createResume, 
    updateResume,
    savePersonalInfo,
    addWorkExperience,
    addEducation,
    addSkill
  } = useResume();

  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    template: 'modern'
  });

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'experience', name: 'Work Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Star }
  ];

  useEffect(() => {
    if (id) {
      fetchResume(id);
    }
  }, [id, fetchResume]);

  useEffect(() => {
    if (currentResume) {
      setFormData({
        title: currentResume.title || '',
        template: currentResume.template || 'modern'
      });
    }
  }, [currentResume]);

  const handleSaveResume = async () => {
    try {
      if (id) {
        await updateResume(id, formData);
        toast.success('Resume updated successfully');
      } else {
        const result = await createResume(formData);
        if (result.success) {
          toast.success('Resume created successfully');
          navigate(`/resume-builder/${result.data.resumeId}`);
        }
      }
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  const handlePreview = () => {
    if (currentResume) {
      navigate(`/resume-preview/${currentResume.id}`);
    }
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setIsEditing(false);
  };

  const handleAddItem = (section) => {
    setIsEditing(true);
    setActiveSection(section);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <PersonalInfoForm
            data={currentResume?.personalInfo || {}}
            onSave={async (data) => {
              if (currentResume) {
                const result = await savePersonalInfo(currentResume.id, data);
                if (result.success) {
                  toast.success('Personal information saved');
                  setIsEditing(false);
                } else {
                  toast.error(result.message);
                }
              }
            }}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
          />
        );
      
      case 'experience':
        return (
          <WorkExperienceForm
            data={currentResume?.workExperience || []}
            onAdd={async (data) => {
              if (currentResume) {
                const result = await addWorkExperience(currentResume.id, data);
                if (result.success) {
                  toast.success('Work experience added');
                  setIsEditing(false);
                } else {
                  toast.error(result.message);
                }
              }
            }}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
          />
        );
      
      case 'education':
        return (
          <EducationForm
            data={currentResume?.education || []}
            onAdd={async (data) => {
              if (currentResume) {
                const result = await addEducation(currentResume.id, data);
                if (result.success) {
                  toast.success('Education added');
                  setIsEditing(false);
                } else {
                  toast.error(result.message);
                }
              }
            }}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
          />
        );
      
      case 'skills':
        return (
          <SkillsForm
            data={currentResume?.skills || []}
            onAdd={async (data) => {
              if (currentResume) {
                const result = await addSkill(currentResume.id, data);
                if (result.success) {
                  toast.success('Skill added');
                  setIsEditing(false);
                } else {
                  toast.error(result.message);
                }
              }
            }}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
          />
        );
      
      default:
        return null;
    }
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline btn-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? 'Edit Resume' : 'Create Resume'}
              </h1>
              <p className="text-gray-600">
                {id ? 'Update your resume information' : 'Build your professional resume'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSaveResume}
              className="btn btn-primary btn-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Resume
            </button>
            {currentResume && (
              <button
                onClick={handlePreview}
                className="btn btn-outline btn-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resume Sections
              </h3>
              
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const hasData = currentResume && (
                    (section.id === 'personal' && currentResume.personalInfo) ||
                    (section.id === 'experience' && currentResume.workExperience?.length > 0) ||
                    (section.id === 'education' && currentResume.education?.length > 0) ||
                    (section.id === 'skills' && currentResume.skills?.length > 0)
                  );

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1">{section.name}</span>
                      {hasData && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Add Buttons */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Quick Add
                </h4>
                <div className="space-y-2">
                  {sections.slice(1).map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleAddItem(section.id)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <Icon className="w-4 h-4" />
                        <span>Add {section.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
