import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, Calendar, Users as UsersIcon, Clock, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { ActivityFormDialog } from './ActivityFormDialog';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function Activities() {
  const { activities, deleteActivity, students, teachers } = useData();
  const { t } = useLanguage();
  const { can } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.dayOfWeek.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${t.deleteConfirm} "${name}"?`)) {
      deleteActivity(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{t.activities}</h1>
          <p className="text-gray-600 mt-1">{t.manageActivities}</p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={!can.addActivity}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>{t.addActivity}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t.searchActivities}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
              <div className="flex gap-1">
                {can.editActivity && (
                  <button
                    onClick={() => setEditingActivity(activity.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {can.deleteActivity && (
                  <button
                    onClick={() => handleDelete(activity.id, activity.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {activity.description && (
              <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{activity.dayOfWeek}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{activity.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <UsersIcon className="w-4 h-4 text-gray-400" />
                <span>
                  {activity.students.length}
                  {activity.capacity && ` / ${activity.capacity}`} {t.students}
                </span>
              </div>
            </div>

            {activity.teachers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">{t.teacher}{activity.teachers.length > 1 ? 's' : ''}</p>
                <div className="flex flex-wrap gap-2">
                  {activity.teachers.map((teacherId) => (
                    <span
                      key={teacherId}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs"
                    >
                      {getTeacherName(teacherId)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              to={`/activities/${activity.id}`}
              className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t.viewDetails} →
            </Link>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t.noActivitiesFound}</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {isAddDialogOpen && (
        <ActivityFormDialog
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}
      {editingActivity && (
        <ActivityFormDialog
          activityId={editingActivity}
          onClose={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
}