'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalCompleted: number;
  totalPending: number;
  tasksPerProject: { name: string; taskCount: number }[];
  dailyCompletion: { date: string; count: number }[];
}

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const pieChartData = [
    { name: 'Selesai', value: data.totalCompleted },
    { name: 'Belum Selesai', value: data.totalPending },
  ];

  const COLORS = ['#10B981', '#F43F5E'];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-500">Total Tugas</h2>
          <p className="text-4xl font-bold text-gray-800">{data.totalCompleted + data.totalPending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-green-500">Tugas Selesai</h2>
          <p className="text-4xl font-bold text-green-600">{data.totalCompleted}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-red-500">Tugas Belum Selesai</h2>
          <p className="text-4xl font-bold text-red-600">{data.totalPending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Tugas per Proyek</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.tasksPerProject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="taskCount" name="Jumlah Tugas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Status Tugas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}