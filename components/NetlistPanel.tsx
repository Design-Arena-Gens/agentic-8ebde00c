"use client";

import { Net } from "@lib/types";

export function NetlistPanel({ nets }: { nets: Net[] }) {
  return (
    <div className="p-3 space-y-3">
      <div className="text-sm uppercase tracking-wider text-gray-400">Netlist</div>
      {nets.length === 0 && (
        <div className="text-gray-400 text-sm">No nets. Click Analyze to compute connectivity.</div>
      )}
      <div className="space-y-2">
        {nets.map((net) => (
          <div key={net.id} className="rounded border border-border p-2">
            <div className="text-xs text-gray-400">Net</div>
            <div className="font-mono text-sm">{net.id}</div>
            <div className="mt-1 text-xs text-gray-300">Pins:</div>
            <ul className="text-xs text-gray-200 list-disc ml-4">
              {net.pins.map((p) => (
                <li key={`${p.nodeId}:${p.pin}`}>{p.ref} . {p.pin} ({p.nodeId})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
