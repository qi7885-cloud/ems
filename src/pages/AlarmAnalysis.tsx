import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, Calendar, Filter } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AlarmAnalysis() {
  const [timeRange, setTimeRange] = useState('week');

  const chartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '严重',
        data: [5, 3, 7, 4, 6, 2, 4],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6,
      },
      {
        label: '一般',
        data: [12, 15, 10, 18, 14, 8, 11],
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderRadius: 6,
      },
      {
        label: '轻微',
        data: [25, 30, 28, 22, 35, 18, 24],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const statistics = [
    { label: '本月告警总数', value: 386, change: '+12%', trend: 'up' },
    { label: '处理完成率', value: '94%', change: '+3%', trend: 'up' },
    { label: '平均响应时间', value: '28分钟', change: '-15%', trend: 'down' },
    { label: '重复告警率', value: '8%', change: '+2%', trend: 'up' },
  ];

  const topDevices = [
    { name: '变压器A', count: 45, type: '温度过高' },
    { name: '主配电柜', count: 38, type: '电流波动' },
    { name: '水表-1号', count: 28, type: '流量异常' },
    { name: '变压器B', count: 22, type: '负载偏高' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报警分析</h1>
          <p className="text-gray-500 mt-1">分析报警趋势和统计数据</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <span className={`inline-flex items-center text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">告警趋势分析</h2>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">告警设备排行</h2>
          <div className="space-y-4">
            {topDevices.map((device, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-red-500' :
                  index === 1 ? 'bg-yellow-500' :
                  index === 2 ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{device.name}</p>
                  <p className="text-sm text-gray-500">{device.type}</p>
                </div>
                <span className="text-lg font-bold text-gray-900">{device.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">告警类型分布</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { type: '设备故障', count: 125, percentage: 32 },
            { type: '参数越限', count: 98, percentage: 25 },
            { type: '通讯异常', count: 72, percentage: 19 },
            { type: '用能预警', count: 56, percentage: 14 },
            { type: '维护提醒', count: 25, percentage: 6 },
            { type: '其他', count: 10, percentage: 4 },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-sm text-gray-600 mt-1">{item.type}</p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
