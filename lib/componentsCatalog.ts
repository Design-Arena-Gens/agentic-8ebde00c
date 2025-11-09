import { ComponentSpec } from './types';

export const componentsCatalog: ComponentSpec[] = [
  {
    type: 'battery',
    name: 'Battery',
    icon: '??',
    defaultLabel: 'BAT1',
    pins: [
      { id: 'pos', label: '+', side: 'right', order: 0 },
      { id: 'neg', label: '-', side: 'left', order: 0 },
    ],
  },
  {
    type: 'resistor',
    name: 'Resistor',
    icon: '??',
    defaultLabel: 'R1',
    pins: [
      { id: 'a', label: 'A', side: 'left', order: 0 },
      { id: 'b', label: 'B', side: 'right', order: 0 },
    ],
  },
  {
    type: 'led',
    name: 'LED',
    icon: '??',
    defaultLabel: 'D1',
    pins: [
      { id: 'anode', label: 'A', side: 'left', order: 0 },
      { id: 'cathode', label: 'K', side: 'right', order: 0 },
    ],
  },
  {
    type: 'ground',
    name: 'Ground',
    icon: '?',
    defaultLabel: 'GND',
    pins: [
      { id: 'g', label: 'G', side: 'top', order: 0 },
    ],
  },
  {
    type: 'capacitor',
    name: 'Capacitor',
    icon: '??',
    defaultLabel: 'C1',
    pins: [
      { id: 'a', label: 'A', side: 'left', order: 0 },
      { id: 'b', label: 'B', side: 'right', order: 0 },
    ],
  },
];
