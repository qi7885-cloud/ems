import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronsLeft, ChevronsRight, Cpu, Zap } from 'lucide-react';
import { menuItems } from '../config/navigation';

interface SidebarProps {
  /** 移动端抽屉是否展开 */
  open: boolean;
  /** 桌面端是否收起为窄栏 */
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** 选中菜单后回调，用于在移动端自动关闭抽屉 */
  onNavigate: () => void;
}

export default function Sidebar({ open, collapsed, onToggleCollapse, onNavigate }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const equipments = useStore((s) => s.equipments);
  const alarms = useStore((s) => s.alarms);

  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const isActive = (path: string) => currentPath === path.replace(/\/+$/, '');

  // 进入页面时自动展开所在分组，避免「人在页面里但菜单是收起的」
  useEffect(() => {
    const hit = menuItems.find(
      (item) => 'children' in item && item.children.some((c) => currentPath === c.path),
    );
    if (hit && 'children' in hit) setExpandedMenu(hit.label);
  }, [currentPath]);

  const go = (path: string) => {
    navigate(path);
    onNavigate();
  };

  const onlineCount = equipments.filter((e) => e.status === 'active').length;
  const pendingCount = alarms.filter((a) => a.status === 'pending').length;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-line bg-inset transition-transform duration-200 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${collapsed ? 'w-56 lg:w-14' : 'w-56'}`}
    >
      {/* 品牌区 */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-accent/50 bg-accent/10">
          <Zap className="h-4 w-4 text-accent" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1 leading-none">
            <div className="truncate text-[13px] font-semibold tracking-tight text-ink">EMS 能源管理</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-3">
              Control Console
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            title="收起导航"
            aria-label="收起导航"
            className="hidden h-6 w-6 items-center justify-center rounded-sm text-ink-3 transition-colors hover:bg-hover hover:text-ink lg:flex"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 展开按钮（收起态） */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          title="展开导航"
          aria-label="展开导航"
          className="mx-auto mt-2 hidden h-6 w-6 items-center justify-center rounded-sm text-ink-3 transition-colors hover:bg-hover hover:text-ink lg:flex"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      )}

      {/* 菜单 */}
      <nav className="scrollbar-thin flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {menuItems.map((item) => {
          if ('children' in item) {
            const isExpanded = expandedMenu === item.label;
            const hasActiveChild = item.children.some((c) => isActive(c.path));

            if (collapsed) {
              // 收起态：只显示分组图标，悬停浮出子菜单
              return (
                <div key={item.label} className="group relative">
                  <button
                    onClick={() => go(item.children[0].path)}
                    title={item.label}
                    className={`flex h-9 w-full items-center justify-center rounded-sm transition-colors ${
                      hasActiveChild ? 'bg-accent/10 text-accent' : 'text-ink-3 hover:bg-hover hover:text-ink'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                  </button>
                  <div className="pointer-events-none absolute left-full top-0 z-50 ml-1 hidden min-w-[168px] group-hover:block">
                    <div className="pointer-events-auto rounded border border-line bg-panel py-1 shadow-pop">
                      <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-ink-3">
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => go(child.path)}
                          className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors ${
                            isActive(child.path)
                              ? 'bg-accent/10 text-accent'
                              : 'text-ink-2 hover:bg-hover hover:text-ink'
                          }`}
                        >
                          <child.icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="whitespace-nowrap">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                  className={`flex h-8 w-full items-center gap-2.5 rounded-sm px-2.5 transition-colors ${
                    hasActiveChild ? 'text-accent' : 'text-ink-2 hover:bg-hover hover:text-ink'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left text-[13px] font-medium">{item.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${
                      isExpanded ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="relative mt-0.5 space-y-0.5 pl-3">
                    {/* 分组竖向引导线 */}
                    <span className="absolute bottom-1 left-[15px] top-1 w-px bg-line" aria-hidden="true" />
                    {item.children.map((child) => {
                      const active = isActive(child.path);
                      return (
                        <button
                          key={child.path}
                          onClick={() => go(child.path)}
                          className={`relative flex h-8 w-full items-center gap-2.5 rounded-sm pl-3 pr-2.5 text-left transition-colors ${
                            active ? 'bg-accent/10 text-accent' : 'text-ink-2 hover:bg-hover hover:text-ink'
                          }`}
                        >
                          {active && (
                            <span
                              className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent"
                              aria-hidden="true"
                            />
                          )}
                          <child.icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate text-[13px]">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = isActive(item.path);
          if (collapsed) {
            return (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                title={item.label}
                className={`flex h-9 w-full items-center justify-center rounded-sm transition-colors ${
                  active ? 'bg-accent/10 text-accent' : 'text-ink-3 hover:bg-hover hover:text-ink'
                }`}
              >
                <item.icon className="h-4 w-4" />
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              className={`relative flex h-8 w-full items-center gap-2.5 rounded-sm px-2.5 transition-colors ${
                active ? 'bg-accent/10 text-accent' : 'text-ink-2 hover:bg-hover hover:text-ink'
              }`}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent"
                  aria-hidden="true"
                />
              )}
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="text-[13px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 底部：系统实时状态 */}
      <div className="shrink-0 border-t border-line p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span className={`status-dot ${pendingCount > 0 ? 'status-danger animate-led' : 'status-online'}`} />
            <Cpu className="h-4 w-4 text-ink-3" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-2 text-ink-3">
                <span className="status-dot status-online animate-pulse-soft" />
                在线设备
              </span>
              <span className="font-mono font-medium text-ink">
                {onlineCount}
                <span className="text-ink-3">/{equipments.length}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-2 text-ink-3">
                <span className={`status-dot ${pendingCount > 0 ? 'status-danger animate-led' : 'status-online'}`} />
                待处理告警
              </span>
              <span className={`font-mono font-medium ${pendingCount > 0 ? 'text-danger' : 'text-ink'}`}>
                {pendingCount}
              </span>
            </div>
            <div className="border-t border-line pt-2 font-mono text-[10px] uppercase tracking-widest text-ink-3">
              v1.0.0 · Build 2026.10
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
