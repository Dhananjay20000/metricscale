import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  // Auth States
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [tenant, setTenant] = useState(localStorage.getItem('tenantId') || '');
  
  // Input Forms States
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regTenant, setRegTenant] = useState('tenant-company-abc');

  // Business Data States
  const [transactions, setTransactions] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Live Render Production URL Destination Core
  const API_BASE_URL = 'https://metricscale-backend.onrender.com';

  // Fetch transactions using the secure token
  const fetchTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
        headers: { 
          'X-Tenant-ID': tenant,
          'Authorization': `Bearer ${token}`
        }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, tenant]);

  // Handle Login authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username: loginUser,
        password: loginPass
      });
      const data = response.data;
      setToken(data.token);
      setUsername(data.username);
      setTenant(data.tenantId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('tenantId', data.tenantId);
    } catch (err) {
      setErrorMsg('Invalid login credentials.');
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: regUser,
        password: regPass,
        tenantId: regTenant
      });
      alert('Registration successful! Please sign in.');
      setRegUser('');
      setRegPass('');
    } catch (err) {
      setErrorMsg('Registration failed or user already exists.');
    }
  };

  // Logout clean up
  const handleLogout = () => {
    setToken('');
    setUsername('');
    setTenant('');
    setTransactions([]);
    localStorage.clear();
  };

  // Handle adding a new transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!customerName || !amount) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/transactions/sample?customerName=${customerName}&amount=${amount}`,
        {},
        { 
          headers: { 
            'X-Tenant-ID': tenant,
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      setCustomerName('');
      setAmount('');
      fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  // Metrics summary calculations
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCount = transactions.length;

  // Render Login Screen if not authenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-6 font-sans">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          MetricScale Portal
        </h1>
        <p className="text-gray-400 text-sm mb-8">Secure Multi-Tenant Gatekeeper</p>

        {errorMsg && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl mb-6 text-sm max-w-sm w-full text-center">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Sign In Card */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Username</label>
                <input type="text" value={loginUser} onChange={e => setLoginUser(e.target.value)} className="w-full bg-gray-900 px-4 py-2 rounded-xl border border-gray-700 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Password</label>
                <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} className="w-full bg-gray-900 px-4 py-2 rounded-xl border border-gray-700 text-sm focus:outline-none" required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold text-sm py-2.5 rounded-xl transition mt-4">Authenticate</button>
            </form>
          </div>

          {/* Provision New Account Card */}
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Register Tenant Account</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Username</label>
                <input type="text" value={regUser} onChange={e => setRegUser(e.target.value)} className="w-full bg-gray-900 px-4 py-2 rounded-xl border border-gray-700 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Password</label>
                <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} className="w-full bg-gray-900 px-4 py-2 rounded-xl border border-gray-700 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Select Corporate Identity</label>
                <select value={regTenant} onChange={e => setRegTenant(e.target.value)} className="w-full bg-gray-900 px-4 py-2 rounded-xl border border-gray-700 text-sm text-blue-400 font-bold focus:outline-none">
                  <option value="tenant-company-abc">Company ABC</option>
                  <option value="tenant-company-xyz">Company XYZ</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-sm py-2.5 rounded-xl transition mt-4">Provision Member</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render Authenticated Dashboard
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            MetricScale Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Logged in as: <span className="text-indigo-400 font-bold">{username}</span> ({tenant})
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-4 py-2 rounded-xl transition"
        >
          Sign Out Security Token
        </button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700/60 shadow-md">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Total Volume</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700/60 shadow-md">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Tx Count</p>
              <h3 className="text-2xl font-black text-indigo-400 mt-2">{totalCount}</h3>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/60 shadow-md">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Add New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Customer Name</label>
                <input type="text" placeholder="e.g. John Doe" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-700 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Amount ($)</label>
                <input type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-700 text-sm" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 transition font-bold text-sm py-2.5 rounded-xl text-white mt-2">
                Insert Isolated Record
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700/60 shadow-md h-72">
            <h2 className="text-lg font-bold mb-4 text-gray-300">Transaction Value Stream</h2>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="customerName" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#f3f4f6' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700/60 shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-lg font-bold text-gray-300">Active Tenant Ledger</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500 text-sm">Syncing tenant logs...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No transaction records logged under this secure profile context.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">System Status</th>
                      <th className="px-6 py-3.5 text-right">Tenant Scope Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-700/30 transition">
                        <td className="px-6 py-4 font-medium text-gray-200">{tx.customerName}</td>
                        <td className="px-6 py-4 text-emerald-400 font-semibold">${tx.amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-xs text-blue-400/80">{tx.tenantId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}