import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";

const SummaryCards = () => {
  return (
    <div className="space-y-4">
      <SummaryCard
        icon={<WalletIcon size={16} />}
        title="Saldo"
        amount={2500}
        size="large"
      />

      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon size={16} />}
          title="Investido"
          amount={2500}
        />
        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Receitas"
          amount={1000}
        />
        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          title="Despesas"
          amount={500}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
