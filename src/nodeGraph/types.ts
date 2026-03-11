import type { Edge, Node } from '@xyflow/react';

export type AudioGraphNodeKind =
  | 'oscillator'
  | 'gain'
  | 'delay'
  | 'limiter'
  | 'compressor'
  | 'output';

export type AddableAudioGraphNodeKind = Exclude<AudioGraphNodeKind, 'output'>;

interface AudioNodeBaseParameter {
  key: string;
  label: string;
}

export interface AudioNodeNumericParameter extends AudioNodeBaseParameter {
  kind: 'number';
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface AudioNodeSelectParameter extends AudioNodeBaseParameter {
  kind: 'select';
  value: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

export type AudioNodeParameter = AudioNodeNumericParameter | AudioNodeSelectParameter;

export interface AudioGraphNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  parameters?: AudioNodeParameter[];
}

export type AudioGraphNode = Node<AudioGraphNodeData, AudioGraphNodeKind>;

export type AudioGraphEdge = Edge;
