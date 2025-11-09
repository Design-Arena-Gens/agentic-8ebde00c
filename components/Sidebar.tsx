"use client";

import { componentsCatalog } from "@lib/componentsCatalog";

export function Sidebar() {
  return (
    <div className="p-3 space-y-4">
      <div className="text-sm uppercase tracking-wider text-gray-400">Components</div>
      <div className="grid grid-cols-2 gap-2">
        {componentsCatalog.map((c) => (
          <div
            key={c.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/x-component", JSON.stringify({ type: c.type }));
              e.dataTransfer.effectAllowed = "move";
            }}
            className="p-3 rounded border border-border bg-surface hover:border-gray-500 cursor-grab active:cursor-grabbing text-center"
            title={`${c.name} (drag to canvas)`}
          >
            <div className="text-lg">{c.icon}</div>
            <div className="text-xs mt-1 text-gray-300">{c.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
