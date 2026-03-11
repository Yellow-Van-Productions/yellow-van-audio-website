import type { AudioGraphEdge, AudioGraphNode } from './types';

export const initialAudioGraphNodes: AudioGraphNode[] = [
  {
    id: 'osc-1',
    type: 'oscillator',
    position: { x: 80, y: 120 },
    data: {
      title: 'Oscillator',
      subtitle: '440 Hz sine source',
      parameters: [
        {
          key: 'waveform',
          label: 'Waveform',
          kind: 'select',
          value: 'sine',
          options: [
            { label: 'Sine', value: 'sine' },
            { label: 'Square', value: 'square' },
            { label: 'Sawtooth', value: 'sawtooth' },
            { label: 'Triangle', value: 'triangle' },
          ],
        },
        {
          key: 'frequency',
          label: 'Frequency',
          kind: 'number',
          value: 440,
          min: 20,
          max: 2000,
          step: 1,
          unit: 'Hz',
        },
      ],
    },
  },
  {
    id: 'gain-1',
    type: 'gain',
    position: { x: 360, y: 120 },
    data: {
      title: 'Gain',
      subtitle: 'Volume 0.3',
      parameters: [
        {
          key: 'gain',
          label: 'Gain',
          kind: 'number',
          value: 0.3,
          min: 0,
          max: 1,
          step: 0.01,
        },
      ],
    },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 640, y: 120 },
    data: {
      title: 'Output',
      subtitle: 'Audio output device',
    },
  },
];

export const initialAudioGraphEdges: AudioGraphEdge[] = [
  {
    id: 'osc-1_to_gain-1',
    source: 'osc-1',
    target: 'gain-1',
    animated: true,
  },
  {
    id: 'gain-1_to_output-1',
    source: 'gain-1',
    target: 'output-1',
    animated: true,
  },
];
