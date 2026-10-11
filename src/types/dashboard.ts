export interface StatItem {
  id: string;
  title: string;
  value: string;
  icon: string;
  change: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}