import { useState } from 'react';
import { Gauge, CheckCircle, WifiOff, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

const initialMeters = [
  { id: 'M001', name: '主配电柜-1号', type: '电能表', location: '配电室A', status: 'online', lastSync: '2024-06-15 14:32:18', signal: 95 },
  { id: 'M002', name: '主配电柜-2号', type: '电能表', location: '配电室A', status: 'online', lastSync: '2024-06-15 14:32:15', signal: 88 },
  { id: 'M003', name: '变压器1#', type: '电能表', location: '配电室A', status: 'online', lastSync: '2024-06-15 14:32:12', signal: 92 },
  { id: 'M004', name: '变压器2#', type: '电能表', location: '配电室B', status: 'warning', lastSync: '2024-06-15 14:30:00', signal: 45 },
  { id: 'M005', name: '水表-1号', type: '水表', location: '综合楼', status: 'online', lastSync: '2024-06-15 14:32:08', signal: 90 },
  { id: 'M006', name: '水表-2号', type: '水表', location: '生产区', status: 'offline', lastSync: '2024-06-14 10:25:30', signal: 0 },
  { id: 'M007', name: '燃气表-1号', type: '燃气表', location: '锅炉房', status: 'online', lastSync: '2024-06-15 14:32:05', signal: 85 },
  { id: 'M008', name: '冷量表-1号', type: '冷量表', location: '制冷站', status: 'online', lastSync: '2024-06-15 14:32:00', signal: 93 },
  { id: 'M009', name: '热量表-1号', type: '热量表', location: '换热站', status: 'warning', lastSync: '2024-06-15 14:28:45', signal: 35 },
  { id: 'M010', name: '电能表-北区', type: '电能表', location: '北区厂房', status: 'online', lastSync: '2024-06-15 14:31:55', signal: 89 },
  { id: 'M011', name: '电能表-南区', type: '电能表', location: '南区厂房', status: 'online', lastSync: '2024-06-15 14:31:50', signal: 91 },
  { id: 'M012', name: '水表-3号', type: '水表', location: '南区厂房', status: 'offline', lastSync: '2024-06-13 09:15:00', signal: 0 },
];

const statusConfig = {
  online: { text: '在线', tag: 'tag-ok', dot: 'status-online', lamp: 'animate-pulse-soft' },
  warning: { text: '通信异常', tag: 'tag-danger', dot: 'status-warning', lamp: 'animate-led' },
  offline: { text: '离线', tag: 'tag-offline', dot: 'status-danger', lamp: '' },
};

/** 将分钟数格式化为「刚刚 / X 分钟前」 */
const toRelativeTime = (minutes: number): string => (minutes <= 0 ? '刚刚' : `${minutes} 分钟前`);

export default function SystemMeterStatus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [meters, setMeters] = useState(() => initialMeters.map((item) => ({ ...item })));
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toLocaleTimeString('zh-CN'));

  const term = searchTerm.trim().toLowerCase();
  const filteredData = meters.filter(
    (item) =>
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term)
  );

  const stats = {
    total: meters.length,
    online: meters.filter((item) => item.status === 'online').length,
    warning: meters.filter((item) => item.status === 'warning').length,
    offline: meters.filter((item) => item.status === 'offline').length,
  };

  const handleRefresh = () => {
    const stamp = Date.now();
    setMeters((prev) =>
      prev.map((item) =>
        item.status === 'offline'
          ? item
          : { ...item, lastSync: toRelativeTime(seededValue(`meter-sync-${item.id}-${stamp}`, 0, 10)) }
      )
    );
    setLastRefresh(new Date().toLocaleTimeString('zh-CN'));
  };

  return (
    <div className="space-y-3">
      <PageHeader title="仪表通讯状态" description="监控所有仪表设备的通讯连接状态">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            placeholder="搜索仪表名称、编号或位置..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field h-7 w-56 pl-7"
          />
        </div>
        <span className="font-mono text-[11px] text-ink-3">最后刷新 {lastRefresh}</span>
        <button onClick={handleRefresh} className="btn-secondary">
          <RefreshCw className="h-4 w-4" />
          刷新状态
        </button>
      </PageHeader>

      <MetricStrip
        cols={4}
        items={[
          { label: '仪表总数', value: stats.total, unit: '台', icon: Gauge, tone: 'accent' },
          { label: '在线', value: stats.online, unit: '台', icon: CheckCircle, tone: 'ok' },
          { label: '离线', value: stats.offline, unit: '台', icon: WifiOff, tone: 'warn' },
          { label: '通信异常', value: stats.warning, unit: '台', icon: AlertTriangle, tone: 'danger' },
        ]}
      />

      {filteredData.length === 0 ? (
        <Panel flush>
          <Empty title="没有匹配的仪表" description="试试更换搜索关键词" />
        </Panel>
      ) : (
        <>
          <Panel
            title="仪表卡片"
            aside={<span className="font-mono">{filteredData.length} 台</span>}
            bodyClassName="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredData.map((item) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              return (
                <div key={item.id} className="panel flex items-center gap-2 px-3 py-2">
                  <span className={`status-dot ${config.dot} ${config.lamp}`} />
                  <span className="truncate text-[13px] font-medium text-ink">{item.name}</span>
                  <span className="font-mono text-[11px] text-ink-3">{item.id}</span>
                  <span className={`ml-auto ${config.tag}`}>{config.text}</span>
                  <span className="w-24 shrink-0 text-right font-mono text-[11px] text-ink-2">
                    {item.lastSync}
                  </span>
                </div>
              );
            })}
          </Panel>

          <Panel title="仪表列表" flush>
            <table>
              <thead>
                <tr>
                  <th>仪表编号</th>
                  <th>仪表名称</th>
                  <th>类型</th>
                  <th>位置</th>
                  <th>信号强度</th>
                  <th>状态</th>
                  <th>最后同步</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => {
                  const config = statusConfig[item.status as keyof typeof statusConfig];
                  return (
                    <tr key={item.id}>
                      <td className="font-mono font-medium text-accent">{item.id}</td>
                      <td className="font-medium text-ink">{item.name}</td>
                      <td className="text-ink-2">{item.type}</td>
                      <td className="text-ink-2">{item.location}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-bar w-16">
                            <div
                              className={`progress-fill ${
                                item.signal >= 80 ? 'bg-ok' : item.signal >= 50 ? 'bg-warn' : 'bg-danger'
                              }`}
                              style={{ width: `${item.signal}%` }}
                            />
                          </div>
                          <span className="font-mono text-ink-2">{item.signal}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={config.tag}>{config.text}</span>
                      </td>
                      <td className="font-mono text-ink-2">{item.lastSync}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>
        </>
      )}

      <Panel title="通讯状态概览">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="status-dot status-online" />
            <span className="text-ink-2">
              在线 <span className="font-mono text-ok">{stats.online}</span> 台（
              {((stats.online / stats.total) * 100).toFixed(1)}%）
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot status-warning" />
            <span className="text-ink-2">
              通信异常 <span className="font-mono text-danger">{stats.warning}</span> 台（
              {((stats.warning / stats.total) * 100).toFixed(1)}%）
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot status-danger" />
            <span className="text-ink-2">
              离线 <span className="font-mono text-ink-3">{stats.offline}</span> 台（
              {((stats.offline / stats.total) * 100).toFixed(1)}%）
            </span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
