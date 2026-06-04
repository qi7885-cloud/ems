import { create } from 'zustand';
import { User, Equipment, Alarm, EnergyStats } from '../types';
import { mockUsers, mockEquipments, mockAlarms, mockEnergyStats } from '../data/mockData';

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  equipments: Equipment[];
  alarms: Alarm[];
  energyStats: EnergyStats;
  login: (username: string) => boolean;
  logout: () => void;
  resolveAlarm: (id: number) => void;
  addEquipment: (equipment: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>) => void;
  updateEquipment: (equipment: Equipment) => void;
  deleteEquipment: (id: number) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isLoggedIn: false,
  equipments: mockEquipments,
  alarms: mockAlarms,
  energyStats: mockEnergyStats,

  login: (username) => {
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      set({ user, isLoggedIn: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
  },

  resolveAlarm: (id) => {
    set((state) => ({
      alarms: state.alarms.map(alarm =>
        alarm.id === id
          ? { ...alarm, status: 'resolved', resolved_at: new Date().toISOString() }
          : alarm
      ),
    }));
  },

  addEquipment: (equipment) => {
    const newEquipment: Equipment = {
      ...equipment,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({ equipments: [...state.equipments, newEquipment] }));
  },

  updateEquipment: (equipment) => {
    set((state) => ({
      equipments: state.equipments.map(e =>
        e.id === equipment.id ? { ...equipment, updated_at: new Date().toISOString() } : e
      ),
    }));
  },

  deleteEquipment: (id) => {
    set((state) => ({ equipments: state.equipments.filter(e => e.id !== id) }));
  },
}));
