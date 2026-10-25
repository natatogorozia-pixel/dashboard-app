import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLogisticsStore = create(
  persist(
    (set) => ({
      // საწყისი მონაცემები
      stats: [
        { id: '1', title: 'სულ შეკვეთები', value: '1,284', icon: '📦', change: '+12%' },
        { id: '2', title: 'აქტიური ტრანსპორტი', value: '42', icon: '🚚', change: '+5%' },
        { id: '3', title: 'შემოსავალი', value: '₾45,200', icon: '💰', change: '+18%' },
        { id: '4', title: 'დაყოვნებული', value: '3', icon: '⚠️', change: '-2%' },
      ],
      searchTerm: '',

      // მოქმედებები (Actions)
      setSearchTerm: (term) => set({ searchTerm: term }),

      addStat: (newItem) => set((state) => ({ 
        stats: [...state.stats, { id: Date.now().toString(), icon: '📊', ...newItem }] 
      })),

      editStat: (id, updatedData) => set((state) => ({
        stats: state.stats.map(item => item.id === id ? { ...item, ...updatedData } : item)
      })),

      deleteStat: (id) => set((state) => ({
        stats: state.stats.filter(item => item.id !== id)
      })),
    }),
    {
      name: 'b2b-logistics-storage', // localStorage-ში შენახვის გასაღები (Key)
    }
  )
);