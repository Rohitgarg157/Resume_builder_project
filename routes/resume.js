const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateResume, validatePersonalInfo, validateWorkExperience, validateEducation } = require('../middleware/validation');

const router = express.Router();

// Get all resumes for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const [resumes] = await db.execute(
      `SELECT r.*, pi.first_name, pi.last_name, pi.email 
       FROM resumes r 
       LEFT JOIN personal_info pi ON r.id = pi.resume_id 
       WHERE r.user_id = ? 
       ORDER BY r.updated_at DESC`,
      [req.user.userId]
    );

    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single resume with all data
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.db;

    // Verify resume belongs to user
    const [resumeCheck] = await db.execute(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (resumeCheck.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Get resume basic info
    const [resume] = await db.execute(
      'SELECT * FROM resumes WHERE id = ?',
      [id]
    );

    // Get personal info
    const [personalInfo] = await db.execute(
      'SELECT * FROM personal_info WHERE resume_id = ?',
      [id]
    );

    // Get work experience
    const [workExperience] = await db.execute(
      'SELECT * FROM work_experience WHERE resume_id = ? ORDER BY start_date DESC',
      [id]
    );

    // Get education
    const [education] = await db.execute(
      'SELECT * FROM education WHERE resume_id = ? ORDER BY start_date DESC',
      [id]
    );

    // Get skills
    const [skills] = await db.execute(
      'SELECT * FROM skills WHERE resume_id = ?',
      [id]
    );

    // Get projects
    const [projects] = await db.execute(
      'SELECT * FROM projects WHERE resume_id = ? ORDER BY start_date DESC',
      [id]
    );

    // Get certifications
    const [certifications] = await db.execute(
      'SELECT * FROM certifications WHERE resume_id = ? ORDER BY issue_date DESC',
      [id]
    );

    // Get languages
    const [languages] = await db.execute(
      'SELECT * FROM languages WHERE resume_id = ?',
      [id]
    );

    res.json({
      ...resume[0],
      personalInfo: personalInfo[0] || {},
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new resume
router.post('/', authenticateToken, validateResume, async (req, res) => {
  try {
    const { title, template = 'modern' } = req.body;
    const db = req.db;

    const [result] = await db.execute(
      'INSERT INTO resumes (user_id, title, template) VALUES (?, ?, ?)',
      [req.user.userId, title, template]
    );

    const resumeId = result.insertId;

    res.status(201).json({
      message: 'Resume created successfully',
      resumeId,
      resume: {
        id: resumeId,
        title,
        template,
        userId: req.user.userId
      }
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update resume basic info
router.put('/:id', authenticateToken, validateResume, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, template, isPublic } = req.body;
    const db = req.db;

    // Verify resume belongs to user
    const [resumeCheck] = await db.execute(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (resumeCheck.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await db.execute(
      'UPDATE resumes SET title = ?, template = ?, is_public = ? WHERE id = ?',
      [title, template, isPublic || false, id]
    );

    res.json({ message: 'Resume updated successfully' });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete resume
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.db;

    // Verify resume belongs to user
    const [resumeCheck] = await db.execute(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (resumeCheck.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await db.execute('DELETE FROM resumes WHERE id = ?', [id]);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Personal Information Routes
router.post('/:id/personal-info', authenticateToken, validatePersonalInfo, async (req, res) => {
  try {
    const { id } = req.params;
    const personalData = req.body;
    const db = req.db;

    // Verify resume belongs to user
    const [resumeCheck] = await db.execute(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (resumeCheck.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if personal info already exists
    const [existing] = await db.execute(
      'SELECT id FROM personal_info WHERE resume_id = ?',
      [id]
    );

    if (existing.length > 0) {
      // Update existing
      await db.execute(
        `UPDATE personal_info SET 
         first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, 
         city = ?, state = ?, zip_code = ?, country = ?, linkedin_url = ?, 
         github_url = ?, website_url = ?, summary = ?
         WHERE resume_id = ?`,
        [
          personalData.firstName, personalData.lastName, personalData.email,
          personalData.phone, personalData.address, personalData.city,
          personalData.state, personalData.zipCode, personalData.country,
          personalData.linkedinUrl, personalData.githubUrl, personalData.websiteUrl,
          personalData.summary, id
        ]
      );
    } else {
      // Create new
      await db.execute(
        `INSERT INTO personal_info 
         (resume_id, first_name, last_name, email, phone, address, city, state, 
          zip_code, country, linkedin_url, github_url, website_url, summary)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, personalData.firstName, personalData.lastName, personalData.email,
          personalData.phone, personalData.address, personalData.city,
          personalData.state, personalData.zipCode, personalData.country,
          personalData.linkedinUrl, personalData.githubUrl, personalData.websiteUrl,
          personalData.summary
        ]
      );
    }

    res.json({ message: 'Personal information saved successfully' });
  } catch (error) {
    console.error('Save personal info error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Work Experience Routes
router.post('/:id/work-experience', authenticateToken, validateWorkExperience, async (req, res) => {
  try {
    const { id } = req.params;
    const workData = req.body;
    const db = req.db;

    // Verify resume belongs to user
    const [resumeCheck] = await db.execute(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (resumeCheck.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const [result] = await db.execute(
      `INSERT INTO work_experience 
       (resume_id, company_name, position, location, start_date, end_date, 
        is_current, description, achievements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, workData.companyName, workData.position, workData.location,
        workData.startDate, workData.endDate, workData.isCurrent || false,
        workData.description, workData.achievements
      ]
    );

    res.status(201).json({
      message: 'Work experience added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Add work experience error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Education Routes
router.post('/:id/education', authenticateToken, validateEducation, async (req, res) => {
  try {
    const { id } = req.params;
    const educationData = req.body;
    const db = req.db;

    // Verify resume belongs to user
    const [resumeCheck] = await db.execute(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (resumeCheck.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const [result] = await db.execute(
      `INSERT INTO education 
       (resume_id, institution, degree, field_of_study, location, start_date, 
        end_date, is_current, gpa, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, educationData.institution, educationData.degree, educationData.fieldOfStudy,
        educationData.location, educationData.startDate, educationData.endDate,
        educationData.isCurrent || false, educationData.gpa, educationData.description
      ]
    );

    res.status(201).json({
      message: 'Education added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Skills Routes
router.post('/:id/skills', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { skillName, skillLevel, category } = req.body;
    const db = req.db;

    // Verify resume belongs to user
    const [resumeCheck] = await db.execute(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (resumeCheck.length === 0) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const [result] = await db.execute(
      'INSERT INTO skills (resume_id, skill_name, skill_level, category) VALUES (?, ?, ?, ?)',
      [id, skillName, skillLevel || 'Intermediate', category]
    );

    res.status(201).json({
      message: 'Skill added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
