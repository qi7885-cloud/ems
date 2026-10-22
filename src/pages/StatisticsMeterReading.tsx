import { useMemo, useState } from 'react';
import { Download, Activity, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { monthOptions, seededSeries, seededValue } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import MetricStrip from '../components/MetricStrip';
import Empty from '../components/Empty';

interface MeterDevice {
  name: string;
  unit: string;
  min: number;
  max: number;
}

/** 抄表设备清单：抄表明细、汇总指标均由该列表派生 */
const devices: MeterDevice[] = [
  { name: '主配电柜', unit: 'kWh', min: 110000, max: 135000 },
  { name: '变压器A', unit: 'kWh', min: 60000, max: 75000 },
  { name: '变压器B', unit: 'kWh', min: 50000, max: 65000 },
  { name: '水表-1号', unit: '吨', min: 7000, max: 9000 },
];

const monthLabel = (month: string) => {
  const [year, monthNumber] = month.split('-');
  return `${year}年${Number(monthNumber)}月`;
};

export default function StatisticsMeterReading() {
  const [selectedMonth, setSelectedMonth] = useState('2024-06');

  const rows = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    const date = `${selectedMonth}-${String(lastDay).padStart(2, '0')}`;

    return devices.map((device) => {
      const reading = seededValue(`meter-${selectedMonth}-${device.name}`, device.min, device.max);
      const abnormal = seededValue(`meter-status-${selectedMonth}-${device.name}`, 0, 99) < 15;
      return {
        equipment: device.name,
        unit: device.unit,
        reading,
        date,
        statusText: abnormal ? '异常' : '已抄录',
        abnormal,
      };
    });
  }, [selectedMonth]);

  const metrics = useMemo(() => {
    const total = rows.length;
    const success = rows.filter((row) => !row.abnormal).length;
    const abnormal = total - success;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
    return [
      { label: '总抄表数', value: total, unit: '条', icon: Activity },
      { label: '成功数', value: success, unit: '条', icon: CheckCircle, tone: 'ok' as const },
      {
        label: '成功率',
        value: `${successRate}%`,
        icon: TrendingUp,
        tone: successRate >= 90 ? ('ok' as const) : ('warn' as const),
      },
      {
        label: '异常数',
        value: abnormal,
        unit: '条',
        icon: AlertTriangle,
        tone: abnormal > 0 ? ('warn' as const) : ('ok' as const),
      },
    ];
  }, [rows]);

  const dailyTrend = useMemo(() => {
    const power = seededSeries(`meter-power-${selectedMonth}`, 7, 105000, 130000);
    const water = seededSeries(`meter-water-${selectedMonth}`, 7, 8000, 9000);
    return power.map((value, index) => ({
      date: `${selectedMonth.slice(5)}-${String(index + 1).padStart(2, '0')}`,
      power: value,
      water: water[index],
    }));
  }, [selectedMonth]);

  const powerMax = Math.max(...dailyTrend.map((item) => item.power), 1);
  const waterMax = Math.max(...dailyTrend.map((item) => item.water), 1);

  const handleExport = () => {
    const header = ['设备名称', '抄表日期', '数值', '单位', '状态'];
    const body = rows.map((row) => [row.equipment, row.date, String(row.reading), row.unit, row.statusText]);
    const csv = [header, ...body].map((cols) => cols.join(',')).join('\r\n');
    // \uFEFF（BOM）保证 Excel 打开时中文不乱码
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `集抄报表-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <PageHeader title="集抄报表" description="查看各仪表的抄表数据">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="field h-7"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {monthLabel(month)}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleExport} className="btn-secondary h-7">
          <Download className="h-3.5 w-3.5" />
          导出报表
        </button>
      </PageHeader>

      <MetricStrip cols={4} items={metrics} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel title="本月用电量趋势" aside={<span className="font-mono text-[11px]">单位 kWh</span>}>
          <div className="flex h-[200px] items-end justify-between gap-1.5">
            {dailyTrend.map((day) => (
              <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-accent"
                  style={{ height: `${(day.power / powerMax) * 180}px` }}
                  title={`${day.date} 用电量 ${day.power.toLocaleString('zh-CN')} kWh`}
                />
                <span className="mt-2 font-mono text-[11px] text-ink-3">{day.date}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="本月用水量趋势" aside={<span className="font-mono text-[11px]">单位 吨</span>}>
          <div className="flex h-[200px] items-end justify-between gap-1.5">
            {dailyTrend.map((day) => (
              <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-info"
                  style={{ height: `${(day.water / waterMax) * 180}px` }}
                  title={`${day.date} 用水量 ${day.water.toLocaleString('zh-CN')} 吨`}
                />
                <span className="mt-2 font-mono text-[11px] text-ink-3">{day.date}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title={`抄表明细（${monthLabel(selectedMonth)}）`} flush>
        {rows.length === 0 ? (
          <Empty title="暂无抄表数据" description="当前月份没有可展示的仪表抄表记录" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>设备名称</th>
                <th>抄表日期</th>
                <th className="text-right">数值</th>
                <th>单位</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.equipment}>
                  <td className="font-medium text-ink">{row.equipment}</td>
                  <td className="font-mono text-ink-2">{row.date}</td>
                  <td className="text-right font-mono text-ink">{row.reading.toLocaleString('zh-CN')}</td>
                  <td className="text-ink-2">{row.unit}</td>
                  <td>
                    <span className={row.abnormal ? 'tag-warn' : 'tag-ok'}>{row.statusText}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
