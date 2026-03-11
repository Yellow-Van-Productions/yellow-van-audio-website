import React from 'react';
import {
  Background,
  type Connection,
  Controls,
  Handle,
  type ReactFlowInstance,
  type IsValidConnection,
  Position,
  ReactFlow,
  type EdgeChange,
  type NodeChange,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import type {
  AddableAudioGraphNodeKind,
  AudioGraphEdge,
  AudioGraphNode,
} from '../nodeGraph/types';
import '@xyflow/react/dist/style.css';
import './NodeGraphEditor.css';

interface NodeGraphEditorProps {
  nodes: AudioGraphNode[];
  edges: AudioGraphEdge[];
  onNodeParameterChange: (
    nodeId: string,
    parameterKey: string,
    value: number | string,
  ) => void;
  onConnect: (connection: Connection) => void;
  onEdgesChange: (changes: EdgeChange<AudioGraphEdge>[]) => void;
  onNodesChange: (changes: NodeChange<AudioGraphNode>[]) => void;
  onAddNode: (
    nodeType: AddableAudioGraphNodeKind,
    position: { x: number; y: number },
  ) => void;
  isValidConnection: IsValidConnection<AudioGraphEdge>;
}

const categoryColors = {
  source: '#73B7F2',
  mixing: '#5945D0',
  dsp: '#AF249E',
  output: '#B54348',
} as const;

const paletteCategories = [
  {
    category: 'Source',
    color: categoryColors.source,
    items: [
      { type: 'oscillator', label: 'Oscillator', description: 'Sine source with frequency control' },
    ],
  },
  {
    category: 'Mixing',
    color: categoryColors.mixing,
    items: [{ type: 'gain', label: 'Gain', description: 'Volume stage and signal mixer' }],
  },
  {
    category: 'DSP',
    color: categoryColors.dsp,
    items: [
      { type: 'delay', label: 'Delay', description: 'Echo stage with time, feedback, and mix' },
      { type: 'compressor', label: 'Dynamics Compressor', description: 'Threshold, knee, ratio, attack, and release' },
      { type: 'limiter', label: 'Limiter', description: 'Peak control with fast compressor settings' },
    ],
  },
] as const;

const AUDIO_NODE_DRAG_TYPE = 'application/x-audio-node-type';

const isAddableNodeType = (value: string): value is AddableAudioGraphNodeKind =>
  value === 'oscillator' ||
  value === 'gain' ||
  value === 'delay' ||
  value === 'limiter' ||
  value === 'compressor';

const createNodeCardStyle = (background: string, borderColor: string): React.CSSProperties => ({
  background,
  border: `1px solid ${borderColor}`,
  borderRadius: 10,
  color: '#d7e9f8',
  minWidth: 170,
  padding: '10px 12px',
  boxShadow: '0 8px 18px rgba(0, 0, 0, 0.3)',
});

const sourceNodeCardStyle = createNodeCardStyle('rgba(24, 13, 83, 0.82)', categoryColors.source);
const mixingNodeCardStyle = createNodeCardStyle('rgba(12, 6, 46, 0.86)', categoryColors.mixing);
const dspNodeCardStyle = createNodeCardStyle('rgba(63, 16, 73, 0.78)', categoryColors.dsp);
const outputNodeCardStyle = createNodeCardStyle('rgba(58, 18, 28, 0.9)', categoryColors.output);

const nodeTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 4,
};

const nodeSubtitleStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#9fc2dc',
};

type GraphNodeViewData = AudioGraphNode['data'] & {
  onParameterChange?: (
    nodeId: string,
    parameterKey: string,
    value: number | string,
  ) => void;
};

const renderParameterValue = (value: number, unit?: string): string => {
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return unit ? `${rounded} ${unit}` : rounded;
};

const stopInteractionPropagation = (
  event:
    | React.PointerEvent<HTMLElement>
    | React.MouseEvent<HTMLElement>
    | React.TouchEvent<HTMLElement>,
) => {
  event.stopPropagation();
};

