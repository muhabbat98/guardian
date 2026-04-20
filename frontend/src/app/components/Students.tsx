import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, Users, Mail, Phone, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { StudentFormDialog } from './StudentFormDialog';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function Students() {
  const { students, deleteStudent, activities, payments } = useData();
  const { t } = useLanguage();
  const { can } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.guardianName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityNames = (activityIds: string[]) => {
    return activityIds
      .map(id => activities.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const hasOverduePayment = (studentId: string) => {
    return payments.some(p => p.studentId === studentId && p.status === 'overdue');
  };

  const hasPendingPayment = (studentId: string) => {
    return payments.some(p => p.studentId === studentId && (p.status === 'pending' || p.status === 'overdue'));
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${t.deleteConfirm} "${name}"?`)) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{t.students}</h1>
          <p className="text-gray-600 mt-1">{t.manageStudents}</p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={!can.addStudent}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>{t.addStudent}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t.searchStudents}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      {hasOverduePayment(student.id) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {t.overdue}
                        </span>
                      )}
                      {!hasOverduePayment(student.id) && hasPendingPayment(student.id) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs">
                          {t.paymentPending}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {t.born}: {new Date(student.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 lg:hidden">
                    {can.editStudent && (
                      <button
                        onClick={() => setEditingStudent(student.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {can.deleteStudent && (
                      <button
                        onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t.guardian}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {student.guardianName}
                      </p>
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {student.guardianPhone}
                      </p>
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {student.guardianEmail}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t.activities} ({student.activities.length})</p>
                    {student.activities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {student.activities.map((activityId) => {
                          const activity = activities.find(a => a.id === activityId);
                          return activity ? (
                            <span
                              key={activityId}
                              className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs"
                            >
                              {activity.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No {t.activities.toLowerCase()}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <Link
                  to={`/students/${student.id}`}
                  className="flex-1 lg:flex-none px-4 py-2 text-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  {t.viewDetails}
                </Link>
                <div className="hidden lg:flex gap-2">
                  {can.editStudent && (
                    <button
                      onClick={() => setEditingStudent(student.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {can.deleteStudent && (
                    <button
                      onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t.noStudentsFound}</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {isAddDialogOpen && (
        <StudentFormDialog
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}
      {editingStudent && (
        <StudentFormDialog
          studentId={editingStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
}