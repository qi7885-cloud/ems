import { User, Equipment, Alarm, EnergyStats } from '../types';

export const mockUsers: User[] = [
  { id: 1, username: 'admin', role: 'admin', email: 'admin@example.com', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, username: 'user', role: 'user', email: 'user@example.com', created_at: '2024-01-02', updated_at: '2024-01-02' },
];

export const mockEquipments: Equipment[] = [
  { id: 1, name: '主配电柜', model: 'PD-001', manufacturer: '西门子', location: '一号厂房', installation_date: '2024-01-15', status: 'active', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: 2, name: '变压器A', model: 'TR-001', manufacturer: 'ABB', location: '配电室', installation_date: '2023-06-20', status: 'active', created_at: '2023-06-20', updated_at: '2023-06-20' },
  { id: 3, name: '变压器B', model: 'TR-002', manufacturer: 'ABB', location: '配电室', installation_date: '2023-06-20', status: 'active', created_at: '2023-06-20', updated_at: '2023-06-20' },
  { id: 4, name: '水表-1号', model: 'WM-001', manufacturer: '宁波水表', location: '水处理车间', installation_date: '2024-02-10', status: 'active', created_at: '2024-02-10', updated_at: '2024-02-10' },
];

export const mockAlarms: Alarm[] = [
  { id: 1, equipment_id: 2, user_id: 1, type: '设备故障', level: '严重', message: '变压器A温度过高', status: 'pending', created_at: '2024-06-01 10:30' },
  { id: 2, equipment_id: 1, user_id: 1, type: '用能预警', level: '一般', message: '主配电柜电流接近阈值', status: 'pending', created_at: '2024-06-01 11:00' },
  { id: 3, equipment_id: 3, user_id: 2, type: '设备故障', level: '轻微', message: '变压器B负载率偏高', status: 'resolved', created_at: '2024-05-31 14:00', resolved_at: '2024-05-31 15:30' },
];

export const mockEnergyStats: EnergyStats = {
  total_power: 125000,
  total_water: 8500,
  power_cost: 81250,
  water_cost: 39950,
  peak_power: 15000,
  avg_power: 8500,
};

/* ------------------------------------------------------------------ *
 * 数据层工具：确定性伪随机
 * 目的：同一 key 永远得到同一序列，避免在渲染期调用 Math.random()
 * 造成柱状图 / 折线图每次重渲染都跳动。
 * ------------------------------------------------------------------ */

const hashSeed = (key: string): number => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

/** 按 key 生成确定性序列 */
export const seededSeries = (key: string, count: number, min: number, max: number, decimals = 0): number[] => {
  const rnd = mulberry32(hashSeed(key));
  const factor = 10 ** decimals;
  return Array.from({ length: count }, () => Math.round((min + rnd() * (max - min)) * factor) / factor);
};

/** 按 key 生成确定性单值 */
export const seededValue = (key: string, min: number, max: number, decimals = 0): number => {
  const factor = 10 ** decimals;
  return Math.round((min + mulberry32(hashSeed(key))() * (max - min)) * factor) / factor;
};

export const generateRandomData = (count: number, min: number, max: number): number[] =>
  seededSeries(`random-${count}-${min}-${max}`, count, min, max);

/* ------------------------------------------------------------------ *
 * 时间维度
 * ------------------------------------------------------------------ */

export type PeriodKey = 'week' | 'month' | 'quarter' | 'year';

/** stepHours < 24 → 输出 HH:00；< 28 天 → 输出 MM-DD；否则 → 输出 YYYY-MM */
export const periodConfig: Record<PeriodKey, { label: string; points: number; stepHours: number }> = {
  week: { label: '本周', points: 7, stepHours: 24 },
  month: { label: '本月', points: 30, stepHours: 24 },
  quarter: { label: '本季度', points: 13, stepHours: 24 * 7 },
  year: { label: '本年', points: 12, stepHours: 24 * 30 },
};

export const generateTimeLabels = (count: number, stepHours = 1): string[] =>
  Array.from({ length: count }, (_, i) => `${((i * stepHours) % 24).toString().padStart(2, '0')}:00`);

/** 按周期生成 X 轴标签。小时粒度取固定一天 00:00-23:00，不会再出现重复标签 */
export const getTimeLabels = (period: PeriodKey): string[] => {
  const cfg = periodConfig[period];
  const now = new Date();
  return Array.from({ length: cfg.points }, (_, i) => {
    const t = new Date(now.getTime() - (cfg.points - 1 - i) * cfg.stepHours * 3600 * 1000);
    const MM = (t.getMonth() + 1).toString().padStart(2, '0');
    const DD = t.getDate().toString().padStart(2, '0');
    if (cfg.stepHours < 24) return `${t.getHours().toString().padStart(2, '0')}:00`;
    if (cfg.stepHours < 24 * 28) return `${MM}-${DD}`;
    return `${t.getFullYear()}-${MM}`;
  });
};

export const monthOptions = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
export const yearOptions = ['2022', '2023', '2024'];

/* ------------------------------------------------------------------ *
 * 图表数据（函数式，按周期/月份取数）
 * ------------------------------------------------------------------ */

export const getPowerSeries = (period: PeriodKey, min = 5000, max = 12000): number[] =>
  seededSeries(`power-${period}`, periodConfig[period].points, min, max);

export const getWaterSeries = (period: PeriodKey, min = 300, max = 500): number[] =>
  seededSeries(`water-${period}`, periodConfig[period].points, min, max);

export const getHourlyIntensity = (seedKey: string, count = 24): number[] =>
  seededSeries(seedKey, count, 20, 90);

/* ------------------------------------------------------------------ *
 * 静态业务数据
 * ------------------------------------------------------------------ */

