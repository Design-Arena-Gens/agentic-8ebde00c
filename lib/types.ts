import { Edge, Node } from 'reactflow';

export type ComponentType = 'battery' | 'resistor' | 'led' | 'ground' | 'capacitor';

export type Pin = {
  id: string; // unique within node
  label: string;
  side: 'left' | 'right' | 'top' | 'bottom';
  order: number; // order along side
};

export type ComponentSpec = {
  type: ComponentType;
  name: string;
  icon: string;
  pins: Pin[];
  defaultLabel: string;
};

export type FluxNodeData = {
  ref: string; // R1, D1 etc
  componentType: ComponentType;
  pins: Pin[];
};

export type FluxNode = Node<FluxNodeData>;
export type FluxEdge = Edge;

export type NetPinRef = { nodeId: string; ref: string; pin: string };
export type Net = { id: string; pins: NetPinRef[] };
