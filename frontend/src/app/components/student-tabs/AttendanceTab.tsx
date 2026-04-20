import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AttendanceTabProps {
  studentId: string;
}

export function AttendanceTab({ studentId }: AttendanceTabProps) {
  const { attendance, activities, addAttendance, updateAttendance } = useData();
  const { operationLoading } = useData();
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    activityId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'excused',
    notes: '',
  });

  const studentAttendance = attendance
    .filter(a => a.studentId === studentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getActivityName = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    return activity?.name || 'Unknown Activity';
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRecord.activityId && newRecord.date) {
      addAttendance({
        studentId,
        ...newRecord,
      });
      setNewRecord({
        activityId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        notes: '',
      });
      setIsAddingRecord(false);
    }
  };

  const attendanceRate = studentAttendance.length > 0
    ? Math.round((studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{studentAttendance.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {studentAttendance.filter(a => a.status === 'present').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Attendance Rate</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">{attendanceRate}%</p>
        </div>
      </div>

      {/* Add Record Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddingRecord(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Add Record Form */}
      {isAddingRecord && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Attendance Record</h3>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity *
                </label>
                <select
                  required
                  value={newRecord.activityId}
                  onChange={(e) => setNewRecord({ ...newRecord, activityId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select activity</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'present', label: 'Present', color: 'green' },
                  { value: 'absent', label: 'Absent', color: 'red' },
                  { value: 'excused', label: 'Excused', color: 'yellow' },
                ].map((status) => (
                  <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={newRecord.status === status.value}
                      onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value as any })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional notes..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddingRecord(false)}
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
                Add Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance History</h3>
        {studentAttendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Activity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {studentAttendance.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{record.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{getActivityName(record.activityId)}</td>
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
                        ) : record.status === 'excused' ? (
                          <AlertCircle className="w-3 h-3" />
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
    </div>
  );
}
