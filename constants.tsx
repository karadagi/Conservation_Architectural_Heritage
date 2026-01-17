
import { ColorLegend, FloorPlanStage } from './types';

export const COLORS: ColorLegend[] = [
  { label: 'Pendentive', color: 'bg-[#BEFFBE]', hex: '#BEFFBE' },
  { label: 'Turkish triangle', color: 'bg-[#FFFFBE]', hex: '#FFFFBE' },
  { label: 'Tromp', color: 'bg-[#BEBEFF]', hex: '#BEBEFF' },
  { label: 'Dome', color: 'bg-[#000000]', hex: '#000000' },
  { label: 'Wall', color: 'bg-[#BEBEBE]', hex: '#BEBEBE' },
];

export const STAGES: FloorPlanStage[] = [
  { id: 'footprint', label: '(a) Incomplete Ruins', caption: 'Input: Fragmented ruins' },
  { id: 'zoning', label: '(b) Structural Elements', caption: 'Identifying missing structures' },
  { id: 'furnishing', label: '(c) Restitution', caption: 'Output: Complete restoration' },
];
