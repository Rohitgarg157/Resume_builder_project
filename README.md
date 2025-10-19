# Resume Builder Project

A complete full-stack resume building application built with React.js frontend, Node.js backend, and MySQL database. This project allows users to create, edit, and download professional resumes with multiple templates and sections.

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Clean, responsive design built with React.js and Tailwind CSS
- **User Authentication**: Secure login and registration system
- **Resume Builder**: Intuitive form-based resume creation with multiple sections
- **Resume Preview**: Real-time preview of resume with professional templates
- **PDF Export**: Download resumes as PDF files
- **Dashboard**: Manage multiple resumes with statistics
- **Profile Management**: Update user profile and change password

### Backend Features
- **RESTful API**: Complete API with Express.js
- **JWT Authentication**: Secure token-based authentication
- **Database Integration**: MySQL database with comprehensive schema
- **Data Validation**: Input validation and error handling
- **Security**: Password hashing, CORS, rate limiting, and helmet
- **CRUD Operations**: Full create, read, update, delete functionality

### Resume Sections
- **Personal Information**: Contact details, professional summary, social links
- **Work Experience**: Job history with achievements and descriptions
- **Education**: Academic background with degrees and institutions
- **Skills**: Technical and soft skills with proficiency levels
- **Projects**: Portfolio projects and achievements
- **Certifications**: Professional certifications and credentials
- **Languages**: Language proficiency levels

## 🛠️ Tech Stack

### Frontend
- **React.js 18**: Modern React with hooks and context
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client for API calls
- **jsPDF & html2canvas**: PDF generation
- **Lucide React**: Modern icon library
- **React Hot Toast**: Toast notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MySQL2**: MySQL database driver
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Express Rate Limit**: Rate limiting
- **Joi**: Data validation
- **Express Validator**: Input validation

### Database
- **MySQL**: Relational database
- **Comprehensive Schema**: Users, resumes, personal info, work experience, education, skills, projects, certifications, languages

## 📁 Project Structure

```
resume-builder-project/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── forms/         # Form components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── styles/            # CSS styles
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── database/
│   └── schema.sql             # Database schema
├── middleware/
│   ├── auth.js               # Authentication middleware
│   └── validation.js         # Validation middleware
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── resume.js             # Resume management routes
│   └── user.js               # User management routes
├── server.js                 # Main server file
├── package.json              # Backend dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-builder-project
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up the database**
   - Create a MySQL database named `resume_builder`
   - Import the database schema:
   ```bash
   mysql -u root -p resume_builder < database/schema.sql
   ```

5. **Configure environment variables**
   - Copy `env.example` to `.env`
   - Update the database credentials and JWT secret:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=resume_builder
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

6. **Start the application**
   
   **Option 1: Start both servers separately**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```
   
   **Option 2: Use npm scripts**
   ```bash
   # Install all dependencies
   npm run install-all
   
   # Start backend
   npm run server
   
   # Start frontend (in another terminal)
   npm run client
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Resume Management
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:id` - Get single resume
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

### Resume Data
- `POST /api/resume/:id/personal-info` - Save personal information
- `POST /api/resume/:id/work-experience` - Add work experience
- `POST /api/resume/:id/education` - Add education
- `POST /api/resume/:id/skills` - Add skills
- `POST /api/resume/:id/projects` - Add projects
- `POST /api/resume/:id/certifications` - Add certifications
- `POST /api/resume/:id/languages` - Add languages

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/account` - Delete account
- `GET /api/user/stats` - Get user statistics

## 🎨 Features Overview

### User Authentication
- Secure registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### Resume Builder
- Step-by-step form wizard
- Real-time validation
- Multiple resume sections
- Template selection
- Auto-save functionality

### Resume Preview
- Professional resume templates
- Real-time preview
- Print-friendly layout
- PDF export functionality

### Dashboard
- Resume management
- User statistics
- Quick actions
- Recent activity

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection with helmet

## 🚀 Deployment

### Backend Deployment
1. Set up a MySQL database
2. Configure environment variables
3. Deploy to platforms like Heroku, DigitalOcean, or AWS
4. Update CORS settings for production domain

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Update API base URL in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎯 Future Enhancements

- [ ] Multiple resume templates
- [ ] Resume sharing and collaboration
- [ ] ATS optimization features
- [ ] Cover letter builder
- [ ] Job application tracking
- [ ] Resume analytics
- [ ] Mobile app
- [ ] Advanced PDF customization
- [ ] Resume versioning
- [ ] Integration with job boards

---

**Built with ❤️ for the Resume Builder Project Trial Task**
