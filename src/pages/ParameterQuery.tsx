import { useMemo, useState } from 'react';
import { Search, Download, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Empty from '../components/Empty';

interface MonitorParam {
  id: number;
  equipment: string;
  parameter: string;
  value: string;
  unit: string;
  time: string;
}

interface Filters {
  equipment: string;
  startDate: string;
  endDate: string;
}

const INITIAL_FILTERS: Filters = { equipment: 'all', startDate: '2024-06-01', endDate: '2024-06-07' };

const MONITOR_PARAMETERS: MonitorParam[] = [
  { id: 1, equipment: '主配电柜', parameter: '电流', value: '450 A', unit: 'A', time: '2024-06-07 14:30' },
  { id: 2, equipment: '主配电柜', parameter: '电压', value: '10.5', unit: 'kV', time: '2024-06-07 14:30' },
  { id: 3, equipment: '变压器A', parameter: '温度', value: '65', unit: '°C', time: '2024-06-07 14:28' },
  { id: 4, equipment: '变压器A', parameter: '负载率', value: '78', unit: '%', time: '2024-06-07 14:28' },
  { id: 5, equipment: '变压器B', parameter: '温度', value: '58', unit: '°C', time: '2024-06-07 14:25' },
  { id: 6, equipment: '变压器B', parameter: '负载率', value: '62', unit: '%', time: '2024-06-07 14:25' },
  { id: 7, equipment: '水表-1号', parameter: '流量', value: '450', unit: '吨', time: '2024-06-07 14:30' },
  { id: 8, equipment: '水表-1号', parameter: '累计', value: '8500', unit: '吨', time: '2024-06-07 14:30' },
];

/** 统一的过滤逻辑：设备精确匹配 + 日期区间（按 time 的日期部分）+ 关键字模糊搜索 */
const filterParameters = (filters: Filters, keyword: string): MonitorParam[] => {
  const kw = keyword.trim().toLowerCase();
  return MONITOR_PARAMETERS.filter((param) => {
    if (filters.equipment !== 'all' && param.equipment !== filters.equipment) return false;

    const day = param.time.slice(0, 10); // '2024-06-07'
    if (filters.startDate && day < filters.startDate) return false;
    if (filters.endDate && day > filters.endDate) return false;

    if (
      kw &&
      !param.equipment.toLowerCase().includes(kw) &&
      !param.parameter.toLowerCase().includes(kw)
    ) {
      return false;
    }
    return true;
  });
};

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function ParameterQuery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(INITIAL_FILTERS.equipment);
  const [startDate, setStartDate] = useState(INITIAL_FILTERS.startDate);
  const [endDate, setEndDate] = useState(INITIAL_FILTERS.endDate);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(INITIAL_FILTERS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredParameters = useMemo(
    () => filterParameters(appliedFilters, searchTerm),
    [appliedFilters, searchTerm],
  );

  const handleQuery = () => {
    const next: Filters = { equipment: selectedEquipment, startDate, endDate };
    setAppliedFilters(next);
    setFeedback(`已按当前条件查询，共 ${filterParameters(next, searchTerm).length} 条`);
  };

  const handleReset = () => {
    setSelectedEquipment(INITIAL_FILTERS.equipment);
    setStartDate(INITIAL_FILTERS.startDate);
    setEndDate(INITIAL_FILTERS.endDate);
    setAppliedFilters(INITIAL_FILTERS);
    setSearchTerm('');
    setFeedback(null);
  };

  const handleExport = () => {
    const header = ['设备名称', '参数名称', '数值', '单位', '采集时间'];
    const rows = filteredParameters.map((param) => [
      param.equipment,
      param.parameter,
      param.value,
      param.unit,
      param.time,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');

    // \uFEFF 为 BOM，保证 Excel 正确识别中文
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `监测参数_${appliedFilters.endDate || '全部'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <PageHeader title="监测参数查询" description="查询历史监测数据和参数信息">
        <button onClick={handleQuery} className="btn-primary">
          <Search className="h-3.5 w-3.5" />
          查询
        </button>
        <button onClick={handleReset} className="btn-secondary">
          <RefreshCw className="h-3.5 w-3.5" />
          刷新
        </button>
        <button onClick={handleExport} className="btn-secondary">
          <Download className="h-3.5 w-3.5" />
          导出
        </button>
      </PageHeader>

      <div className="toolbar">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-ink-3">设备</span>
          <select
            value={selectedEquipment}
            onChange={(e) => {
              setSelectedEquipment(e.target.value);
              setFeedback(null);
            }}
            className="field h-7 min-w-[120px]"
          >
            <option value="all">全部设备</option>
            <option value="主配电柜">主配电柜</option>
            <option value="变压器A">变压器A</option>
            <option value="变压器B">变压器B</option>
            <option value="水表-1号">水表-1号</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-ink-3">开始</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setFeedback(null);
            }}
            className="field h-7"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-ink-3">结束</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setFeedback(null);
            }}
            className="field h-7"
          />
        </div>

        <div className="relative flex items-center">
          <Search className="absolute left-2 h-3.5 w-3.5 text-ink-3" />
          <input
            type="text"
            placeholder="搜索设备或参数…"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFeedback(null);
            }}
            className="field h-7 w-56 pl-7"
          />
        </div>

        {feedback && <span className="ml-auto font-mono text-[11px] text-accent">{feedback}</span>}
      </div>

      <Panel
        title="监测参数"
        aside={<span className="font-mono">共 {filteredParameters.length} 条</span>}
        flush
      >
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>设备名称</th>
                <th>参数名称</th>
                <th className="text-right">数值</th>
                <th>单位</th>
                <th>采集时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredParameters.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <Empty title="没有符合条件的记录" description="试试放宽设备或日期范围" />
                  </td>
                </tr>
              ) : (
                filteredParameters.map((param) => (
                  <tr key={param.id}>
                    <td className="font-medium text-ink">{param.equipment}</td>
                    <td className="text-ink-2">{param.parameter}</td>
                    <td className="text-right font-mono text-accent">{param.value}</td>
                    <td className="text-ink-2">{param.unit}</td>
                    <td className="font-mono text-ink-2">{param.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
