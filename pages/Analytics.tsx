import React, { useMemo } from 'react';
import { MOCK_TRANSACTIONS } from '../../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend, YAxis } from 'recharts';
import { TrendingUp, AlertCircle, ShoppingBag, Coffee, Wifi, Car } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics: React.FC = () => {
  
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    MOCK_TRANSACTIONS.filter(t => t.type === 'payment' || t.type === 'bill_payment').forEach(tx => {
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
    });
    return Object.keys(categories).map(key => ({ name: key, value: categories[key] }));
  }, []);

  const monthlySpending = useMemo(() => {
    // Mocking monthly data as mock data is limited to recent days
    return [
        { name: 'Jan', amount: 45000 },
        { name: 'Feb', amount: 32000 },
        { name: 'Mar', amount: 55000 },
        { name: 'Apr', amount: 28000 },
        { name: 'May', amount: MOCK_TRANSACTIONS.reduce((acc, t) => t.type === 'payment' ? acc + t.amount : acc, 0) + 12000 },
    ];
  }, []);

  const totalSpent = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Financial Overview</h2>
        <p className="text-indigo-200 text-sm">Real-time AI Spending Analysis</p>
        
        <div className="mt-6 flex items-end gap-2">
             <h1 className="text-4xl font-bold">Rs. {totalSpent.toLocaleString()}</h1>
             <span className="mb-2 text-sm text-indigo-200">spent this month</span>
        </div>
      </div>

      {/* Spending Breakdown Pie */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-indigo-500" />
            Spending by Category
        </h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Rs. ${value}`} />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Trend Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            Monthly Spending Trend
        </h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpending}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} formatter={(value: number) => `Rs. ${value}`} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* AI Smart Insight Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
        <div className="flex items-start gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
                <AlertCircle size={24} className="text-indigo-600" />
            </div>
            <div>
                <h4 className="font-bold text-indigo-900 text-sm">VasPay AI Observation</h4>
                <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                    Based on your spending, you have increased your <strong>Dining Out</strong> expenses by 15% compared to last week. Consider setting a budget of Rs. 5000 for food next month to save more.
                </p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
