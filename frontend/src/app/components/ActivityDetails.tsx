import { useParams, Link, useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Calendar, Clock, Users, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { ActivityFormDialog } from './ActivityFormDialog';

export function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, students, teachers, attendance, deleteActivity } = useData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const activity = activities.find(a => a.id === id);

  if (!activity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Activity not found</p>
        <Link to="/activities" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          ← Back to Activities
        </Link>
      </div>
    );
  }

  const enrolledStudents = students.filter(s => activity.students.includes(s.id));
  const assignedTeachers = teachers.filter(t => activity.teachers.includes(t.id));
  
  // Get recent attendance for this activity
  const recentAttendance = attendance
    .filter(a => a.activityId === activity.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${activity.name}"?`)) {
      deleteActivity(activity.id);
      navigate('/activities');
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/activities"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Activities</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{activity.name}</h1>
            {activity.description && (
              <p className="text-gray-600 mt-2">{activity.description}</p>
            )}
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

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Schedule</p>
              <p className="font-medium text-gray-900">{activity.dayOfWeek}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium text-gray-900">{activity.time}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enrollment</p>
              <p className="font-medium text-gray-900">
                {activity.students.length}
                {activity.capacity && ` / ${activity.capacity}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teachers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Assigned Teachers ({assignedTeachers.length})
          </h2>
          {assignedTeachers.length > 0 ? (
            <div className="space-y-3">
              {assignedTeachers.map((teacher) => (
                <div key={teacher.id} className="p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{teacher.specialization}</p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 text-xs text-gray-500">
                    <span>{teacher.email}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{teacher.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No teachers assigned</p>
          )}
        </div>

        {/* Enrolled Students */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Enrolled Students ({enrolledStudents.length})
          </h2>
          {enrolledStudents.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {enrolledStudents.map((student) => (
                <Link
                  key={student.id}
                  to={`/students/${student.id}`}
                  className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{student.guardianName}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No students enrolled</p>
          )}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h2>
        {recentAttendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{record.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{getStudentName(record.studentId)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                          record.status === 'present'
                            ? 'bg-green-50 text-green-700'
                            : record.status === 'excused'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {record.status === 'present' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No attendance records yet</p>
        )}
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <ActivityFormDialog
          activityId={activity.id}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
}
