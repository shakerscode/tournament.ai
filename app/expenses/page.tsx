// 'use client';

// import { getPlayers, getExpenses, getGuests, initializeDb, Player, Expense, Guest } from '@/lib/localDb';
// import { useEffect, useMemo, useState } from 'react';

// export default function ExpensesPage() {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [guests, setGuests] = useState<Guest[]>([]);

//   // Calculate totals
//   const totals = useMemo(() => {
//     const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
//     const totalCollected = players.reduce(
//       (sum, p) => sum + p.payments.reduce((psum, pay) => psum + pay.amount, 0),
//       0
//     );

//     return {
//       totalExpenses,
//       totalCollected,
//       remaining: totalCollected - totalExpenses,
//     };
//   }, [players, expenses]);

//   // Initialize data
//   useEffect(() => {
//     const init = async () => {
//       await initializeDb();
//       const [playersData, expensesData, guestsData] = await Promise.all([
//         getPlayers(),
//         getExpenses(),
//         getGuests(),
//       ]);
//       setPlayers(playersData);
//       setExpenses(expensesData);
//       setGuests(guestsData);
//     };
//     init();
//   }, []);

//   const approvedPlayers = players.filter((p) => p.status === 'approved');

//   return (
//     <div className="container-tight py-12">
//       <h1 className="text-4xl font-bold text-primary-red mb-8">Finance & Expenses</h1>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
//         <div className="card">
//           <h3 className="text-accent-gray-medium text-sm mb-2">Total Expenses</h3>
//           <p className="text-3xl font-bold text-primary-red">৳{totals.totalExpenses.toLocaleString()}</p>
//         </div>
//         <div className="card">
//           <h3 className="text-accent-gray-medium text-sm mb-2">Total Collected</h3>
//           <p className="text-3xl font-bold text-green-400">৳{totals.totalCollected.toLocaleString()}</p>
//         </div>
//         <div className="card">
//           <h3 className="text-accent-gray-medium text-sm mb-2">Balance</h3>
//           <p className={`text-3xl font-bold ${totals.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//             ৳{totals.remaining.toLocaleString()}
//           </p>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Side: Players & Guests Tables */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Players Section */}
//           <section>
//             <h2 className="text-2xl font-bold text-primary-red mb-6">Players</h2>

//             {approvedPlayers.length === 0 ? (
//               <div className="text-center p-8 bg-secondary-black-light rounded-lg">
//                 <p className="text-accent-gray-medium">No approved players yet</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Player Name</th>
//                       <th>Category</th>
//                       <th>Amount Paid</th>
//                       <th>Last Payment</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {approvedPlayers.map((player) => {
//                       const totalPaid = player.payments.reduce((sum, p) => sum + p.amount, 0);
//                       const lastPayment = player.payments[player.payments.length - 1];

//                       return (
//                         <tr key={player.id}>
//                           <td className="font-semibold">{player.name}</td>
//                           <td>{player.category}</td>
//                           <td className="font-bold text-green-400">৳{totalPaid.toLocaleString()}</td>
//                           <td className="text-accent-gray-medium">
//                             {lastPayment?.date || '-'}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>

//           {/* Guests Section */}
//           <section>
//             <h2 className="text-2xl font-bold text-primary-red mb-6">Guests</h2>

//             {guests.length === 0 ? (
//               <div className="text-center p-8 bg-secondary-black-light rounded-lg">
//                 <p className="text-accent-gray-medium">No guests added yet</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Guest Name</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {guests.map((guest) => (
//                       <tr key={guest.id}>
//                         <td>{guest.name}</td>
//                         <td className="text-accent-gray-medium text-sm">-</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>
//         </div>

//         {/* Right Side: Expenses List */}
//         <div>
//           <h2 className="text-2xl font-bold text-primary-red mb-6">Expenses</h2>

//           {expenses.length === 0 ? (
//             <div className="text-center p-8 bg-secondary-black-light rounded-lg">
//               <p className="text-accent-gray-medium">No expenses recorded yet</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {expenses
//                 .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//                 .map((expense) => (
//                   <div
//                     key={expense.id}
//                     className="p-4 bg-secondary-black-light rounded-lg hover:shadow-card-hover transition-shadow"
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-semibold text-accent-white">{expense.description}</h3>
//                       <span className="text-primary-red font-bold">৳{expense.amount.toLocaleString()}</span>
//                     </div>
//                     <p className="text-accent-gray-medium text-sm">{expense.date}</p>
//                   </div>
//                 ))}
//             </div>
//           )}

//           {/* Expense Summary */}
//           <div className="mt-8 p-4 bg-primary-red/10 border border-primary-red rounded-lg">
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-accent-gray-medium">Total Expenses:</span>
//                 <span className="font-bold text-primary-red">৳{totals.totalExpenses.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between border-t border-primary-red/20 pt-2 mt-2">
//                 <span className="text-accent-gray-medium">Balance:</span>
//                 <span className={`font-bold ${totals.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                   ৳{totals.remaining.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Info */}
//       <div className="mt-12 p-6 bg-secondary-black-light rounded-lg border border-secondary-black-lighter">
//         <h3 className="text-lg font-bold text-primary-red mb-3">Financial Summary</h3>
//         <div className="space-y-2 text-accent-gray-medium text-sm">
//           <p>✓ Track all player payments and contributions</p>
//           <p>✓ Monitor tournament expenses and costs</p>
//           <p>✓ Calculate remaining balance for next events</p>
//           <p>✓ Keep records of all financial transactions</p>
//         </div>
//       </div>
//     </div>
//   );
// }

function Page() {
  return <div>Hi</div>;
}

export default Page;
