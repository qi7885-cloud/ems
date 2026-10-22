import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      equipments: mockEquipments,
      alarms: mockAlarms,
      energyStats: mockEnergyStats,

      login: (username) => {
        const user = mockUsers.find((u) => u.username === username);
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
          alarms: state.alarms.map((alarm) =>
            alarm.id === id
              ? { ...alarm, status: 'resolved' as const, resolved_at: new Date().toISOString() }
              : alarm,
          ),
        }));
      },

      addEquipment: (equipment) => {
        const now = new Date().toISOString();
        set((state) => ({
          equipments: [...state.equipments, { ...equipment, id: Date.now(), created_at: now, updated_at: now }],
        }));
      },

      updateEquipment: (equipment) => {
        set((state) => ({
          equipments: state.equipments.map((e) =>
            e.id === equipment.id ? { ...equipment, updated_at: new Date().toISOString() } : e,
          ),
        }));
      },

      deleteEquipment: (id) => {
        set((state) => ({ equipments: state.equipments.filter((e) => e.id !== id) }));
      },
    }),
    {
      name: 'ems-auth',
      storage: createJSONStorage(() => sessionStorage),
      // 只持久化登录态：业务数据仍以内存 mock 为准，避免本地缓存造成数据陈旧
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    },
  ),
);
