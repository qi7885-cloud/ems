import {
  LayoutDashboard,
  Activity,
  Bell,
  BarChart3,
  TrendingUp,
  Settings,
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
import type { LucideIcon } from 'lucide-react';

export interface NavChild {
  path: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  children: NavChild[];
}

export interface NavLink {
  path: string;
  label: string;
  icon: LucideIcon;
}

/**
 * 导航树：侧边栏与顶栏面包屑共用同一份定义，
 * 避免两处菜单各自维护导致不一致。
 */
export const menuItems: (NavGroup | NavLink)[] = [
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
      { path: '/system/meter-status', label: '仪表通讯状态', icon: Gauge },
      { path: '/system/gateway-status', label: '网关通讯状态', icon: Network },
    ],
  },
];

/** 由路径反查所属分组与菜单名，供顶栏面包屑使用 */
export function resolveBreadcrumb(pathname: string): { group?: string; title: string } {
  const current = pathname.replace(/\/+$/, '') || '/';
  for (const item of menuItems) {
    if ('children' in item) {
      const hit = item.children.find((c) => c.path === current);
      if (hit) return { group: item.label, title: hit.label };
    } else if (item.path === current) {
      return { title: item.label };
    }
  }
  return { title: '未知页面' };
}
