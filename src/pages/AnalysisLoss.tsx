import { useState } from 'react';
import { TrendingDown, AlertTriangle, CheckCircle, Activity, Calendar } from 'lucide-react';

export default function AnalysisLoss() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');

  const lossData = [
    { category: '线损', rate: 5.2, target: 5.0, status: 'warning', value: 195000 },
    { category: '变损', rate: 2.8, target: 3.0, status: 'normal', value: 105000 },
    { category: '表损', rate: 0.5, target: 0.8, status: 'normal', value: 18750 },
    { category: '不明损耗', rate: 1.2, target: 1.0, status: 'warning', value: 45000 },
  ];

  const statusConfig = {
    normal: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: '正常' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100', text: '超限' },
    error: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', text: '异常' },
  };

  const monthlyLoss = [
    { month: '1月', loss: 7.8, target: 7.5 },
    { month: '2月', loss: 7.5, target: 7.5 },
    { month: '3月', loss: 7.3, target: 7.5 },
    { month: '4月', loss: 7.6, target: 7.5 },
    { month: '5月', loss: 7.9, target: 7.5 },
    { month: '6月', loss: 9.7, target: 7.5 },
  ];

  const lossDetail = [
    { equipment: '主配电柜A', type: '线损', rate: 3.2, status: 'normal' },
    { equipment: '主配电柜B', type: '线损', rate: 2.8, status: 'normal' },
    { equipment: '变压器1#', type: '变损', rate: 2.5, status: 'normal' },
    { equipment: '变压器2#', type: '变损', rate: 3.1, status: 'warning' },
    { equipment: '计量表-01', type: '表损', rate: 0.3, status: 'normal' },
    { equipment: '计量表-02', type: '表损', rate: 0.6, status: 'normal' },
    { equipment: '线路-北区', type: '线损', rate: 5.8, status: 'warning' },
    { equipment: '线路-南区', type: '线损', rate: 4.8, status: 'normal' },
  ];

  const totalLoss = lossData.reduce((sum, item) => sum + item.value, 0);
  const totalRate = lossData.reduce((sum, item) => sum + item.rate, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">损耗分析</h1>
          <p className="text-gray-500 mt-1">分析各类能源损耗情况，定位损耗异常</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-06">2024年6月</option>
            <option value="2024-05">2024年5月</option>
            <option value="2024-04">2024年4月</option>
            <option value="2024-03">2024年3月</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lossData.map((item, index) => {
          const config = statusConfig[item.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{item.category}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{item.rate}</span>
                <span className="text-gray-500">%</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                损耗量: {(item.value / 1000).toFixed(1)} kWh
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>目标: {item.target}%</span>
                  <span>{item.rate > item.target ? '超' : '低'}于目标</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.rate <= item.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(item.rate / (item.target * 1.5)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">月度损耗率趋势</h2>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            totalRate > 7.5 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <TrendingDown className="w-5 h-5" />
            <span className="font-bold">总损耗率 {totalRate.toFixed(1)}%</span>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-4">
          {monthlyLoss.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1">
                <div
                  className={`flex-1 rounded-t ${item.loss > item.target ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ height: `${(item.loss / 12) * 200}px` }}
                />
                <div
                  className="flex-1 bg-gray-300 rounded-t border-t-2 border-dashed border-gray-400"
                  style={{ height: `${(item.target / 12) * 200}px` }}
                />
              </div>
              {item.loss > item.target && (
                <span className="mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">超限</span>
              )}
              <span className="text-xs text-gray-500 mt-1">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-xs text-gray-600">实际损耗</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-300 rounded border-t-2 border-dashed border-gray-400" />
            <span className="text-xs text-gray-600">目标值</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">损耗明细</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">设备名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">损耗类型</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">损耗率</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lossDetail.map((item, index) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.equipment}</td>
                  <td className="px-6 py-4 text-gray-600">{item.type}</td>
                  <td className="px-6 py-4 text-gray-600">{item.rate}%</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">损耗分析建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">重点关注</h3>
            <p className="text-sm text-red-700">
              不明损耗率达1.2%，建议检查计量表计准确性及线路是否存在漏电情况。
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">待优化项</h3>
            <p className="text-sm text-yellow-700">
              变压器2#和北区线路损耗率偏高，建议安排专业人员进行检修维护。
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">正常项</h3>
            <p className="text-sm text-green-700">
              变损和表损控制良好，建议继续保持当前维护频率。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}