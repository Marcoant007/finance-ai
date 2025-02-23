import type { ReactNode } from "react";

interface PercentageItemProps {
  value: number;
  icon: ReactNode;
  title: string;
}

const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-sm font-bold">{value}%</p>
      </div>
    </div>
  );
};

export default PercentageItem;
