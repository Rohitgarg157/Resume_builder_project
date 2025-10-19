import React, { createContext, useContext, useState } from 'react';
import { resumeService } from '../services/resumeService';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getResumes();
      setResumes(data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch resumes' 
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchResume = async (id) => {
    setLoading(true);
    try {
      const data = await resumeService.getResume(id);
      setCurrentResume(data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch resume' 
      };
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (resumeData) => {
    try {
      const data = await resumeService.createResume(resumeData);
      setResumes(prev => [data.resume, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to create resume:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create resume' 
      };
    }
  };

  const updateResume = async (id, resumeData) => {
    try {
      const data = await resumeService.updateResume(id, resumeData);
      setResumes(prev => 
        prev.map(resume => resume.id === id ? { ...resume, ...data } : resume)
      );
      if (currentResume && currentResume.id === id) {
        setCurrentResume(prev => ({ ...prev, ...data }));
      }
      return { success: true, data };
    } catch (error) {
      console.error('Failed to update resume:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update resume' 
      };
    }
  };

  const deleteResume = async (id) => {
    try {
      await resumeService.deleteResume(id);
      setResumes(prev => prev.filter(resume => resume.id !== id));
      if (currentResume && currentResume.id === id) {
        setCurrentResume(null);
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to delete resume:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete resume' 
      };
    }
  };

  const savePersonalInfo = async (resumeId, personalData) => {
    try {
      await resumeService.savePersonalInfo(resumeId, personalData);
      if (currentResume && currentResume.id === resumeId) {
        setCurrentResume(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, ...personalData }
        }));
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to save personal info:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to save personal info' 
      };
    }
  };

  const addWorkExperience = async (resumeId, workData) => {
    try {
      const data = await resumeService.addWorkExperience(resumeId, workData);
      if (currentResume && currentResume.id === resumeId) {
        setCurrentResume(prev => ({
          ...prev,
          workExperience: [...(prev.workExperience || []), data]
        }));
      }
      return { success: true, data };
    } catch (error) {
      console.error('Failed to add work experience:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add work experience' 
      };
    }
  };

  const addEducation = async (resumeId, educationData) => {
    try {
      const data = await resumeService.addEducation(resumeId, educationData);
      if (currentResume && currentResume.id === resumeId) {
        setCurrentResume(prev => ({
          ...prev,
          education: [...(prev.education || []), data]
        }));
      }
      return { success: true, data };
    } catch (error) {
      console.error('Failed to add education:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add education' 
      };
    }
  };

  const addSkill = async (resumeId, skillData) => {
    try {
      const data = await resumeService.addSkill(resumeId, skillData);
      if (currentResume && currentResume.id === resumeId) {
        setCurrentResume(prev => ({
          ...prev,
          skills: [...(prev.skills || []), data]
        }));
      }
      return { success: true, data };
    } catch (error) {
      console.error('Failed to add skill:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add skill' 
      };
    }
  };

  const clearCurrentResume = () => {
    setCurrentResume(null);
  };

  const value = {
    resumes,
    currentResume,
    loading,
    fetchResumes,
    fetchResume,
    createResume,
    updateResume,
    deleteResume,
    savePersonalInfo,
    addWorkExperience,
    addEducation,
    addSkill,
    clearCurrentResume
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
