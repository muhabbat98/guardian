import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PaymentsTabProps {
  studentId: string;
}

export function PaymentsTab({ studentId }: PaymentsTabProps) {
  const { payments, addPayment, updatePayment } = useData();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    method: 'cash' as 'cash' | 'card' | 'transfer' | 'other',
    status: 'pending' as 'paid' | 'pending' | 'overdue',
    description: '',
  });

  const studentPayments = payments
    .filter(p => p.studentId === studentId)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const totalPaid = studentPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = studentPayments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPayment.amount) {
      addPayment({
        studentId,
        amount: parseFloat(newPayment.amount),
        date: newPayment.status === 'paid' ? newPayment.date : '',
        dueDate: newPayment.dueDate,
        method: newPayment.method,
        status: newPayment.status,
        description: newPayment.description,
      });
      setNewPayment({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        method: 'cash',
        status: 'pending',
        description: '',
      });
      setIsAddingPayment(false);
    }
  };

  const markAsPaid = (paymentId: string) => {
    updatePayment(paymentId, {
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {totalPaid.toLocaleString()} UZS
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Pending</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">
            {totalPending.toLocaleString()} UZS
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{studentPayments.length}</p>
        </div>
      </div>

      {/* Add Payment Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddingPayment(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Payment</span>
        </button>
      </div>

      {/* Add Payment Form */}
      {isAddingPayment && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment Record</h3>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (UZS) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newPayment.status}
                  onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {newPayment.status === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., March 2026 tuition"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddingPayment(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Add Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Records */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        {studentPayments.length > 0 ? (
          <div className="space-y-3">
            {studentPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {payment.amount.toLocaleString()} UZS
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                          payment.status === 'paid'
                            ? 'bg-green-50 text-green-700'
                            : payment.status === 'overdue'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {payment.status === 'paid' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : payment.status === 'overdue' ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {payment.status}
                      </span>
                    </div>
                    {payment.description && (
                      <p className="text-sm text-gray-600 mb-1">{payment.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>Method: {payment.method}</span>
                      <span>Due: {payment.dueDate}</span>
                      {payment.date && <span>Paid: {payment.date}</span>}
                    </div>
                  </div>
                  {payment.status !== 'paid' && (
                    <button
                      onClick={() => markAsPaid(payment.id)}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No payment records yet</p>
        )}
      </div>
    </div>
  );
}
