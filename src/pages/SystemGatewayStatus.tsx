import { useState } from 'react';
import { Server, CheckCircle, XCircle, Activity, RefreshCw, Search } from 'lucide-react';
import { seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

const initialGateways = [
  { id: 'GW001', name: '主网关-A', ip: '192.168.1.101', location: '中控室', status: 'online', devices: 24, lastSync: '2024-06-15 14:32:18', uptime: '99.8%' },
  { id: 'GW002', name: '主网关-B', ip: '192.168.1.102', location: '中控室', status: 'online', devices: 22, lastSync: '2024-06-15 14:32:15', uptime: '99.5%' },
  { id: 'GW003', name: '北区网关', ip: '192.168.1.103', location: '北区厂房', status: 'online', devices: 18, lastSync: '2024-06-15 14:32:10', uptime: '98.9%' },
  { id: 'GW004', name: '南区网关', ip: '192.168.1.104', location: '南区厂房', status: 'warning', devices: 15, lastSync: '2024-06-15 14:28:30', uptime: '95.2%' },
  { id: 'GW005', name: '生产区网关', ip: '192.168.1.105', location: '生产区', status: 'online', devices: 32, lastSync: '2024-06-15 14:32:05', uptime: '99.2%' },
  { id: 'GW006', name: '锅炉房网关', ip: '192.168.1.106', location: '锅炉房', status: 'online', devices: 8, lastSync: '2024-06-15 14:32:00', uptime: '99.9%' },
  { id: 'GW007', name: '综合楼网关', ip: '192.168.1.107', location: '综合楼', status: 'offline', devices: 12, lastSync: '2024-06-14 16:45:20', uptime: '0%' },
  { id: 'GW008', name: '制冷站网关', ip: '192.168.1.108', location: '制冷站', status: 'online', devices: 6, lastSync: '2024-06-15 14:31:55', uptime: '99.7%' },
];

const statusConfig = {
  online: { text: '在线', tag: 'tag-ok', dot: 'status-online', lamp: 'animate-pulse-soft' },
  warning: { text: '异常', tag: 'tag-danger', dot: 'status-warning', lamp: 'animate-led' },
  offline: { text: '离线', tag: 'tag-offline', dot: 'status-danger', lamp: '' },
};

/** 将分钟数格式化为「刚刚 / X 分钟前」 */
const toRelativeTime = (minutes: number): string => (minutes <= 0 ? '刚刚' : `${minutes} 分钟前`);

export default function SystemGatewayStatus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gateways, setGateways] = useState(() => initialGateways.map((item) => ({ ...item })));
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toLocaleTimeString('zh-CN'));

  const term = searchTerm.trim().toLowerCase();
  const filteredGateways = gateways.filter(
    (item) =>
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.ip.includes(term)
  );

  const stats = {
    total: gateways.length,
    online: gateways.filter((item) => item.status === 'online').length,
    offline: gateways.filter((item) => item.status === 'offline').length,
  };

  // 平均响应时间：由在线网关的在线率反推（在线率越高响应越快），
  // 仅作概览指标，避免新增数据字段。
  const onlineGateways = gateways.filter((item) => item.status !== 'offline');
  const avgResponse = onlineGateways.length
    ? Math.round(
        onlineGateways.reduce((sum, item) => sum + Math.round((100 - parseFloat(item.uptime)) * 4 + 8), 0) /
          onlineGateways.length,
      )
    : 0;

  const handleRefresh = () => {
    const stamp = Date.now();
    setGateways((prev) =>
      prev.map((item) => ({
        ...item,
        lastSync: toRelativeTime(seededValue(`gateway-sync-${item.id}-${stamp}`, 0, 15)),
      }))
    );
    setLastRefresh(new Date().toLocaleTimeString('zh-CN'));
  };

  return (
    <div className="space-y-3">
      <PageHeader title="网关通讯状态" description="监控所有网关设备的运行状态和连接情况">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            placeholder="搜索网关名称、编号或IP..."
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
          { label: '网关总数', value: stats.total, unit: '台', icon: Server, tone: 'accent' },
          { label: '在线', value: stats.online, unit: '台', icon: CheckCircle, tone: 'ok' },
          { label: '离线', value: stats.offline, unit: '台', icon: XCircle, tone: 'warn' },
          { label: '平均响应', value: avgResponse, unit: 'ms', icon: Activity, tone: 'default' },
        ]}
      />

      {filteredGateways.length === 0 ? (
        <Panel flush>
          <Empty title="没有匹配的网关" description="试试更换搜索关键词" />
        </Panel>
      ) : (
        <>
          <Panel
            title="网关卡片"
            aside={<span className="font-mono">{filteredGateways.length} 台</span>}
            bodyClassName="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredGateways.map((gateway) => {
              const config = statusConfig[gateway.status as keyof typeof statusConfig];
              return (
                <div key={gateway.id} className="panel flex items-center gap-2 px-3 py-2">
                  <span className={`status-dot ${config.dot} ${config.lamp}`} />
                  <span className="truncate text-[13px] font-medium text-ink">{gateway.name}</span>
                  <span className="font-mono text-[11px] text-ink-3">{gateway.ip}</span>
                  <span className={`ml-auto ${config.tag}`}>{config.text}</span>
                  <span className="w-24 shrink-0 text-right font-mono text-[11px] text-ink-2">
                    {gateway.lastSync}
                  </span>
                </div>
              );
            })}
          </Panel>

          <Panel title="网关详细列表" flush>
            <table>
              <thead>
                <tr>
                  <th>网关编号</th>
                  <th>网关名称</th>
                  <th>IP地址</th>
                  <th>位置</th>
                  <th className="text-right">接入设备</th>
                  <th className="text-right">在线率</th>
                  <th>状态</th>
                  <th>最后同步</th>
                </tr>
              </thead>
              <tbody>
                {filteredGateways.map((item) => {
                  const config = statusConfig[item.status as keyof typeof statusConfig];
                  return (
                    <tr key={item.id}>
                      <td className="font-mono font-medium text-accent">{item.id}</td>
                      <td className="font-medium text-ink">{item.name}</td>
                      <td className="font-mono text-ink-3">{item.ip}</td>
                      <td className="text-ink-2">{item.location}</td>
                      <td className="text-right font-mono text-ink-2">{item.devices}</td>
                      <td className="text-right">
                        <span
                          className={`font-mono ${
                            parseFloat(item.uptime) >= 99
                              ? 'text-ok'
                              : parseFloat(item.uptime) >= 95
                                ? 'text-warn'
                                : 'text-danger'
                          }`}
                        >
                          {item.uptime}
                        </span>
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
    </div>
  );
}
