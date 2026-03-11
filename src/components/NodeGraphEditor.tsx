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
import DeleteIcon from '@mui/icons-material/Delete';
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
      { type: 'oscillator', label: 'Oscillator', description: 'Wave source' },
    ],
  },
  {
    category: 'Mixing',
    color: categoryColors.mixing,
    items: [{ type: 'gain', label: 'Gain', description: 'Volume stage and mixer' }],
  },
  {
    category: 'DSP',
    color: categoryColors.dsp,
    items: [
      { type: 'delay', label: 'Delay', description: 'Delay effect' },
      { type: 'compressor', label: 'Dynamics Compressor', description: 'Basic compressor effect' },
      { type: 'limiter', label: 'Limiter', description: 'Limiter to avoid clipping' },
    ],
  },
] as const;

const AUDIO_NODE_DRAG_TYPE = 'application/x-audio-node-type';

type TouchDragState = {
  nodeType: AddableAudioGraphNodeKind;
  nodeLabel: string;
  nodeColor: string;
  touchId: number;
  clientX: number;
  clientY: number;
};

type TouchDragPreview = {
  nodeLabel: string;
  nodeColor: string;
  clientX: number;
  clientY: number;
};

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
  const [selectedNodeIds, setSelectedNodeIds] = React.useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = React.useState<string[]>([]);
  const graphCanvasRef = React.useRef<HTMLDivElement | null>(null);
  const touchDragStateRef = React.useRef<TouchDragState | null>(null);
  const [touchDragPreview, setTouchDragPreview] = React.useState<TouchDragPreview | null>(null);

  const clearTouchDrag = () => {
    touchDragStateRef.current = null;
    setTouchDragPreview(null);
  };

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

  const addTouchNodeIfDroppedOnGraph = (
    nodeType: AddableAudioGraphNodeKind,
    clientX: number,
    clientY: number,
  ) => {
    if (!reactFlowInstanceRef.current || !graphCanvasRef.current) {
      return;
    }

    const graphBounds = graphCanvasRef.current.getBoundingClientRect();
    const droppedOnGraph =
      clientX >= graphBounds.left &&
      clientX <= graphBounds.right &&
      clientY >= graphBounds.top &&
      clientY <= graphBounds.bottom;

    if (!droppedOnGraph) {
      return;
    }

    const graphPosition = reactFlowInstanceRef.current.screenToFlowPosition({
      x: clientX,
      y: clientY,
    });

    onAddNode(nodeType, graphPosition);
  };

  const handlePaletteTouchStart = (
    event: React.TouchEvent<HTMLButtonElement>,
    nodeType: AddableAudioGraphNodeKind,
    nodeLabel: string,
    nodeColor: string,
  ) => {
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    event.preventDefault();
    touchDragStateRef.current = {
      nodeType,
      nodeLabel,
      nodeColor,
      touchId: touch.identifier,
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
    setTouchDragPreview({
      nodeLabel,
      nodeColor,
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  };

  const handlePaletteTouchMove = (event: React.TouchEvent<HTMLButtonElement>) => {
    const state = touchDragStateRef.current;
    if (!state) {
      return;
    }

    const activeTouch = Array.from(event.touches).find((touch) => touch.identifier === state.touchId);
    if (!activeTouch) {
      return;
    }

    event.preventDefault();
    touchDragStateRef.current = {
      ...state,
      clientX: activeTouch.clientX,
      clientY: activeTouch.clientY,
    };
    setTouchDragPreview({
      nodeLabel: state.nodeLabel,
      nodeColor: state.nodeColor,
      clientX: activeTouch.clientX,
      clientY: activeTouch.clientY,
    });
  };

  const handlePaletteTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    const state = touchDragStateRef.current;
    if (!state) {
      return;
    }

    const endedTouch = Array.from(event.changedTouches).find(
      (touch) => touch.identifier === state.touchId,
    );

    event.preventDefault();
    if (endedTouch) {
      addTouchNodeIfDroppedOnGraph(state.nodeType, endedTouch.clientX, endedTouch.clientY);
    } else {
      addTouchNodeIfDroppedOnGraph(state.nodeType, state.clientX, state.clientY);
    }

    clearTouchDrag();
  };

  const handlePaletteTouchCancel = () => {
    clearTouchDrag();
  };

  const handleDeleteSelection = () => {
    if (!reactFlowInstanceRef.current || (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0)) {
      return;
    }

    void reactFlowInstanceRef.current.deleteElements({
      nodes: selectedNodeIds.map((id) => ({ id })),
      edges: selectedEdgeIds.map((id) => ({ id })),
    });
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
                onTouchStart={(event) =>
                  handlePaletteTouchStart(
                    event,
                    paletteNode.type,
                    paletteNode.label,
                    categoryGroup.color,
                  )
                }
                onTouchMove={handlePaletteTouchMove}
                onTouchEnd={handlePaletteTouchEnd}
                onTouchCancel={handlePaletteTouchCancel}
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
        ref={graphCanvasRef}
        onDrop={handleGraphDrop}
        onDragOver={handleGraphDragOver}
      >
        <button
          type="button"
          className="node-graph-delete-button"
          aria-label="Delete selected nodes or edges"
          disabled={selectedNodeIds.length === 0 && selectedEdgeIds.length === 0}
          onClick={handleDeleteSelection}
        >
          <DeleteIcon fontSize="small" />
        </button>

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
          onSelectionChange={({ nodes: selectedNodes, edges: selectedEdges }) => {
            setSelectedNodeIds(selectedNodes.map((node) => node.id));
            setSelectedEdgeIds(selectedEdges.map((edge) => edge.id));
          }}
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

      {touchDragPreview && (
        <div
          className="node-palette-touch-preview"
          style={{
            left: touchDragPreview.clientX,
            top: touchDragPreview.clientY,
            borderColor: touchDragPreview.nodeColor,
            boxShadow: `0 10px 20px ${touchDragPreview.nodeColor}55`,
          }}
        >
          {touchDragPreview.nodeLabel}
        </div>
      )}
    </div>
  );
};

export default NodeGraphEditor;
