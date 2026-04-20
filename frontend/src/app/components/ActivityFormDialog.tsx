import { useState, useEffect } from 'react';
import { useData, Activity } from '../contexts/DataContext';
import { X, Loader2 } from 'lucide-react';

interface ActivityFormDialogProps {
  activityId?: string;
  onClose: () => void;
}

export function ActivityFormDialog({ activityId, onClose }: ActivityFormDialogProps) {
  const { activities, addActivity, updateActivity, teachers, students } = useData();
  const { operationLoading } = useData();
  
  const activity = activityId ? activities.find(a => a.id === activityId) : null;
  
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    time: activity?.time || '',
    dayOfWeek: activity?.dayOfWeek || '',
    description: activity?.description || '',
    capacity: activity?.capacity?.toString() || '',
    teachers: activity?.teachers || [],
    students: activity?.students || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      time: formData.time,
      dayOfWeek: formData.dayOfWeek,
      description: formData.description,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      teachers: formData.teachers,
      students: formData.students,
    };

    if (activityId) {
      updateActivity(activityId, data);
    } else {
      addActivity(data);
    }
    
    onClose();
  };

  const toggleTeacher = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      teachers: prev.teachers.includes(teacherId)
        ? prev.teachers.filter(id => id !== teacherId)
        : [...prev.teachers, teacherId],
    }));
  };

  const toggleStudent = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {activityId ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Arts & Crafts"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 14:00 - 15:30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day(s) of Week *
              </label>
              <input
                type="text"
                required
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Monday, Wednesday"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Maximum number of students"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the activity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Teachers
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {teachers.map((teacher) => (
                <label key={teacher.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.teachers.includes(teacher.id)}
                    onChange={() => toggleTeacher(teacher.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {teacher.firstName} {teacher.lastName} - {teacher.specialization}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Students
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {students.map((student) => (
                <label key={student.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.students.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {student.firstName} {student.lastName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={operationLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={operationLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {operationLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {activityId ? 'Update' : 'Create'} Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
