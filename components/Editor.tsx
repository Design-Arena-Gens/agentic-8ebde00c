"use client";

import React, { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
  NodeProps,
  NodeTypes,
  OnConnect,
  EdgeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useEditorStore } from '@lib/store';
import { FluxNode, FluxNodeData } from '@lib/types';
import clsx from 'classnames';

function pinToHandlePosition(side: 'left' | 'right' | 'top' | 'bottom'): Position {
  switch (side) {
    case 'left': return Position.Left;
    case 'right': return Position.Right;
    case 'top': return Position.Top;
    case 'bottom': return Position.Bottom;
  }
}

const FluxNodeView: React.FC<NodeProps<FluxNodeData>> = ({ id, data, selected }) => {
  return (
    <div className={clsx('px-3 py-2 rounded border', selected ? 'border-accent' : 'border-border', 'bg-surface text-sm')}> 
      <div className="font-semibold mb-1">{data.ref} <span className="text-xs text-gray-400">({data.componentType})</span></div>
      <div className="relative">
        {/* pin handles */}
        {data.pins.map((p) => (
          <Handle
            key={p.id}
            id={p.id}
            type="source"
            position={pinToHandlePosition(p.side)}
            style={{ top: p.side === 'left' || p.side === 'right' ? 10 + p.order * 16 : undefined,
                     left: p.side === 'top' || p.side === 'bottom' ? 10 + p.order * 16 : undefined }}
          />
        ))}
        {data.pins.map((p) => (
          <Handle
            key={p.id + '-t'}
            id={p.id}
            type="target"
            position={pinToHandlePosition(p.side)}
            style={{ top: p.side === 'left' || p.side === 'right' ? 10 + p.order * 16 : undefined,
                     left: p.side === 'top' || p.side === 'bottom' ? 10 + p.order * 16 : undefined, opacity: 0 }}
          />
        ))}
        <div className="text-xs text-gray-300">
          {data.pins.map((p) => (
            <div key={p.id}>{p.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = { flux: FluxNodeView };

export function Editor() {
  const { nodes: storeNodes, edges: storeEdges, setGraph, addComponent, updateEdges } = useEditorStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
  const wrapperRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => setNodes(storeNodes), [storeNodes, setNodes]);
  React.useEffect(() => setEdges(storeEdges), [storeEdges, setEdges]);

  const onConnect: OnConnect = useCallback((params) => {
    const newEdges = addEdge({ ...params, type: 'default', animated: false }, edges);
    setEdges(newEdges);
    updateEdges(() => newEdges);
  }, [edges, setEdges, updateEdges]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const bounds = wrapperRef.current?.getBoundingClientRect();
    const raw = event.dataTransfer.getData('application/x-component');
    if (!raw || !bounds) return;
    const { type } = JSON.parse(raw) as { type: string };

    const position = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    addComponent(type, position);
  }, [addComponent]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  React.useEffect(() => {
    setGraph(nodes, edges);
  }, [nodes, edges, setGraph]);

  return (
    <div ref={wrapperRef} className="h-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes as unknown as FluxNode[]}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
}
