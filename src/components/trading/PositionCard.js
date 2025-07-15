"use client";

import LeverageControl from "./LeverageControl";

export default function PositionCard({
  position,
  selectedKey,
  onLeverageUpdate,
}) {
  const isLong = position.side === "Buy";
  const pnl = parseFloat(position.unrealisedPnl || 0);
  const pnlColor = pnl >= 0 ? "text-green-600" : "text-red-600";
  const size = parseFloat(position.size || 0);
  const leverage = position.leverage || "1";

  if (size === 0 && pnl === 0) {
    return null;
  }

  const calculateLiquidationPrice = () => {
    const avgPrice = parseFloat(position.avgPrice || 0);
    const lev = parseFloat(leverage);

    if (isLong) {
      return avgPrice * (1 - 0.8 / lev);
    } else {
      return avgPrice * (1 + 0.8 / lev);
    }
  };

  const getMarginMode = () => {
    return position.tradeMode === 1 ? "Isolated" : "Cross";
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold">{position.symbol}</h4>
            <span
              className={`text-xs px-2 py-1 rounded ${
                getMarginMode() === "Isolated"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {getMarginMode()}
            </span>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              isLong ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {position.side} {size}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Entry Price</div>
          <div className="font-medium">
            ${parseFloat(position.avgPrice || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-600">Mark Price:</span>
          <span className="ml-1 font-medium">
            ${parseFloat(position.markPrice || 0).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">PnL:</span>
          <span className={`ml-1 font-medium ${pnlColor}`}>
            ${pnl.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Position Value:</span>
          <span className="ml-1 font-medium">
            ${parseFloat(position.positionValue || 0).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Liq. Price:</span>
          <span className="ml-1 font-medium text-red-600">
            ${calculateLiquidationPrice().toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <LeverageControl
          selectedKey={selectedKey}
          symbol={position.symbol}
          currentLeverage={leverage}
          onLeverageUpdate={onLeverageUpdate}
        />
        <div className="text-xs text-gray-500">
          Margin: ${parseFloat(position.positionMM || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
