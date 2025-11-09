"use client";

import { create } from 'zustand';
import { FluxEdge, FluxNode, Net } from './types';
import { componentsCatalog } from './componentsCatalog';
import { nanoid } from './uid';

export type EditorState = {
  nodes: FluxNode[];
  edges: FluxEdge[];
  nets: Net[];
  setGraph: (nodes: FluxNode[], edges: FluxEdge[]) => void;
  addComponent: (type: string, position: { x: number; y: number }) => void;
  updateNodes: (updater: (nodes: FluxNode[]) => FluxNode[]) => void;
  updateEdges: (updater: (edges: FluxEdge[]) => FluxEdge[]) => void;
  clear: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportJson: () => void;
  importJson: (file: File | null) => void;
  analyzeNets: () => void;
};

function download(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],
  nets: [],
  setGraph: (nodes, edges) => set({ nodes, edges }),
  addComponent: (type, position) => {
    const spec = componentsCatalog.find((c) => c.type === (type as any));
    if (!spec) return;
    const id = nanoid();
    const node: FluxNode = {
      id,
      type: 'flux',
      position,
      data: {
        ref: spec.defaultLabel,
        componentType: spec.type,
        pins: spec.pins,
      },
    };
    set((s) => ({ nodes: [...s.nodes, node] }));
  },
  updateNodes: (updater) => set((s) => ({ nodes: updater(s.nodes) })),
  updateEdges: (updater) => set((s) => ({ edges: updater(s.edges) })),
  clear: () => set({ nodes: [], edges: [], nets: [] }),
  saveToLocalStorage: () => {
    const { nodes, edges } = get();
    const payload = JSON.stringify({ nodes, edges });
    localStorage.setItem('fluxai-lite', payload);
  },
  loadFromLocalStorage: () => {
    const raw = localStorage.getItem('fluxai-lite');
    if (!raw) return;
    try {
      const { nodes, edges } = JSON.parse(raw);
      set({ nodes, edges });
    } catch {}
  },
  exportJson: () => {
    const { nodes, edges } = get();
    download('fluxai-lite.json', JSON.stringify({ nodes, edges }, null, 2));
  },
  importJson: async (file) => {
    if (!file) return;
    const text = await file.text();
    try {
      const { nodes, edges } = JSON.parse(text);
      set({ nodes, edges });
    } catch {}
  },
  analyzeNets: () => {
    const { nodes, edges } = get();
    // Union-Find by nodeId:pinId
    const parent = new Map<string, string>();
    const keyFor = (nodeId: string, pinId: string) => `${nodeId}:${pinId}`;
    const find = (x: string): string => {
      if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
      return parent.get(x)!;
    };
    const union = (a: string, b: string) => {
      const ra = find(a), rb = find(b);
      if (ra !== rb) parent.set(rb, ra);
    };

    // initialize all pins
    for (const n of nodes) {
      for (const p of n.data.pins) {
        const k = keyFor(n.id, p.id);
        parent.set(k, k);
      }
    }
    // connect edges
    for (const e of edges) {
      const a = `${e.source}:${e.sourceHandle}`;
      const b = `${e.target}:${e.targetHandle}`;
      if (parent.has(a) && parent.has(b)) union(a, b);
    }
    // group
    const groups = new Map<string, { id: string; pins: { nodeId: string; ref: string; pin: string }[] }>();
    for (const n of nodes) {
      for (const p of n.data.pins) {
        const k = keyFor(n.id, p.id);
        if (!parent.has(k)) continue;
        const root = find(k);
        if (!groups.has(root)) groups.set(root, { id: `N${groups.size + 1}` , pins: [] });
        groups.get(root)!.pins.push({ nodeId: n.id, ref: n.data.ref, pin: p.label });
      }
    }
    set({ nets: Array.from(groups.values()) });
  },
}));
