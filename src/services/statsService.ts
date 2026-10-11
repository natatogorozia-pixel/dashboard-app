import { StatItem } from '../types/dashboard';

export const fetchDashboardStats = async (): Promise<StatItem[]> => {
  return [
    { id: '1', title: 'სულ შეკვეთები', value: '1,284', icon: '📦', change: '+12%' },
    { id: '2', title: 'აქტიური ტრანსპორტი', value: '42', icon: '🚚', change: '+5%' },
    { id: '3', title: 'შემოსავალი', value: '₾45,200', icon: '💰', change: '+18%' },
    { id: '4', title: 'დაყოვნებული', value: '3', icon: '⚠️', change: '-2%' },
  ];
};