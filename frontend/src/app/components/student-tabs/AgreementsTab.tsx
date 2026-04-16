import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AgreementsTabProps {
  studentId: string;
}

export function AgreementsTab({ studentId }: AgreementsTabProps) {
  const { agreements, addAgreement, updateAgreement } = useData();
  const [isAddingAgreement, setIsAddingAgreement] = useState(false);
  const [newAgreement, setNewAgreement] = useState({
    agreementDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    terms: '',
    signedBy: '',
    status: 'active' as 'active' | 'expired' | 'pending',
  });

  const studentAgreements = agreements
    .filter(a => a.studentId === studentId)
    .sort((a, b) => new Date(b.agreementDate).getTime() - new Date(a.agreementDate).getTime());

  const handleAddAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAgreement.startDate && newAgreement.endDate && newAgreement.signedBy) {
      addAgreement({
        studentId,
        ...newAgreement,
      });
      setNewAgreement({
        agreementDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        terms: '',
        signedBy: '',
        status: 'active',
      });
      setIsAddingAgreement(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'expired':
        return 'bg-red-50 text-red-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />;
      case 'expired':
        return <AlertCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Agreements</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{studentAgreements.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {studentAgreements.filter(a => a.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            {studentAgreements.filter(a => a.status === 'expired').length}
          </p>
        </div>
      </div>

      {/* Add Agreement Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddingAgreement(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Agreement</span>
        </button>
      </div>

      {/* Add Agreement Form */}
      {isAddingAgreement && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Agreement</h3>
          <form onSubmit={handleAddAgreement} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agreement Date *
                </label>
                <input
                  type="date"
                  required
                  value={newAgreement.agreementDate}
                  onChange={(e) => setNewAgreement({ ...newAgreement, agreementDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={newAgreement.startDate}
                  onChange={(e) => setNewAgreement({ ...newAgreement, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={newAgreement.endDate}
                  onChange={(e) => setNewAgreement({ ...newAgreement, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signed By *
                </label>
                <input
                  type="text"
                  required
                  value={newAgreement.signedBy}
                  onChange={(e) => setNewAgreement({ ...newAgreement, signedBy: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Guardian name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newAgreement.status}
                  onChange={(e) => setNewAgreement({ ...newAgreement, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms & Conditions
              </label>
              <textarea
                value={newAgreement.terms}
                onChange={(e) => setNewAgreement({ ...newAgreement, terms: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agreement terms and conditions..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddingAgreement(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Create Agreement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Agreement Records */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement History</h3>
        {studentAgreements.length > 0 ? (
          <div className="space-y-4">
            {studentAgreements.map((agreement) => (
              <div
                key={agreement.id}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      Agreement #{agreement.id}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${getStatusColor(agreement.status)}`}>
                    {getStatusIcon(agreement.status)}
                    {agreement.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Agreement Date</p>
                    <p className="text-sm text-gray-900">{agreement.agreementDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Signed By</p>
                    <p className="text-sm text-gray-900">{agreement.signedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm text-gray-900">{agreement.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm text-gray-900">{agreement.endDate}</p>
                  </div>
                </div>

                {agreement.terms && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Terms & Conditions</p>
                    <p className="text-sm text-gray-700">{agreement.terms}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No agreements yet</p>
        )}
      </div>
    </div>
  );
}
