import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Award,
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const EducationForm = ({ data, onAdd, isEditing, onEdit, onCancel }) => {
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
          <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          <button
            onClick={() => onEdit()}
            className="btn btn-outline btn-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </button>
        </div>

        <div className="space-y-6">
          {data.map((education, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {education.degree}
                  </h3>
                  <p className="text-primary-600 font-medium">
                    {education.institution}
                  </p>
                  
                  {education.field_of_study && (
                    <p className="text-gray-600 text-sm mt-1">
                      {education.field_of_study}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateRange(education.start_date, education.end_date, education.is_current)}
                    </div>
                    {education.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {education.location}
                      </div>
                    )}
                    {education.gpa && (
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        GPA: {education.gpa}
                      </div>
                    )}
                  </div>

                  {education.description && (
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                      {education.description}
                    </p>
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
        <h2 className="text-xl font-semibold text-gray-900">Education</h2>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary btn-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Education
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
            <label className="label">Institution *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('institution', { required: 'Institution is required' })}
                className={`input pl-10 ${errors.institution ? 'border-red-500' : ''}`}
                placeholder="e.g., Stanford University"
              />
            </div>
            {errors.institution && (
              <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
            )}
          </div>

          <div>
            <label className="label">Degree *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Award className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('degree', { required: 'Degree is required' })}
                className={`input pl-10 ${errors.degree ? 'border-red-500' : ''}`}
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            {errors.degree && (
              <p className="mt-1 text-sm text-red-600">{errors.degree.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">Field of Study</label>
          <input
            {...register('fieldOfStudy')}
            className="input"
            placeholder="e.g., Computer Science"
          />
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
              placeholder="e.g., Stanford, CA"
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
            I am currently studying here
          </label>
        </div>

        <div>
          <label className="label">GPA</label>
          <input
            {...register('gpa')}
            type="number"
            step="0.01"
            min="0"
            max="4"
            className="input"
            placeholder="e.g., 3.8"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter your GPA on a 4.0 scale (optional)
          </p>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="input"
            placeholder="Describe your academic achievements, relevant coursework, projects, or honors..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Include any relevant academic projects, honors, or achievements.
          </p>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
