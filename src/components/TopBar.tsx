import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../hooks/useTheme';
import { resolveBreadcrumb } from '../config/navigation';

/** 控制台时钟：每秒刷新，工业上位机的时间指示 */
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()],
  };
}

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const clock = useClock();

  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const alarms = useStore((s) => s.alarms);

  const pendingCount = useMemo(() => alarms.filter((a) => a.status === 'pending').length, [alarms]);
  const crumb = resolveBreadcrumb(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line bg-panel px-3">
      {/* 左：菜单开关 + 面包屑 */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title="展开 / 收起导航"
          aria-label="展开或收起导航"
          className="btn-ghost h-7 w-7 !px-0 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav className="flex min-w-0 items-center gap-2 text-[13px]" aria-label="面包屑">
          <span className="hidden shrink-0 text-ink-3 sm:inline">EMS</span>
          {crumb.group && (
            <>
              <span className="hidden text-line-strong sm:inline">/</span>
              <span className="hidden shrink-0 text-ink-3 sm:inline">{crumb.group}</span>
            </>
          )}
          <span className="text-line-strong">/</span>
          <span className="truncate font-medium text-ink">{crumb.title}</span>
        </nav>
      </div>

      {/* 右：采集状态 / 时钟 / 告警 / 主题 / 用户 */}
      <div className="flex shrink-0 items-center gap-1">
        <div className="mr-1 hidden items-center gap-2 border-r border-line pr-3 xl:flex">
          <span className="status-dot status-online animate-pulse-soft" />
          <span className="text-[12px] text-ink-2">采集正常</span>
        </div>

        <div className="mr-1 hidden items-center gap-2 border-r border-line pr-3 font-mono text-[12px] md:flex">
          <span className="text-ink">{clock.time}</span>
          <span className="text-ink-3">
            {clock.date} {clock.weekday}
          </span>
        </div>

        <button
          onClick={() => navigate('/alarm/equipment-fault')}
          title={`待处理告警 ${pendingCount} 条`}
          aria-label={`待处理告警 ${pendingCount} 条`}
          className="btn-ghost relative h-7 w-7 !px-0"
        >
          <Bell className="h-4 w-4" />
          {pendingCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 font-mono text-[10px] font-bold leading-none text-canvas">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={toggleTheme}
          title={isDark ? '切换到浅色模式' : '切换到深色模式'}
          aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
          className="btn-ghost h-7 w-7 !px-0"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="ml-1 flex items-center gap-2 border-l border-line pl-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm border border-accent/40 bg-accent/10">
              <User className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="leading-none">
              <div className="text-[12px] font-medium text-ink">{user?.username ?? '未登录'}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-3">
                {user?.role === 'admin' ? '系统管理员' : '值班操作员'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="退出登录"
            aria-label="退出登录"
            className="btn-ghost h-7 w-7 !px-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
