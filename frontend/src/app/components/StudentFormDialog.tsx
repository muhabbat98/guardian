import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { X } from 'lucide-react';

interface StudentFormDialogProps {
  studentId?: string;
  onClose: () => void;
}

export function StudentFormDialog({ studentId, onClose }: StudentFormDialogProps) {
  const { students, addStudent, updateStudent, activities } = useData();
  
  const student = studentId ? students.find(s => s.id === studentId) : null;
  
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    dateOfBirth: student?.dateOfBirth || '',
    guardianName: student?.guardianName || '',
    guardianPhone: student?.guardianPhone || '',
    guardianEmail: student?.guardianEmail || '',
    address: student?.address || '',
    enrollmentDate: student?.enrollmentDate || new Date().toISOString().split('T')[0],
    activities: student?.activities || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (studentId) {
      updateStudent(studentId, formData);
    } else {
      addStudent(formData);
    }
    
    onClose();
  };

  const toggleActivity = (activityId: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter(id => id !== activityId)
        : [...prev.activities, activityId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {studentId ? 'Edit Student' : 'Add New Student'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enrollment Date *
              </label>
              <input
                type="date"
                required
                value={formData.enrollmentDate}
                onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street, District, City"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+998901234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.guardianEmail}
                    onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enroll in Activities
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {activities.map((activity) => (
                <label key={activity.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.activities.includes(activity.id)}
                    onChange={() => toggleActivity(activity.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {activity.name} - {activity.dayOfWeek} ({activity.time})
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
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {studentId ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
