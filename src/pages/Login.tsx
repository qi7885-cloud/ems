import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Database, LockKeyhole, Network, User, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

/** 登录页左侧的「系统自检」清单：工业上位机常见的开机状态面板 */
const selfCheck = [
  { label: '通信网关', value: '4 / 4 在线', icon: Network, ok: true },
  { label: '数据采集', value: '周期 5s 正常', icon: Database, ok: true },
  { label: '告警服务', value: '2 条待处理', icon: AlertTriangle, ok: false },
  { label: '实时计算', value: '负载 12%', icon: Activity, ok: true },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    const success = login(username.trim());
    if (success) {
      navigate('/dashboard');
    } else {
      setError('用户名不存在，请使用 admin 或 user');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas bg-grid p-4">
      <div className="grid w-full max-w-3xl overflow-hidden rounded border border-line bg-panel md:grid-cols-[1fr_1.1fr]">
        {/* 左：系统标识与自检状态 */}
        <div className="hidden flex-col justify-between border-r border-line bg-inset p-6 md:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-accent/50 bg-accent/10">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div className="leading-none">
                <div className="text-[14px] font-semibold tracking-tight text-ink">EMS 能源管理系统</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-3">
                  Energy Management Console
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {selfCheck.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-sm border border-line bg-panel px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-[12px] text-ink-2">
                    <item.icon className="h-3.5 w-3.5 text-ink-3" />
                    {item.label}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-ink-2">{item.value}</span>
                    <span className={`status-dot ${item.ok ? 'status-online' : 'status-warning'}`} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ink-3">
            v1.0.0 · build 2026.10 · 本地模拟数据源
          </div>
        </div>

        {/* 右：登录表单 */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-accent/50 bg-accent/10">
                <Zap className="h-4 w-4 text-accent" />
              </div>
              <span className="text-[14px] font-semibold text-ink">EMS 能源管理系统</span>
            </div>
            <h1 className="text-[17px] font-semibold tracking-tight text-ink">登录</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="label">
                用户名
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-9 w-full pl-8 pr-3"
                  placeholder="admin 或 user"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                密码
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 w-full pl-8 pr-3"
                  placeholder="演示环境无需密码"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-[12px] text-danger">
                <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary h-9 w-full">
              进入控制台
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-4 text-[12px] text-ink-3">
            演示账户：
            <button
              type="button"
              onClick={() => setUsername('admin')}
              className="mx-1 font-mono text-accent hover:underline"
            >
              admin
            </button>
            （系统管理员）/
            <button
              type="button"
              onClick={() => setUsername('user')}
              className="mx-1 font-mono text-accent hover:underline"
            >
              user
            </button>
            （值班操作员）
          </div>
        </div>
      </div>
    </div>
  );
}
