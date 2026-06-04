import { AlertTriangle, AlertCircle, Info, Settings, Bell } from 'lucide-react';

export default function AlarmClassification() {
  const classifications = [
    {
      level: '严重',
      icon: AlertTriangle,
      color: 'red',
      description: '设备故障或严重异常，需立即处理',
      responseTime: '15分钟',
      count: 2,
      actions: ['立即通知负责人', '生成工单', '短信告警'],
    },
    {
      level: '一般',
      icon: AlertCircle,
      color: 'yellow',
      description: '性能异常或接近阈值，需关注',
      responseTime: '1小时',
      count: 5,
      actions: ['记录日志', '定时检查', '邮件通知'],
    },
    {
      level: '轻微',
      icon: Info,
      color: 'blue',
      description: '一般性提示或信息，定期处理',
      responseTime: '24小时',
      count: 12,
      actions: ['记录日志', '定期汇总', '周报上报'],
    },
  ];

  const colorClasses = {
    red: {
      bg: 'bg-red-500',
      bgLight: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-500',
    },
    yellow: {
      bg: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-500',
    },
    blue: {
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-500',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">报警分级</h1>
        <p className="text-gray-500 mt-1">管理报警等级配置和响应策略</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {classifications.map((item) => {
          const colors = colorClasses[item.color as keyof typeof colorClasses];
          const Icon = item.icon;
          
          return (
            <div
              key={item.level}
              className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{item.count}</span>
              </div>
              
              <h3 className={`text-xl font-semibold ${colors.text} mb-2`}>{item.level}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">响应时限</span>
                  <span className="font-medium text-gray-900">{item.responseTime}</span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">响应动作</p>
                  <div className="flex flex-wrap gap-2">
                    {item.actions.map((action, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 ${colors.bgLight} ${colors.text} rounded-full text-xs font-medium`}
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4" />
                编辑配置
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">分级策略说明</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="font-semibold text-red-700">严重告警</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>设备停机或严重故障</li>
              <li>参数超过安全阈值</li>
              <li>可能导致生产中断</li>
              <li>需要立即响应处理</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-yellow-700">一般告警</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>设备性能下降</li>
              <li>参数接近预警阈值</li>
              <li>可能影响生产效率</li>
              <li>需要及时关注处理</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-700">轻微告警</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>日常巡检提示</li>
              <li>周期性维护提醒</li>
              <li>性能优化建议</li>
              <li>定期汇总处理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
