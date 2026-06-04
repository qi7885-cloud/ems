import { useState } from 'react';
import { Search, Calendar, Filter, Download, RefreshCw } from 'lucide-react';

export default function ParameterQuery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2024-06-01');
  const [endDate, setEndDate] = useState('2024-06-07');
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  const mockParameters = [
    { id: 1, equipment: '主配电柜', parameter: '电流', value: '450 A', unit: 'A', time: '2024-06-07 14:30' },
    { id: 2, equipment: '主配电柜', parameter: '电压', value: '10.5', unit: 'kV', time: '2024-06-07 14:30' },
    { id: 3, equipment: '变压器A', parameter: '温度', value: '65', unit: '°C', time: '2024-06-07 14:28' },
    { id: 4, equipment: '变压器A', parameter: '负载率', value: '78', unit: '%', time: '2024-06-07 14:28' },
    { id: 5, equipment: '变压器B', parameter: '温度', value: '58', unit: '°C', time: '2024-06-07 14:25' },
    { id: 6, equipment: '变压器B', parameter: '负载率', value: '62', unit: '%', time: '2024-06-07 14:25' },
    { id: 7, equipment: '水表-1号', parameter: '流量', value: '450', unit: '吨', time: '2024-06-07 14:30' },
    { id: 8, equipment: '水表-1号', parameter: '累计', value: '8500', unit: '吨', time: '2024-06-07 14:30' },
  ];

  const filteredParameters = mockParameters.filter((param) =>
    param.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.parameter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">监测参数查询</h1>
        <p className="text-gray-500 mt-1">查询历史监测数据和参数信息</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">设备选择</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部设备</option>
              <option value="主配电柜">主配电柜</option>
              <option value="变压器A">变压器A</option>
              <option value="变压器B">变压器B</option>
              <option value="水表-1号">水表-1号</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button className="flex-1 px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
              查询
            </button>
            <button className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="刷新">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索设备或参数..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              筛选
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
              <Download className="w-5 h-5" />
              导出
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">设备名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">参数名称</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">数值</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">单位</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">采集时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredParameters.map((param) => (
              <tr key={param.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{param.equipment}</td>
                <td className="px-6 py-4 text-gray-600">{param.parameter}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {param.value}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{param.unit}</td>
                <td className="px-6 py-4 text-gray-600">{param.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
