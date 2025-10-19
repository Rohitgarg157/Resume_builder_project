import api from './api';

export const resumeService = {
  async getResumes() {
    const response = await api.get('/resume');
    return response.data;
  },

  async getResume(id) {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },

  async createResume(resumeData) {
    const response = await api.post('/resume', resumeData);
    return response.data;
  },

  async updateResume(id, resumeData) {
    const response = await api.put(`/resume/${id}`, resumeData);
    return response.data;
  },

  async deleteResume(id) {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  },

  async savePersonalInfo(resumeId, personalData) {
    const response = await api.post(`/resume/${resumeId}/personal-info`, personalData);
    return response.data;
  },

  async addWorkExperience(resumeId, workData) {
    const response = await api.post(`/resume/${resumeId}/work-experience`, workData);
    return response.data;
  },

  async addEducation(resumeId, educationData) {
    const response = await api.post(`/resume/${resumeId}/education`, educationData);
    return response.data;
  },

  async addSkill(resumeId, skillData) {
    const response = await api.post(`/resume/${resumeId}/skills`, skillData);
    return response.data;
  },

  async addProject(resumeId, projectData) {
    const response = await api.post(`/resume/${resumeId}/projects`, projectData);
    return response.data;
  },

  async addCertification(resumeId, certificationData) {
    const response = await api.post(`/resume/${resumeId}/certifications`, certificationData);
    return response.data;
  },

  async addLanguage(resumeId, languageData) {
    const response = await api.post(`/resume/${resumeId}/languages`, languageData);
    return response.data;
  }
};
