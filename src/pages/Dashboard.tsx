import { useStore } from '../store/useStore';
import { mockAlarms, powerChartData, dailyStats, categoryEnergyData } from '../data/mockData';
import {
  Zap,
  Droplets,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const energyStats = useStore((state) => state.energyStats);
  const pendingAlarms = mockAlarms.filter((a) => a.status === 'pending');

  const barChartData = {
    labels: dailyStats.map((d) => d.date),
    datasets: [
      {
        label: '用电量 (kWh)',
        data: dailyStats.map((d) => d.power / 1000),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
      },
      {
        label: '用水量 (吨)',
        data: dailyStats.map((d) => d.water),
        backgroundColor: 'rgba(6, 182, 212, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: categoryEnergyData.map((c) => c.category),
    datasets: [
      {
        data: categoryEnergyData.map((c) => c.percentage),
        backgroundColor: [
          '#3b82f6',
          '#06b6d4',
          '#22c55e',
          '#eab308',
          '#a855f7',
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
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
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const barChartOptions = {
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

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    cutout: '65%',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">综合看板</h1>
          <p className="text-gray-500 mt-1">实时监控能源消耗状态</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
          <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-700">实时更新中</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">今日用电量</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {(energyStats.total_power / 1000).toFixed(1)}
                <span className="text-lg font-normal text-gray-500"> MWh</span>
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+5.2% 较昨日</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">今日用水量</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {energyStats.total_water}
                <span className="text-lg font-normal text-gray-500"> 吨</span>
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+2.1% 较昨日</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">电费支出</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ¥{energyStats.power_cost.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">+3.8% 较昨日</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">待处理告警</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {pendingAlarms.length}
                <span className="text-lg font-normal text-gray-500"> 条</span>
              </p>
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600">需及时处理</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">24小时用电趋势</h2>
          <div className="h-64">
            <Line data={powerChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">分类能耗占比</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full max-w-xs">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">近7日能耗对比</h2>
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最新告警</h2>
          <div className="space-y-3">
            {pendingAlarms.slice(0, 3).map((alarm) => (
              <div
                key={alarm.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alarm.level === '严重'
                    ? 'bg-red-50 border-red-500'
                    : alarm.level === '一般'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    alarm.level === '严重'
                      ? 'bg-red-100 text-red-700'
                      : alarm.level === '一般'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {alarm.level}
                  </span>
                  <span className="text-xs text-gray-500">{alarm.created_at}</span>
                </div>
                <p className="text-sm text-gray-800 mt-2">{alarm.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
