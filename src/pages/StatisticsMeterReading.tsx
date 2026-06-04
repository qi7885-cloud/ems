import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

export default function StatisticsMeterReading() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');

  const meterData = [
    { id: 1, equipment: '主配电柜', reading: 125000, unit: 'kWh', date: '2024-06-07' },
    { id: 2, equipment: '变压器A', reading: 68000, unit: 'kWh', date: '2024-06-07' },
    { id: 3, equipment: '变压器B', reading: 57000, unit: 'kWh', date: '2024-06-07' },
    { id: 4, equipment: '水表-1号', reading: 8500, unit: '吨', date: '2024-06-07' },
  ];

  const dailyData = [
    { date: '06-01', power: 110000, water: 8200 },
    { date: '06-02', power: 115000, water: 8300 },
    { date: '06-03', power: 120000, water: 8400 },
    { date: '06-04', power: 118000, water: 8250 },
    { date: '06-05', power: 122000, water: 8450 },
    { date: '06-06', power: 123000, water: 8480 },
    { date: '06-07', power: 125000, water: 8500 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">集抄报表</h1>
          <p className="text-gray-500 mt-1">查看各仪表的抄表数据</p>
        </div>
        <div className="flex items-center gap-4">
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
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="w-5 h-5" />
            导出报表
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">今日抄表数据</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {meterData.map((item) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">{item.equipment}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-gray-900">{item.reading.toLocaleString()}</span>
                <span className="text-sm text-gray-600">{item.unit}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">本月用电量趋势</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {dailyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(day.power / 130000) * 240}px` }}
                />
                <span className="text-xs text-gray-500 mt-2">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">本月用水量趋势</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {dailyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-cyan-500 rounded-t"
                  style={{ height: `${(day.water / 9000) * 240}px` }}
                />
                <span className="text-xs text-gray-500 mt-2">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">抄表明细</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">设备名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">抄表日期</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">数值</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">单位</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(12)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">主配电柜</td>
                <td className="px-6 py-4 text-gray-600">2024-06-{String(i + 1).padStart(2, '0')}</td>
                <td className="px-6 py-4 text-gray-600">{(110000 + i * 1500).toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">kWh</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    已抄录
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
