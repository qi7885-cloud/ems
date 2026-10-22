import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PageLoader from './PageLoader';

const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

export default function Layout() {
  // 移动端抽屉默认收起，避免首屏被遮罩挡住
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 桌面端是否收起为窄栏
  const [collapsed, setCollapsed] = useState(false);

  // 切到桌面尺寸时清掉移动端抽屉状态，避免残留的遮罩
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      if (mql.matches) setSidebarOpen(false);
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const closeDrawer = () => {
    if (!isDesktop()) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onNavigate={closeDrawer}
      />

      {/* 移动端遮罩：层级低于侧边栏（z-40），点击可关闭抽屉 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`flex min-h-screen flex-col transition-[margin] duration-200 ${
          collapsed ? 'lg:ml-14' : 'lg:ml-56'
        }`}
      >
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 p-3 lg:p-4">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>

        {/* 底部状态栏 */}
        <footer className="flex h-6 shrink-0 items-center justify-between border-t border-line bg-panel px-3 font-mono text-[10px] uppercase tracking-widest text-ink-3">
          <span className="truncate">EMS Console · 本地模拟数据源</span>
          <span className="hidden sm:inline">采集周期 5s · 通信链路正常</span>
        </footer>
      </div>
    </div>
  );
}
