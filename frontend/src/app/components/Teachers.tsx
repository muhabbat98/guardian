import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { TeacherFormDialog } from './TeacherFormDialog';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function Teachers() {
  const { teachers, deleteTeacher, activities } = useData();
  const { t } = useLanguage();
  const { can } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityNames = (teacherId: string) => {
    return activities
      .filter(a => a.teachers && a.teachers.includes(teacherId))
      .map(a => a.name)
      .join(', ');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteTeacher(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage instructors and their assignments</p>
        </div>
        <button
          onClick={() => {
            setEditingTeacherId(null);
            setIsAddDialogOpen(true);
          }}
          disabled={!can.addTeacher}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {teacher.firstName} {teacher.lastName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{teacher.specialization}</p>
              </div>
              <div className="flex gap-2">
                {can.editTeacher && (
                  <button
                    onClick={() => {
                      setEditingTeacherId(teacher.id);
                      setIsAddDialogOpen(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {can.deleteTeacher && (
                  <button
                    onClick={() => handleDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:text-blue-700">
                    {teacher.email}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${teacher.phone}`} className="text-blue-600 hover:text-blue-700">
                    {teacher.phone}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Activities</p>
                <p className="text-sm text-gray-600">
                  {getActivityNames(teacher.id) || 'No activities assigned'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No teachers found</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {isAddDialogOpen && (
        <TeacherFormDialog
          teacherId={editingTeacherId}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingTeacherId(null);
          }}
        />
      )}
    </div>
  );
}
