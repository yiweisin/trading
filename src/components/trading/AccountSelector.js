"use client";

import { useState } from "react";

export default function AccountSelector({ apiKeys, selectedKey, onSelect }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Trading Account
      </label>
      <select
        value={selectedKey?.id || ""}
        onChange={(e) => {
          const key = apiKeys.find((k) => k.id === e.target.value);
          onSelect(key);
        }}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select an account...</option>
        {apiKeys.map((key) => (
          <option key={key.id} value={key.id}>
            {key.name} ({key.testnet ? "Testnet" : "Mainnet"})
          </option>
        ))}
      </select>
    </div>
  );
}
