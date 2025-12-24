'use client';

import {
  getPlayers,
  updatePlayer,
  getExpenses,
  addExpense,
  addGuest,
  Player,
  Payment,
  Expense,
  deleteExpense,
  getTournaments,
  updateTournament,
} from '@/lib/localDb';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';

interface AdminStats {
  pendingPlayers: number;
  approvedPlayers: number;
  totalExpenses: number;
  totalCollected: number;
  remaining: number;
}

export default function AdminDashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    pendingPlayers: 0,
    approvedPlayers: 0,
    totalExpenses: 0,
    totalCollected: 0,
    remaining: 0,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [paymentData, setPaymentData] = useState({ amount: 0, date: '' });
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      // Check admin status
      const admin = localStorage.getItem('isAdmin') === 'true';
      if (!admin) {
        // Redirect or show message
        return;
      }
      setIsAdmin(admin);

      const [playersData, expensesData, tournamentsData] = await Promise.all([
        getPlayers(),
        getExpenses(),
        getTournaments(),
      ]);

      setPlayers(playersData);
      setExpenses(expensesData);
      setTournaments(tournamentsData);

      // Calculate stats
      const pendingCount = playersData.filter((p) => p.status === 'pending').length;
      const approvedCount = playersData.filter((p) => p.status === 'approved').length;
      const totalExp = expensesData.reduce((sum, e) => sum + e.amount, 0);
      const totalCol = playersData.reduce(
        (sum, p) => sum + p?.payments.reduce((psum, pay) => psum + pay.amount, 0),
        0
      );

      setStats({
        pendingPlayers: pendingCount,
        approvedPlayers: approvedCount,
        totalExpenses: totalExp,
        totalCollected: totalCol,
        remaining: totalCol - totalExp,
      });
    };

    loadData();
  }, []);

  // Handle player approval
  const handleApprovePlayer = async (playerId: string) => {
    await updatePlayer(playerId, { status: 'approved' });
    const updated = await getPlayers();
    setPlayers(updated);
  };

  // Handle player rejection
  const handleRejectPlayer = async (playerId: string) => {
    await updatePlayer(playerId, { status: 'rejected' });
    const updated = await getPlayers();
    setPlayers(updated);
  };

  // Handle payment recording
  const handleRecordPayment = async () => {
    if (!selectedPlayer || !paymentData.amount || !paymentData.date) return;

    const newPayment: Payment = {
      date: paymentData.date,
      amount: paymentData.amount,
    };

    const updated = await updatePlayer(selectedPlayer.id, {
      payments: [...selectedPlayer.payments, newPayment],
    });

    if (updated) {
      setPlayers(players.map((p) => (p.id === updated.id ? updated : p)));
      setShowPaymentModal(false);
      setSelectedPlayer(null);
      setPaymentData({ amount: 0, date: '' });
    }
  };

  // Handle add expense
  const handleAddExpense = async () => {
    if (!expenseData.description || !expenseData.amount) return;

    const newExpense = await addExpense({
      description: expenseData.description,
      amount: expenseData.amount,
      date: expenseData.date,
    });

    setExpenses([...expenses, newExpense]);
    setShowExpenseModal(false);
    setExpenseData({ description: '', amount: 0, date: new Date().toISOString().split('T')[0] });
  };

  // Handle delete expense
  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense(expenseId);
    setExpenses(expenses.filter((e) => e.id !== expenseId));
  };

  // if (!isAdmin) {
  //   return (
  //     <div className="container-tight py-12 text-center">
  //       <h1 className="text-4xl font-bold text-primary-red mb-4">Access Denied</h1>
  //       <p className="text-accent-gray-medium">You don&apos;t have admin access. Please log in as admin.</p>
  //     </div>
  //   );
  // }

  const pendingPlayers = players.filter((p) => p.status === 'pending');

  return (
    <div className="container-tight py-12">
      <h1 className="text-4xl font-bold text-primary-red mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
        <div className="card">
          <div className="text-accent-gray-medium text-sm">Pending Players</div>
          <div className="text-3xl font-bold text-primary-red mt-2">{stats.pendingPlayers}</div>
        </div>
        <div className="card">
          <div className="text-accent-gray-medium text-sm">Approved Players</div>
          <div className="text-3xl font-bold text-primary-red mt-2">{stats.approvedPlayers}</div>
        </div>
        <div className="card">
          <div className="text-accent-gray-medium text-sm">Total Expenses</div>
          <div className="text-3xl font-bold text-primary-red mt-2">৳{stats.totalExpenses}</div>
        </div>
        <div className="card">
          <div className="text-accent-gray-medium text-sm">Total Collected</div>
          <div className="text-3xl font-bold text-green-400 mt-2">৳{stats.totalCollected}</div>
        </div>
        <div className="card">
          <div className="text-accent-gray-medium text-sm">Remaining</div>
          <div className={`text-3xl font-bold mt-2 ${stats.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ৳{stats.remaining}
          </div>
        </div>
      </div>

      {/* Pending Players Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary-red mb-6">Pending Players ({pendingPlayers.length})</h2>

        {pendingPlayers.length === 0 ? (
          <p className="text-accent-gray-medium">No pending players</p>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingPlayers.map((player) => (
                  <tr key={player.id}>
                    <td className="font-semibold">{player.name}</td>
                    <td>{player.category}</td>
                    <td>{player.phone || '-'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePlayer(player.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectPlayer(player.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payments Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-red">Player Payments</h2>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="btn btn-primary text-sm"
          >
            Record Payment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Status</th>
                <th>Last Payment</th>
                <th>Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {players
                .filter((p) => p.status === 'approved')
                .map((player) => {
                  const lastPayment = player.payments[player.payments.length - 1];
                  const totalPaid = player.payments.reduce((sum, p) => sum + p.amount, 0);

                  return (
                    <tr key={player.id}>
                      <td className="font-semibold">{player.name}</td>
                      <td>
                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">
                          Approved
                        </span>
                      </td>
                      <td>{lastPayment?.date || '-'}</td>
                      <td>৳{totalPaid}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary-red">Expenses</h2>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="btn btn-primary text-sm"
          >
            Add Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.description}</td>
                  <td className="font-semibold">৳{expense.amount}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlayer(null);
        }}
        title="Record Player Payment"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Select Player</label>
            <select
              className="input w-full"
              value={selectedPlayer?.id || ''}
              onChange={(e) => {
                const player = players.find((p) => p.id === e.target.value);
                setSelectedPlayer(player || null);
              }}
            >
              <option value="">Choose a player</option>
              {players
                .filter((p) => p.status === 'approved')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Amount (৳)</label>
            <input
              type="number"
              className="input"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              className="input"
              value={paymentData.date}
              onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
            />
          </div>

          <button onClick={handleRecordPayment} className="btn btn-primary w-full">
            Record Payment
          </button>
        </div>
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Expense"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <input
              type="text"
              className="input"
              value={expenseData.description}
              onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
              placeholder="e.g., Court booking"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Amount (৳)</label>
            <input
              type="number"
              className="input"
              value={expenseData.amount}
              onChange={(e) => setExpenseData({ ...expenseData, amount: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              className="input"
              value={expenseData.date}
              onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
            />
          </div>

          <button onClick={handleAddExpense} className="btn btn-primary w-full">
            Add Expense
          </button>
        </div>
      </Modal>
    </div>
  );
}
