const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const db = req.db;

    await db.execute(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
      [firstName, lastName, phone, req.user.userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = req.db;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get current password hash
    const [users] = await db.execute(
      'SELECT password FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, req.user.userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const db = req.db;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    // Get current password hash
    const [users] = await db.execute(
      'SELECT password FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, users[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Delete user (cascade will handle related data)
    await db.execute('DELETE FROM users WHERE id = ?', [req.user.userId]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.userId;

    // Get resume count
    const [resumeCount] = await db.execute(
      'SELECT COUNT(*) as count FROM resumes WHERE user_id = ?',
      [userId]
    );

    // Get total work experience entries
    const [workExpCount] = await db.execute(
      'SELECT COUNT(*) as count FROM work_experience we JOIN resumes r ON we.resume_id = r.id WHERE r.user_id = ?',
      [userId]
    );

    // Get total education entries
    const [educationCount] = await db.execute(
      'SELECT COUNT(*) as count FROM education e JOIN resumes r ON e.resume_id = r.id WHERE r.user_id = ?',
      [userId]
    );

    // Get total skills
    const [skillsCount] = await db.execute(
      'SELECT COUNT(*) as count FROM skills s JOIN resumes r ON s.resume_id = r.id WHERE r.user_id = ?',
      [userId]
    );

    res.json({
      resumeCount: resumeCount[0].count,
      workExperienceCount: workExpCount[0].count,
      educationCount: educationCount[0].count,
      skillsCount: skillsCount[0].count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
