import { useData } from '../contexts/DataContext';
import { Calendar, Users, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';

export function Dashboard() {
  const { activities, students, payments, attendance } = useData();
  const { t } = useLanguage();

  const todayAttendance = attendance.filter(a => a.date === '2026-03-11');
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  const overduePayments = payments.filter(p => p.status === 'overdue');

  const stats = [
    {
      label: t.totalActivities,
      value: activities.length,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      link: '/activities',
    },
    {
      label: t.totalStudents,
      value: students.length,
      icon: Users,
      color: 'bg-green-50 text-green-600',
      link: '/students',
    },
    {
      label: t.pendingPayments,
      value: pendingPayments.length,
      icon: DollarSign,
      color: 'bg-yellow-50 text-yellow-600',
      link: '/students',
    },
    {
      label: t.todaysAttendance,
      value: `${presentCount}/${todayAttendance.length}`,
      icon: CheckCircle,
      color: 'bg-purple-50 text-purple-600',
      link: '/activities',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{t.dashboard}</h1>
        <p className="text-gray-600 mt-1">{t.welcomeMessage}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Alerts */}
      {overduePayments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">{t.overduePayments}</h3>
            <p className="text-sm text-red-700 mt-1">
              {overduePayments.length} {t.overduePaymentMessage}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t.recentActivities}</h2>
            <Link to="/activities" className="text-sm text-blue-600 hover:text-blue-700">
              {t.viewAll}
            </Link>
          </div>
          <div className="space-y-3">
            {activities.slice(0, 3).map((activity) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.dayOfWeek}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.time}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.students.length} {t.students}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t.recentStudents}</h2>
            <Link to="/students" className="text-sm text-blue-600 hover:text-blue-700">
              {t.viewAll}
            </Link>
          </div>
          <div className="space-y-3">
            {students.slice(0, 3).map((student) => (
              <Link
                key={student.id}
                to={`/students/${student.id}`}
                className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{student.guardianName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {student.activities.length} {t.activities.toLowerCase()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}