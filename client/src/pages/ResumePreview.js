import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../contexts/ResumeContext';
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  Share2,
  Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const ResumePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, loading, fetchResume } = useResume();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResume(id);
    }
  }, [id, fetchResume]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('resume-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${currentResume.title || 'resume'}.pdf`);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const formatDateRange = (startDate, endDate, isCurrent) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
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
                Resume Preview
              </h1>
              <p className="text-gray-600">
                {currentResume.title} - {currentResume.template} template
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/resume-builder/${id}`)}
              className="btn btn-outline btn-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Resume
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="btn btn-primary btn-sm"
            >
              {isGeneratingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="flex justify-center">
          <div 
            id="resume-content"
            className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full print-resume"
            style={{ minHeight: '842px' }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentResume.personalInfo?.firstName} {currentResume.personalInfo?.lastName}
              </h1>
              <div className="text-gray-600 space-y-1">
                {currentResume.personalInfo?.email && (
                  <p>{currentResume.personalInfo.email}</p>
                )}
                {currentResume.personalInfo?.phone && (
                  <p>{currentResume.personalInfo.phone}</p>
                )}
                {currentResume.personalInfo?.address && (
                  <p>
                    {currentResume.personalInfo.address}
                    {currentResume.personalInfo.city && `, ${currentResume.personalInfo.city}`}
                    {currentResume.personalInfo.state && `, ${currentResume.personalInfo.state}`}
                    {currentResume.personalInfo.zipCode && ` ${currentResume.personalInfo.zipCode}`}
                  </p>
                )}
                <div className="flex justify-center space-x-4 mt-2">
                  {currentResume.personalInfo?.linkedinUrl && (
                    <a 
                      href={currentResume.personalInfo.linkedinUrl}
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  {currentResume.personalInfo?.githubUrl && (
                    <a 
                      href={currentResume.personalInfo.githubUrl}
                      className="text-gray-600 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {currentResume.personalInfo?.websiteUrl && (
                    <a 
                      href={currentResume.personalInfo.websiteUrl}
                      className="text-green-600 hover:underline"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            {currentResume.personalInfo?.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-primary-600 pb-1">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {currentResume.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {currentResume.workExperience && currentResume.workExperience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-1">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {currentResume.workExperience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-primary-600 font-medium">
                            {exp.company_name}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                          {exp.description}
                        </p>
                      )}
                      {exp.achievements && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Key Achievements:</p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {exp.achievements}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {currentResume.education && currentResume.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-1">
                  Education
                </h2>
                <div className="space-y-4">
                  {currentResume.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {edu.degree}
                          </h3>
                          <p className="text-primary-600 font-medium">
                            {edu.institution}
                          </p>
                          {edu.field_of_study && (
                            <p className="text-gray-600 text-sm">
                              {edu.field_of_study}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</p>
                          {edu.location && <p>{edu.location}</p>}
                          {edu.gpa && <p>GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {currentResume.skills && currentResume.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-primary-600 pb-1">
                  Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentResume.skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">{skill.skill_name}</span>
                      <span className="text-sm text-gray-600">{skill.skill_level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
