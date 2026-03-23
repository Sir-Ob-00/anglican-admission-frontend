# Anglican Admission System

A modern admission management system for Anglican schools with frontend-only architecture.

## 🏗️ Architecture

This project uses a **frontend-only stack** with external backend services:

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: External API services (to be integrated)
- **Database**: External database services (to be integrated)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd anglican-admission-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

## 📱 Features

### User Management
- **Multi-role Authentication**: Admin, Headteacher, Assistant Headteacher, Teacher, Parent
- **User Profiles**: Complete user management with role-based access
- **Security**: JWT-based authentication with role permissions

### Student Admissions
- **Application Process**: Complete student application workflow
- **Document Management**: Upload and manage admission documents
- **Review System**: Multi-level review process
- **Status Tracking**: Real-time application status updates

### Examination System
- **Exam Creation**: Teachers can create and manage entrance exams
- **Class-Based Access**: Teachers see exams for their assigned classes
- **Question Management**: Comprehensive question bank management
- **Auto-Grading**: Automatic exam scoring with manual review
- **Score Display**: Immediate score display to students

### Payment Processing
- **Parent Dashboard**: Parents initiate payments directly
- **Payment Tracking**: Complete payment history and status
- **Receipt Generation**: Automatic receipt generation
- **Multiple Methods**: Support for various payment methods

### Reporting & Analytics
- **Comprehensive Reports**: Multiple report types with PDF export
- **Real-time Data**: Live data aggregation and visualization
- **Class-Based Analytics**: Detailed analytics by class
- **Payment Analytics**: Complete payment tracking and reporting

## 🎯 Role-Based Access

### Admin
- **Full System Access**: Complete administrative control
- **User Management**: Create and manage all user types
- **System Configuration**: Configure system settings
- **Report Access**: All reports and analytics

### Headteacher
- **Academic Oversight**: Complete academic management
- **Teacher Management**: Assign teachers to classes
- **Exam Oversight**: All exam management and review
- **Admission Control**: Final admission decisions
- **Report Access**: Academic and administrative reports

### Assistant Headteacher
- **Academic Support**: Support academic operations
- **Exam Management**: Create and manage exams
- **Review Process**: Review exam results and applications
- **Parent Communication**: Communicate with parents
- **Report Access**: Academic reports and analytics

### Teacher
- **Class-Specific Access**: Access to assigned class only
- **Exam Creation**: Create exams for assigned classes
- **Question Management**: Manage exam questions
- **Student Assessment**: Grade and assess student performance
- **Class Reports**: Reports for assigned classes

### Parent
- **Student Management**: Manage children's applications
- **Payment Processing**: Initiate and track payments
- **Communication**: Receive school communications
- **Document Access**: Access children's documents
- **Progress Tracking**: Monitor admission progress

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and context
- **Vite**: Fast development and building tool
- **TailwindCSS**: Utility-first CSS framework
- **Recharts**: Data visualization and charting
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

### Key Features
- **Responsive Design**: Mobile-first responsive interface
- **Real-time Updates**: Live data synchronization
- **PDF Generation**: Client-side PDF report generation
- **Camera Integration**: Document scanning and photo capture
- **File Upload**: Comprehensive file management
- **Form Validation**: Client and server-side validation

## 📊 Reports & Analytics

### Available Reports
- **Applicants by Class**: Class-wise application distribution
- **Admitted Students**: Admission statistics by class
- **Payment Reports**: Detailed payment analytics
- **Exam Performance**: Comprehensive exam analytics
- **Student Progress**: Individual student tracking

### Export Options
- **PDF Downloads**: All reports downloadable as PDF
- **Data Export**: Export data in various formats
- **Print Support**: Optimized for printing

## 🔐 Security Features

- **Role-Based Access Control**: Granular permission system
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive data validation
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery prevention

## 🚀 Deployment

### Development
```bash
npm run dev
```
- Development server runs on http://localhost:5173
- Hot reload enabled for fast development
- Source maps available for debugging

### Production
```bash
npm run build
npm run start
```
- Optimized production build
- Static file serving
- Production-ready configuration

## 📁 Project Structure

```
anglican-admission-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   ├── public/             # Public assets
│   └── package.json       # Frontend dependencies
├── docs/                  # Documentation
├── .gitignore            # Git ignore file
└── package.json          # Root package configuration
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Anglican Admission System
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the code comments for additional context

---

**Note**: This is a frontend-only application. Backend services need to be integrated separately based on your specific requirements and technology stack preferences.
