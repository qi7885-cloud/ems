import { Gauge, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function StatisticsPowerFactor() {
  const monthlyPowerFactor = [
    { month: '1月', factor: 0.92, adjustment: 500, status: 'good' },
    { month: '2月', factor: 0.88, adjustment: -1200, status: 'warning' },
    { month: '3月', factor: 0.95, adjustment: 800, status: 'good' },
    { month: '4月', factor: 0.91, adjustment: 300, status: 'good' },
    { month: '5月', factor: 0.85, adjustment: -2500, status: 'bad' },
    { month: '6月', factor: 0.93, adjustment: 600, status: 'good' },
  ];

  const statusConfig = {
    good: { color: 'text-green-600', bg: 'bg-green-100', indicator: 'bg-green-500' },
    warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', indicator: 'bg-yellow-500' },
    bad: { color: 'text-red-600', bg: 'bg-red-100', indicator: 'bg-red-500' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">力调电费</h1>
        <p className="text-gray-500 mt-1">功率因数调整电费分析</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Gauge className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">本月功率因数</p>
              <p className="text-2xl font-bold text-gray-900">0.93</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">调整电费</p>
              <p className="text-2xl font-bold text-green-700">+¥600</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">考核标准</p>
              <p className="text-2xl font-bold text-gray-900">0.90</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">累计调整</p>
              <p className="text-2xl font-bold text-gray-900">-¥1,500</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">功率因数趋势</h2>
        <div className="h-64 flex items-end justify-between gap-4">
          {monthlyPowerFactor.map((item, index) => {
            const config = statusConfig[item.status as keyof typeof statusConfig];
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className={`w-full ${config.indicator} rounded-t`} style={{ height: `${(item.factor / 1) * 240}px` }} />
                <span className={`mt-2 px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                  {item.factor}
                </span>
                <span className="text-xs text-gray-500 mt-1">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">力调电费明细</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">月份</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">功率因数</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">调整比例</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">调整电费</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyPowerFactor.map((item, index) => {
                const config = statusConfig[item.status as keyof typeof statusConfig];
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.month}</td>
                    <td className="px-6 py-4 text-gray-600">{item.factor}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.factor >= 0.90 ? (
                        <span className="text-green-600">-0.75%</span>
                      ) : item.factor >= 0.85 ? (
                        <span className="text-yellow-600">+2%</span>
                      ) : (
                        <span className="text-red-600">+5%</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={item.adjustment >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.adjustment >= 0 ? '+' : ''}¥{item.adjustment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        {item.status === 'good' ? '优秀' : item.status === 'warning' ? '一般' : '较差'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
