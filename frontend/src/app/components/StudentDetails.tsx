import { useParams, Link, useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';
import { StudentFormDialog } from './StudentFormDialog';
import { AttendanceTab } from './student-tabs/AttendanceTab';
import { PaymentsTab } from './student-tabs/PaymentsTab';
import { AgreementsTab } from './student-tabs/AgreementsTab';

export function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, activities, deleteStudent } = useData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'payments' | 'agreements'>('overview');

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Student not found</p>
        <Link to="/students" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          ← Back to Students
        </Link>
      </div>
    );
  }

  const enrolledActivities = activities.filter(a => student.activities.includes(a.id));

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${student.firstName} ${student.lastName}"?`)) {
      deleteStudent(student.id);
      navigate('/students');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'payments', label: 'Payments' },
    { id: 'agreements', label: 'Agreements' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              Born: {new Date(student.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Guardian</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{student.guardianName}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{student.guardianPhone}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{student.guardianEmail}</span>
                </div>
              </div>
              {student.address && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{student.address}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Enrollment Date</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(student.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Activities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Enrolled Activities ({enrolledActivities.length})
            </h2>
            {enrolledActivities.length > 0 ? (
              <div className="space-y-3">
                {enrolledActivities.map((activity) => (
                  <Link
                    key={activity.id}
                    to={`/activities/${activity.id}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.dayOfWeek}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No activities enrolled</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && <AttendanceTab studentId={student.id} />}
      {activeTab === 'payments' && <PaymentsTab studentId={student.id} />}
      {activeTab === 'agreements' && <AgreementsTab studentId={student.id} />}

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <StudentFormDialog
          studentId={student.id}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
}