const NodeBody: React.FC<NodeProps<AudioGraphNode>> = ({ id, data }) => {
  const viewData = data as GraphNodeViewData;

  return (
    <>
      <div style={nodeTitleStyle}>{viewData.title}</div>
      <div style={nodeSubtitleStyle}>{viewData.subtitle}</div>

      {viewData.parameters && viewData.parameters.length > 0 && (
        <div className="node-parameter-list">
          {viewData.parameters.map((parameter) => (
            <div key={parameter.key} className="node-parameter-item nodrag nopan">
              <div className="node-parameter-row">
                <span>{parameter.label}</span>
                <span>
                  {parameter.kind === 'number'
                    ? renderParameterValue(parameter.value, parameter.unit)
                    : parameter.options.find((option) => option.value === parameter.value)?.label ??
                      parameter.value}
                </span>
              </div>
              {parameter.kind === 'number' ? (
                <input
                  className="node-parameter-slider nodrag nopan"
                  type="range"
                  min={parameter.min}
                  max={parameter.max}
                  step={parameter.step}
                  value={parameter.value}
                  onPointerDown={stopInteractionPropagation}
                  onMouseDown={stopInteractionPropagation}
                  onTouchStart={stopInteractionPropagation}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    viewData.onParameterChange?.(id, parameter.key, nextValue);
                  }}
                />
              ) : (
                <select
                  className="node-parameter-select nodrag nopan"
                  value={parameter.value}
                  onPointerDown={stopInteractionPropagation}
                  onMouseDown={stopInteractionPropagation}
                  onTouchStart={stopInteractionPropagation}
                  onChange={(event) => {
                    viewData.onParameterChange?.(id, parameter.key, event.target.value);
                  }}
                >
                  {parameter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const OscillatorNodeView: React.FC<NodeProps<AudioGraphNode>> = (props) => (
  <div style={sourceNodeCardStyle}>
    <Handle type="source" position={Position.Right} />
    <NodeBody {...props} />
  </div>
);

const GainNodeView: React.FC<NodeProps<AudioGraphNode>> = (props) => (
  <div style={mixingNodeCardStyle}>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <NodeBody {...props} />
  </div>
);

const ProcessingNodeView: React.FC<NodeProps<AudioGraphNode>> = (props) => (
  <div style={dspNodeCardStyle}>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <NodeBody {...props} />
  </div>
);

const OutputNodeView: React.FC<NodeProps<AudioGraphNode>> = (props) => (
  <div style={outputNodeCardStyle}>
    <Handle type="target" position={Position.Left} />
    <NodeBody {...props} />
  </div>
);

const nodeTypes: NodeTypes = {
  oscillator: OscillatorNodeView,
  gain: GainNodeView,
  delay: ProcessingNodeView,
  limiter: ProcessingNodeView,
  compressor: ProcessingNodeView,
  output: OutputNodeView,
};

const NodeGraphEditor: React.FC<NodeGraphEditorProps> = ({
  nodes,
  edges,
  onNodeParameterChange,
  onConnect,
  onEdgesChange,
  onNodesChange,
  onAddNode,
  isValidConnection,
}) => {
  const reactFlowInstanceRef = React.useRef<ReactFlowInstance<AudioGraphNode, AudioGraphEdge> | null>(
    null,
  );

  const handlePaletteDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: AddableAudioGraphNodeKind,
  ) => {
    event.dataTransfer.setData(AUDIO_NODE_DRAG_TYPE, nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleGraphDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleGraphDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const droppedType = event.dataTransfer.getData(AUDIO_NODE_DRAG_TYPE);
    if (!isAddableNodeType(droppedType) || !reactFlowInstanceRef.current) {
      return;
    }

    const graphPosition = reactFlowInstanceRef.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    onAddNode(droppedType, graphPosition);
  };

  const nodesWithHandlers = React.useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onParameterChange: onNodeParameterChange,
        },
      })),
    [nodes, onNodeParameterChange],
  );

  return (
    <div className="node-graph-editor-shell">
      <aside className="node-palette" aria-label="Node palette">
        <div className="node-palette-title">Node Bay</div>
        <div className="node-palette-subtitle">Drag into graph</div>
        {paletteCategories.map((categoryGroup) => (
          <section key={categoryGroup.category} className="node-palette-category-group">
            <div
              className="node-palette-category-header"
              style={{
                color: categoryGroup.color,
                borderColor: categoryGroup.color,
              }}
            >
              {categoryGroup.category}
            </div>

            {categoryGroup.items.map((paletteNode) => (
              <button
                key={paletteNode.type}
                type="button"
                className="node-palette-item"
                style={{
                  borderColor: categoryGroup.color,
                  boxShadow: `inset 0 0 0 1px ${categoryGroup.color}1A`,
                }}
                draggable
                onDragStart={(event) => handlePaletteDragStart(event, paletteNode.type)}
              >
                <span className="node-palette-item-title">{paletteNode.label}</span>
                <span className="node-palette-item-description">{paletteNode.description}</span>
              </button>
            ))}
          </section>
        ))}
      </aside>

      <div
        className="node-graph-canvas"
        onDrop={handleGraphDrop}
        onDragOver={handleGraphDragOver}
      >
        <ReactFlow<AudioGraphNode, AudioGraphEdge>
          nodes={nodesWithHandlers}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={(instance) => {
            reactFlowInstanceRef.current = instance;
          }}
          onConnect={onConnect}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          isValidConnection={isValidConnection}
          fitView
          nodesDraggable
          nodesConnectable
          deleteKeyCode={['Backspace', 'Delete']}
          elementsSelectable
          selectNodesOnDrag={false}
          nodesFocusable
          edgesFocusable
          panOnDrag={true}
          zoomOnScroll={false}
        >
          <Controls showInteractive={false} />
          <Background gap={20} size={1} color="#335066" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default NodeGraphEditor;
