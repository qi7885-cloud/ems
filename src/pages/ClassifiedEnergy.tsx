import { categoryEnergyData } from '../data/mockData';
import { Droplets, Zap, Factory, Building2, Lightbulb } from 'lucide-react';

export default function ClassifiedEnergy() {
  const categoryIcons = {
    '造纸车间': Factory,
    '水处理车间': Droplets,
    '配电室': Zap,
    '办公楼': Building2,
    '其他': Lightbulb,
  };

  const categoryColors = {
    '造纸车间': 'bg-blue-500',
    '水处理车间': 'bg-cyan-500',
    '配电室': 'bg-green-500',
    '办公楼': 'bg-yellow-500',
    '其他': 'bg-purple-500',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">分类能耗监测</h1>
        <p className="text-gray-500 mt-1">按部门/区域/设备分类监测能耗数据</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {categoryEnergyData.map((item) => {
          const IconComponent = categoryIcons[item.category as keyof typeof categoryIcons] || Lightbulb;
          const colorClass = categoryColors[item.category as keyof typeof categoryColors] || 'bg-gray-500';
          
          return (
            <div
              key={item.category}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{item.percentage}%</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.category}</h3>
              <p className="text-gray-600">用电量: {item.power.toLocaleString()} kWh</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">占比</span>
                  <span className="font-medium text-gray-900">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorClass} rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">分类能耗明细</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">分类</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">用电量 (kWh)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">占比</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">单位能耗</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">同比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categoryEnergyData.map((item) => (
                <tr key={item.category} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${categoryColors[item.category as keyof typeof categoryColors]} rounded-lg flex items-center justify-center`}>
                        {(() => {
                          const Icon = categoryIcons[item.category as keyof typeof categoryIcons];
                          return Icon ? <Icon className="w-4 h-4 text-white" /> : null;
                        })()}
                      </div>
                      <span className="font-medium text-gray-900">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.power.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${categoryColors[item.category as keyof typeof categoryColors]} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">125 kWh/吨纸</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <Zap className="w-4 h-4" />
                      -3.2%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
