import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const WorkExperienceForm = ({ data, onAdd, isEditing, onEdit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [editingIndex, setEditingIndex] = useState(null);

  const onSubmit = (formData) => {
    onAdd(formData);
    reset();
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    onEdit();
  };

  const handleCancel = () => {
    setEditingIndex(null);
    onCancel();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM yyyy');
  };

  const formatDateRange = (startDate, endDate, isCurrent) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  if (!isEditing && data && data.length > 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
          <button
            onClick={() => onEdit()}
            className="btn btn-outline btn-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </button>
        </div>

        <div className="space-y-6">
          {data.map((experience, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {experience.position}
                  </h3>
                  <p className="text-primary-600 font-medium">
                    {experience.company_name}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateRange(experience.start_date, experience.end_date, experience.is_current)}
                    </div>
                    {experience.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {experience.location}
                      </div>
                    )}
                  </div>

                  {experience.description && (
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                      {experience.description}
                    </p>
                  )}

                  {experience.achievements && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Key Achievements:</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {experience.achievements}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(index)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {/* Handle delete */}}
                    className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary btn-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Experience
            </button>
            <button
              onClick={handleCancel}
              className="btn btn-outline btn-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Job Title *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('position', { required: 'Job title is required' })}
                className={`input pl-10 ${errors.position ? 'border-red-500' : ''}`}
                placeholder="e.g., Software Engineer"
              />
            </div>
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
            )}
          </div>

          <div>
            <label className="label">Company Name *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('companyName', { required: 'Company name is required' })}
                className={`input pl-10 ${errors.companyName ? 'border-red-500' : ''}`}
                placeholder="e.g., Google Inc."
              />
            </div>
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">Location</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('location')}
              className="input pl-10"
              placeholder="e.g., San Francisco, CA"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Start Date *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('startDate', { required: 'Start date is required' })}
                type="date"
                className={`input pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="label">End Date</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('endDate')}
                type="date"
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            {...register('isCurrent')}
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            I currently work here
          </label>
        </div>

        <div>
          <label className="label">Job Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="input"
            placeholder="Describe your role, responsibilities, and key accomplishments..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Use bullet points or paragraphs to describe your achievements and responsibilities.
          </p>
        </div>

        <div>
          <label className="label">Key Achievements</label>
          <textarea
            {...register('achievements')}
            rows={3}
            className="input"
            placeholder="List your key achievements, metrics, or notable accomplishments..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Quantify your achievements with numbers, percentages, or specific results when possible.
          </p>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;
