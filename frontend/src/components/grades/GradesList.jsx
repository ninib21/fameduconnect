import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FunnelIcon, 
  PlusIcon, 
  ChartBarIcon,
  CalendarIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { USER_ROLES } from '../../utils/constants';

const GradesList = ({ user, selectedStudent = null }) => {
  const { t } = useTranslation();
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [filters, setFilters] = useState({
    subject: 'all',
    category: 'all',
    dateRange: 'all'
  });
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  // Mock grades data
  useEffect(() => {
    const mockGrades = [
      {
        id: '1',
        studentId: 'student1',
        studentName: 'Emma Anderson',
        subject: 'Mathematics',
        assignmentName: 'Algebra Quiz #3',
        category: 'quiz',
        score: 92,
        maxScore: 100,
        percentage: 92,
        letterGrade: 'A-',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        teacherName: 'Ms. Johnson',
        comments: 'Excellent work on quadratic equations!'
      },
      {
        id: '2',
        studentId: 'student1',
        studentName: 'Emma Anderson',
        subject: 'Mathematics',
        assignmentName: 'Homework Set 12',
        category: 'homework',
        score: 18,
        maxScore: 20,
        percentage: 90,
        letterGrade: 'A-',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        teacherName: 'Ms. Johnson',
        comments: 'Good understanding of concepts'
      },
      {
        id: '3',
        studentId: 'student1',
        studentName: 'Emma Anderson',
        subject: 'Science',
        assignmentName: 'Chemistry Lab Report',
        category: 'project',
        score: 95,
        maxScore: 100,
        percentage: 95,
        letterGrade: 'A',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        teacherName: 'Mr. Smith',
        comments: 'Outstanding analysis and presentation'
      },
      {
        id: '4',
        studentId: 'student1',
        studentName: 'Emma Anderson',
        subject: 'English',
        assignmentName: 'Essay: To Kill a Mockingbird',
        category: 'assignment',
        score: 88,
        maxScore: 100,
        percentage: 88,
        letterGrade: 'B+',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        teacherName: 'Mrs. Davis',
        comments: 'Well-structured argument, good use of evidence'
      },
      {
        id: '5',
        studentId: 'student1',
        studentName: 'Emma Anderson',
        subject: 'Science',
        assignmentName: 'Physics Test - Motion',
        category: 'test',
        score: 85,
        maxScore: 100,
        percentage: 85,
        letterGrade: 'B',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        teacherName: 'Mr. Smith',
        comments: 'Good grasp of basic concepts, review velocity calculations'
      }
    ];

    setGrades(mockGrades);
    setFilteredGrades(mockGrades);
  }, []);

  // Filter grades based on selected filters
  useEffect(() => {
    let filtered = [...grades];

    if (filters.subject !== 'all') {
      filtered = filtered.filter(grade => grade.subject === filters.subject);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(grade => grade.category === filters.category);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'semester':
          filterDate.setMonth(now.getMonth() - 6);
          break;
      }
      
      filtered = filtered.filter(grade => new Date(grade.date) >= filterDate);
    }

    setFilteredGrades(filtered);
  }, [grades, filters]);

  const getUniqueSubjects = () => {
    return [...new Set(grades.map(grade => grade.subject))];
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'test': return <AcademicCapIcon className="h-4 w-4" />;
      case 'quiz': return <AcademicCapIcon className="h-4 w-4" />;
      case 'homework': return <CalendarIcon className="h-4 w-4" />;
      case 'project': return <TrophyIcon className="h-4 w-4" />;
      default: return <AcademicCapIcon className="h-4 w-4" />;
    }
  };

  const calculateSubjectAverage = (subject) => {
    const subjectGrades = filteredGrades.filter(grade => grade.subject === subject);
    if (subjectGrades.length === 0) return 0;
    
    const total = subjectGrades.reduce((sum, grade) => sum + grade.percentage, 0);
    return Math.round(total / subjectGrades.length);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === USER_ROLES.PARENT ? 'Grades' : 'Student Grades'}
            </h1>
            {selectedStudent && (
              <p className="text-sm text-gray-600 mt-1">
                Viewing grades for {selectedStudent.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'chart' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChartBarIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Add Grade Button (Teachers only) */}
            {user.role === USER_ROLES.TEACHER && (
              <button
                onClick={() => setShowAddGrade(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Grade</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {/* Subject Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Subjects</option>
              {getUniqueSubjects().map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="test">Tests</option>
            <option value="quiz">Quizzes</option>
            <option value="homework">Homework</option>
            <option value="project">Projects</option>
            <option value="assignment">Assignments</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="semester">This Semester</option>
          </select>

          {/* Results Count */}
          <span className="text-sm text-gray-500">
            {filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Subject Averages */}
      {viewMode === 'list' && (
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Subject Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getUniqueSubjects().map(subject => {
              const average = calculateSubjectAverage(subject);
              return (
                <div key={subject} className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">{subject}</p>
                  <p className={`text-lg font-bold ${getGradeColor(average).split(' ')[0]}`}>
                    {average}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grades List */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' ? (
          <div className="divide-y divide-gray-200">
            {filteredGrades.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No grades found</h3>
                  <p className="text-sm">
                    {filters.subject !== 'all' || filters.category !== 'all' || filters.dateRange !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'Grades will appear here once they are added.'}
                  </p>
                </div>
              </div>
            ) : (
              filteredGrades.map((grade) => (
                <div key={grade.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-1 rounded ${getGradeColor(grade.percentage).split(' ')[1]}`}>
                          {getCategoryIcon(grade.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {grade.assignmentName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {grade.subject} • {grade.teacherName}
                          </p>
                        </div>
                      </div>
                      
                      {grade.comments && (
                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                          "{grade.comments}"
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <span>Category: {grade.category}</span>
                        <span>Date: {formatDate(grade.date)}</span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.percentage)}`}>
                        {grade.letterGrade}
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {grade.score}/{grade.maxScore}
                      </p>
                      <p className="text-sm text-gray-600">
                        {grade.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Grade Charts</h3>
              <p className="text-gray-600">
                Grade visualization charts will be implemented in the next phase.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesList;