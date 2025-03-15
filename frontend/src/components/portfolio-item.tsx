import { PortfolioItem } from "@/lib/types";

interface PortfolioItemProps {
  item: PortfolioItem;
}

export default function PortfolioItemComponent({ item }: PortfolioItemProps) {
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Calculate current value
  const currentValue = item.stock
    ? item.quantity * item.stock.currentPrice
    : item.quantity * item.purchasePrice;

  // Calculate profit/loss
  const purchaseValue = item.quantity * item.purchasePrice;
  const profitLoss = currentValue - purchaseValue;
  const profitLossPercent = (profitLoss / purchaseValue) * 100;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">
            {item.stock?.symbol || item.stockSymbol}
          </h3>
          <p className="text-sm text-gray-600">
            {item.stock?.companyName || "Stock"}
          </p>
        </div>

        <div className="text-right">
          <p className="font-medium">{formatCurrency(currentValue)}</p>
          <p
            className={`text-sm ${
              profitLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {profitLoss >= 0 ? "+" : ""}
            {formatCurrency(profitLoss)}({profitLoss >= 0 ? "+" : ""}
            {profitLossPercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <p className="text-gray-500">Quantity</p>
          <p>{item.quantity}</p>
        </div>
        <div>
          <p className="text-gray-500">Purchase Price</p>
          <p>{formatCurrency(item.purchasePrice)}</p>
        </div>
        <div>
          <p className="text-gray-500">Purchase Date</p>
          <p>{new Date(item.purchaseDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
