"use client";

import { useEditorStore } from "@lib/store";

export function Topbar() {
  const { saveToLocalStorage, loadFromLocalStorage, exportJson, importJson, analyzeNets, clear } = useEditorStore();
  return (
    <div className="h-12 border-b border-border flex items-center justify-between px-3 bg-surface">
      <div className="font-semibold">Flux.ai Lite</div>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600" onClick={analyzeNets}>Analyze</button>
        <button className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600" onClick={saveToLocalStorage}>Save</button>
        <button className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600" onClick={loadFromLocalStorage}>Load</button>
        <button className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600" onClick={exportJson}>Export</button>
        <label className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer">
          Import
          <input type="file" accept="application/json" className="hidden" onChange={(e) => importJson(e.target.files?.[0] ?? null)} />
        </label>
        <button className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500" onClick={clear}>Clear</button>
      </div>
    </div>
  );
}
