import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe,
  Edit,
  Save,
  X
} from 'lucide-react';

const PersonalInfoForm = ({ data, onSave, isEditing, onEdit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: data
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const onSubmit = (formData) => {
    onSave(formData);
  };

  const hasData = data && Object.keys(data).length > 0;

  if (!isEditing && hasData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <button
            onClick={onEdit}
            className="btn btn-outline btn-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {data.firstName} {data.lastName}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {data.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {data.email}
                </div>
              )}
              {data.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {data.phone}
                </div>
              )}
              {data.address && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {data.address}
                  {data.city && `, ${data.city}`}
                  {data.state && `, ${data.state}`}
                  {data.zipCode && ` ${data.zipCode}`}
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Links</h4>
            <div className="space-y-2 text-sm">
              {data.linkedinUrl && (
                <div className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                  <a 
                    href={data.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {data.githubUrl && (
                <div className="flex items-center">
                  <Github className="w-4 h-4 mr-2 text-gray-600" />
                  <a 
                    href={data.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:underline"
                  >
                    GitHub Profile
                  </a>
                </div>
              )}
              {data.websiteUrl && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-green-600" />
                  <a 
                    href={data.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    Personal Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {data.summary && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Professional Summary</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{data.summary}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary btn-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="btn btn-outline btn-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">First Name *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className={`input pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="Enter your first name"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="label">Last Name *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className={`input pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Enter your last name"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Email Address *</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">Phone Number</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('phone')}
                type="tel"
                className="input pl-10"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <label className="label">Address</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('address')}
              className="input pl-10"
              placeholder="Enter your street address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">City</label>
            <input
              {...register('city')}
              className="input"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="label">State/Province</label>
            <input
              {...register('state')}
              className="input"
              placeholder="Enter your state"
            />
          </div>

          <div>
            <label className="label">ZIP/Postal Code</label>
            <input
              {...register('zipCode')}
              className="input"
              placeholder="Enter your ZIP code"
            />
          </div>
        </div>

        <div>
          <label className="label">Country</label>
          <input
            {...register('country')}
            className="input"
            placeholder="Enter your country"
          />
        </div>

        {/* Professional Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">LinkedIn URL</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Linkedin className="h-5 w-5 text-blue-600" />
              </div>
              <input
                {...register('linkedinUrl')}
                type="url"
                className="input pl-10"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>
          </div>

          <div>
            <label className="label">GitHub URL</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-gray-600" />
              </div>
              <input
                {...register('githubUrl')}
                type="url"
                className="input pl-10"
                placeholder="https://github.com/yourname"
              />
            </div>
          </div>

          <div>
            <label className="label">Website URL</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <input
                {...register('websiteUrl')}
                type="url"
                className="input pl-10"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <label className="label">Professional Summary</label>
          <textarea
            {...register('summary')}
            rows={4}
            className="input"
            placeholder="Write a brief summary of your professional background, skills, and career objectives..."
          />
          <p className="mt-1 text-sm text-gray-500">
            This will appear at the top of your resume and should highlight your key strengths.
          </p>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
