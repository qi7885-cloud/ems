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
  { id: 1, equipment_id: 2, user_id: 1, type: '设备故障', level: '严重', message: '变压器A温度过高', status: 'pending', created_at: '2024-06-01 10:30', resolved_at: '' },
  { id: 2, equipment_id: 1, user_id: 1, type: '用能预警', level: '一般', message: '主配电柜电流接近阈值', status: 'pending', created_at: '2024-06-01 11:00', resolved_at: '' },
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

export const generateTimeLabels = (count: number): string[] => {
  const labels: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    labels.push(`${time.getHours().toString().padStart(2, '0')}:00`);
  }
  return labels;
};

export const generateRandomData = (count: number, min: number, max: number): number[] => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export const powerChartData = {
  labels: generateTimeLabels(24),
  datasets: [
    {
      label: '用电量 (kWh)',
      data: generateRandomData(24, 5000, 12000),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
  ],
};

export const waterChartData = {
  labels: generateTimeLabels(24),
  datasets: [
    {
      label: '用水量 (吨)',
      data: generateRandomData(24, 300, 500),
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
    },
  ],
};

export const dailyStats = [
  { date: '05-27', power: 110000, water: 8200 },
  { date: '05-28', power: 115000, water: 8300 },
  { date: '05-29', power: 120000, water: 8400 },
  { date: '05-30', power: 118000, water: 8250 },
  { date: '05-31', power: 122000, water: 8450 },
  { date: '06-01', power: 125000, water: 8500 },
];

export const categoryEnergyData = [
  { category: '造纸车间', power: 45000, percentage: 36 },
  { category: '水处理车间', power: 28000, percentage: 22 },
  { category: '配电室', power: 22000, percentage: 18 },
  { category: '办公楼', power: 18000, percentage: 14 },
  { category: '其他', power: 12000, percentage: 10 },
];

export const transformerData = [
  { name: '变压器A', temperature: 65, load_rate: 78, current: 245, voltage: 10.5 },
  { name: '变压器B', temperature: 58, load_rate: 62, current: 198, voltage: 10.4 },
];

export const powerDistributionData = [
  { name: '进线1', current: 450, voltage: 10.5, power: 4725 },
  { name: '进线2', current: 420, voltage: 10.4, power: 4368 },
  { name: '出线1', current: 180, voltage: 10.5, power: 1890 },
  { name: '出线2', current: 200, voltage: 10.4, power: 2080 },
  { name: '出线3', current: 220, voltage: 10.5, power: 2310 },
];

export const offlineEvents = [
  { id: 1, equipment_id: 4, equipment_name: '水表-1号', start_time: '2024-05-30 08:15', end_time: '2024-05-30 08:30', reason: '网络中断' },
  { id: 2, equipment_id: 2, equipment_name: '变压器A', start_time: '2024-05-28 14:00', end_time: '2024-05-28 14:45', reason: '设备维护' },
];

export const monthlyReportData = {
  month: '2024年6月',
  total_power: 3750000,
  total_water: 255000,
  power_cost: 2437500,
  water_cost: 1200750,
  peak_demand: 15000,
  avg_demand: 8500,
};

export const priceList = [
  { id: 1, type: 'electricity', name: '电价', base_price: 2000.00, unit_price: 0.65, additional_price: 0.05 },
  { id: 2, type: 'water', name: '水价', base_price: 0.00, unit_price: 3.50, additional_price: 1.20 },
];
