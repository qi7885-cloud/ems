import { useNavigate } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm border border-line bg-panel">
        <SearchX className="h-6 w-6 text-ink-3" />
      </div>
      <div className="font-mono text-[11px] uppercase tracking-widest text-ink-3">Error 404</div>
      <h1 className="mt-2 text-[17px] font-semibold text-ink">页面不存在</h1>
      <p className="mt-1 text-[12px] text-ink-3">你访问的地址无效，或该功能已调整。</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary mt-5">
        <Home className="h-4 w-4" />
        返回综合看板
      </button>
    </div>
  );
}
