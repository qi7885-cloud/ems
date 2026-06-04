import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard,
  Activity,
  Bell,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Droplets,
  Thermometer,
  FileText,
  Clock,
  Database,
  AlertTriangle,
  Phone,
  Network,
  Gauge,
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: '综合看板', icon: LayoutDashboard },
  {
    label: '实时监控',
    icon: Activity,
    children: [
      { path: '/real-time/power-distribution', label: '配电监测', icon: Zap },
      { path: '/real-time/transformer', label: '变压器监测', icon: Thermometer },
      { path: '/real-time/classified', label: '分类能耗监测', icon: Droplets },
      { path: '/real-time/query', label: '监测参数查询', icon: Database },
      { path: '/real-time/offline', label: '离线事件', icon: Clock },
    ],
  },
  {
    label: '告警管理',
    icon: Bell,
    children: [
      { path: '/alarm/equipment-fault', label: '设备故障', icon: AlertTriangle },
      { path: '/alarm/energy-warning', label: '用能预警', icon: Activity },
      { path: '/alarm/classification', label: '报警分级', icon: BarChart3 },
      { path: '/alarm/analysis', label: '报警分析', icon: TrendingUp },
      { path: '/alarm/sms-log', label: '短信日志', icon: Phone },
    ],
  },
  {
    label: '能耗统计',
    icon: FileText,
    children: [
      { path: '/statistics/meter-reading', label: '集抄报表', icon: FileText },
      { path: '/statistics/operation', label: '运行报表', icon: Activity },
      { path: '/statistics/time-segment', label: '分时段报表', icon: Clock },
      { path: '/statistics/supplement', label: '能耗数据补录', icon: Database },
      { path: '/statistics/electric-fee', label: '电度电费', icon: Zap },
      { path: '/statistics/power-factor', label: '力调电费', icon: Gauge },
      { path: '/statistics/water-fee', label: '综合水费', icon: Droplets },
    ],
  },
  {
    label: '能耗分析',
    icon: TrendingUp,
    children: [
      { path: '/analysis/flow', label: '能源流向图', icon: Activity },
      { path: '/analysis/status', label: '能耗状态分析', icon: BarChart3 },
      { path: '/analysis/yoy', label: '能耗同比分析', icon: TrendingUp },
      { path: '/analysis/mom', label: '能耗环比分析', icon: TrendingUp },
      { path: '/analysis/max-demand', label: '最大需量分析', icon: Gauge },
      { path: '/analysis/loss', label: '损耗分析', icon: Activity },
    ],
  },
  {
    label: '系统管理',
    icon: Settings,
    children: [
      { path: '/system/price', label: '用能价格管理', icon: BarChart3 },
      { path: '/system/equipment', label: '设备管理', icon: Settings },
      { path: '/system/communication', label: '通讯状态图', icon: Network },
      { path: '/system/meter-status', label: '仪表通讯状态', icon: Gauge },
      { path: '/system/gateway-status', label: '网关通讯状态', icon: Network },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: { path: string; label: string; icon: typeof LayoutDashboard }) => (
    <button
      key={item.path}
      onClick={() => navigate(item.path)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive(item.path)
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <item.icon className="w-5 h-5" />
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
    </button>
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">EMS系统</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
        {menuItems.map((item) => {
          if ('children' in item) {
            const isExpanded = expandedMenu === item.label;
            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.children.some((child) => isActive(child.path))
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  )}
                </button>
                {isExpanded && !collapsed && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.children.map(renderMenuItem)}
                  </div>
                )}
                {isExpanded && collapsed && (
                  <div className="absolute left-20 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => {
                          navigate(child.path);
                          setExpandedMenu(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                          isActive(child.path)
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return renderMenuItem(item);
        })}

        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">退出登录</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}
