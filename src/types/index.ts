export interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  location: string;
  installation_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EnergyData {
  id: number;
  equipment_id: number;
  power: number;
  voltage: number;
  current: number;
  energy_type: string;
  value: number;
  timestamp: string;
}

export type AlarmLevel = '严重' | '一般' | '轻微';
export type AlarmStatus = 'pending' | 'resolved';

export interface Alarm {
  id: number;
  equipment_id: number;
  user_id: number;
  type: string;
  level: AlarmLevel;
  message: string;
  status: AlarmStatus;
  created_at: string;
  /** 仅当 status 为 resolved 时存在 */
  resolved_at?: string;
}

export interface Price {
  id: number;
  type: string;
  base_price: number;
  unit_price: number;
  additional_price: number;
  effective_date: string;
  created_at: string;
}

export interface OfflineEvent {
  id: number;
  equipment_id: number;
  start_time: string;
  end_time: string;
  reason: string;
  created_at: string;
}

export interface EnergyStats {
  total_power: number;
  total_water: number;
  power_cost: number;
  water_cost: number;
  peak_power: number;
  avg_power: number;
}