export const dailyStats = [
  { date: '05-26', power: 108000, water: 8100 },
  { date: '05-27', power: 110000, water: 8200 },
  { date: '05-28', power: 115000, water: 8300 },
  { date: '05-29', power: 120000, water: 8400 },
  { date: '05-30', power: 118000, water: 8250 },
  { date: '05-31', power: 122000, water: 8450 },
  { date: '06-01', power: 125000, water: 8500 },
];

/** 分类能耗：percentage 由 power 占比自动派生，避免手工维护导致加和不为 100% */
export const categoryEnergyData = (() => {
  const raw = [
    { category: '造纸车间', power: 45000, unitEnergy: 118, yoy: -4.1 },
    { category: '水处理车间', power: 28000, unitEnergy: 132, yoy: -2.6 },
    { category: '配电室', power: 22000, unitEnergy: 96, yoy: -3.2 },
    { category: '办公楼', power: 18000, unitEnergy: 41, yoy: -5.8 },
    { category: '其他', power: 12000, unitEnergy: 87, yoy: -1.4 },
  ];
  const total = raw.reduce((sum, item) => sum + item.power, 0);
  return raw.map((item) => ({ ...item, percentage: Math.round((item.power / total) * 100) }));
})();

export const transformerData = [
  { name: '变压器A', temperature: 65, load_rate: 78, current: 245, voltage: 10.5 },
  { name: '变压器B', temperature: 58, load_rate: 62, current: 198, voltage: 10.4 },
];

/** 每台设备的额定电流，用于计算负载率，不再对所有设备硬编码 500A */
export const powerDistributionData = [
  { name: '进线1', current: 450, voltage: 10.5, power: 4725, ratedCurrent: 500 },
  { name: '进线2', current: 420, voltage: 10.4, power: 4368, ratedCurrent: 500 },
  { name: '出线1', current: 180, voltage: 10.5, power: 1890, ratedCurrent: 250 },
  { name: '出线2', current: 200, voltage: 10.4, power: 2080, ratedCurrent: 250 },
  { name: '出线3', current: 220, voltage: 10.5, power: 2310, ratedCurrent: 250 },
];

export const offlineEvents = [
  { id: 1, equipment_id: 4, equipment_name: '水表-1号', start_time: '2024-05-30 08:15', end_time: '2024-05-30 08:30', reason: '网络中断' },
  { id: 2, equipment_id: 2, equipment_name: '变压器A', start_time: '2024-05-28 14:00', end_time: '2024-05-28 14:45', reason: '设备维护' },
  { id: 3, equipment_id: 3, equipment_name: '变压器B', start_time: '2024-05-27 09:20', end_time: '2024-05-27 09:35', reason: '网络中断' },
  { id: 4, equipment_id: 4, equipment_name: '水表-1号', start_time: '2024-05-25 16:40', end_time: '2024-05-25 17:10', reason: '网络中断' },
  { id: 5, equipment_id: 1, equipment_name: '主配电柜', start_time: '2024-05-24 11:05', end_time: '2024-05-24 11:22', reason: '网关重启' },
  { id: 6, equipment_id: 2, equipment_name: '变压器A', start_time: '2024-05-22 03:10', end_time: '2024-05-22 03:40', reason: '设备维护' },
  { id: 7, equipment_id: 3, equipment_name: '变压器B', start_time: '2024-05-20 13:50', end_time: '2024-05-20 14:05', reason: '网络中断' },
  { id: 8, equipment_id: 1, equipment_name: '主配电柜', start_time: '2024-05-18 07:30', end_time: '2024-05-18 07:48', reason: '网关重启' },
  { id: 9, equipment_id: 4, equipment_name: '水表-1号', start_time: '2024-05-16 22:15', end_time: '2024-05-16 22:30', reason: '网络中断' },
  { id: 10, equipment_id: 2, equipment_name: '变压器A', start_time: '2024-05-14 10:00', end_time: '2024-05-14 10:25', reason: '设备维护' },
  { id: 11, equipment_id: 3, equipment_name: '变压器B', start_time: '2024-05-12 18:35', end_time: '2024-05-12 18:50', reason: '网络中断' },
  { id: 12, equipment_id: 1, equipment_name: '主配电柜', start_time: '2024-05-09 05:40', end_time: '2024-05-09 06:02', reason: '网关重启' },
];

export const monthlyReportData = {
  month: '2024年6月',
  total_power: 3750000,
  total_water: 255000,
  power_cost: 2437500,
  water_cost: 1453500,
  peak_demand: 15000,
  avg_demand: 8500,
};

export const priceList = [
  { id: 1, type: 'electricity', name: '电价', base_price: 2000.0, unit_price: 0.65, additional_price: 0.05 },
  { id: 2, type: 'water', name: '水价', base_price: 0.0, unit_price: 3.5, additional_price: 1.2 },
];

/** 电能价格方案，供统计页统一引用，避免各页各写一套数字 */
export const electricityPricePlans = {
  sharp: { label: '尖峰', price: 0.85, hours: '08:00-11:00, 17:00-21:00' },
  peak: { label: '高峰', price: 0.67, hours: '07:00-08:00, 11:00-17:00, 21:00-22:00' },
  flat: { label: '平段', price: 0.52, hours: '06:00-07:00, 22:00-23:00' },
  valley: { label: '低谷', price: 0.3, hours: '23:00-06:00' },
  basic: { label: '基本电费', price: 2000, hours: '按容量计收' },
};

export const waterPricePlans = {
  tap: { label: '自来水费', price: 4.5 },
  sewage: { label: '排污费', price: 1.2 },
  resource: { label: '水资源费', price: 0.8 },
};
