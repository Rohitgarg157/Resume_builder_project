import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Tag
} from 'lucide-react';

const SkillsForm = ({ data, onAdd, isEditing, onEdit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [editingIndex, setEditingIndex] = useState(null);

  const skillLevels = [
    { value: 'Beginner', label: 'Beginner', color: 'bg-red-100 text-red-800' },
    { value: 'Intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Advanced', label: 'Advanced', color: 'bg-blue-100 text-blue-800' },
    { value: 'Expert', label: 'Expert', color: 'bg-green-100 text-green-800' }
  ];

  const skillCategories = [
    'Technical Skills',
    'Programming Languages',
    'Frameworks & Libraries',
    'Tools & Technologies',
    'Soft Skills',
    'Languages',
    'Certifications',
    'Other'
  ];

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

  const getSkillLevelColor = (level) => {
    const skillLevel = skillLevels.find(sl => sl.value === level);
    return skillLevel ? skillLevel.color : 'bg-gray-100 text-gray-800';
  };

  if (!isEditing && data && data.length > 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          <button
            onClick={() => onEdit()}
            className="btn btn-outline btn-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>

        {/* Group skills by category */}
        {skillCategories.map(category => {
          const categorySkills = data.filter(skill => skill.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-gray-900">{skill.skill_name}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(skill.skill_level)}`}>
                      {skill.skill_level}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Skills without category */}
        {data.filter(skill => !skill.category).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Other Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.filter(skill => !skill.category).map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-900">{skill.skill_name}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(skill.skill_level)}`}>
                    {skill.skill_level}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary btn-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Skill
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
        <div>
          <label className="label">Skill Name *</label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Star className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('skillName', { required: 'Skill name is required' })}
              className={`input pl-10 ${errors.skillName ? 'border-red-500' : ''}`}
              placeholder="e.g., JavaScript, Project Management, Spanish"
            />
          </div>
          {errors.skillName && (
            <p className="mt-1 text-sm text-red-600">{errors.skillName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Skill Level *</label>
            <select
              {...register('skillLevel', { required: 'Skill level is required' })}
              className={`input ${errors.skillLevel ? 'border-red-500' : ''}`}
            >
              <option value="">Select skill level</option>
              {skillLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.skillLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.skillLevel.message}</p>
            )}
          </div>

          <div>
            <label className="label">Category</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register('category')}
                className="input pl-10"
              >
                <option value="">Select category (optional)</option>
                {skillCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Skill Level Guidelines:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Beginner:</strong> Basic understanding, can work with guidance</li>
            <li><strong>Intermediate:</strong> Can work independently on most tasks</li>
            <li><strong>Advanced:</strong> Expert level, can teach others</li>
            <li><strong>Expert:</strong> Industry expert, can lead complex projects</li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Tips for adding skills:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Include both technical and soft skills</li>
            <li>• Be specific (e.g., "React.js" instead of "JavaScript")</li>
            <li>• Include industry-specific tools and technologies</li>
            <li>• Don't overstate your skill level</li>
            <li>• Group related skills by category for better organization</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default SkillsForm;
