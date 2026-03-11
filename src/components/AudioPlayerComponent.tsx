import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type IsValidConnection,
  type NodeChange,
} from '@xyflow/react';
import audioPlayerTheme, { audioPlayerGradients } from '../audioPlayerTheme';
import NodeGraphEditor from './NodeGraphEditor';
import { initialAudioGraphEdges, initialAudioGraphNodes } from '../nodeGraph/initialGraph';
import { WebAudioGraphEngine } from '../nodeGraph/audioEngine';
import type {
  AddableAudioGraphNodeKind,
  AudioNodeParameter,
  AudioNodeNumericParameter,
  AudioNodeSelectParameter,
  AudioGraphEdge,
  AudioGraphNode,
} from '../nodeGraph/types';
import './AudioPlayerComponent.css';

const isProcessingNodeType = (
  nodeType: AudioGraphNode['type'],
): nodeType is 'gain' | 'delay' | 'limiter' | 'compressor' =>
  nodeType === 'gain' ||
  nodeType === 'delay' ||
  nodeType === 'limiter' ||
  nodeType === 'compressor';

const findNumericParameter = (
  parameters: AudioNodeParameter[] | undefined,
  key: string,
): AudioNodeNumericParameter | undefined =>
  parameters?.find(
    (parameter): parameter is AudioNodeNumericParameter =>
      parameter.kind === 'number' && parameter.key === key,
  );

const findSelectParameter = (
  parameters: AudioNodeParameter[] | undefined,
  key: string,
): AudioNodeSelectParameter | undefined =>
  parameters?.find(
    (parameter): parameter is AudioNodeSelectParameter =>
      parameter.kind === 'select' && parameter.key === key,
  );

const AudioPlayerComponent: React.FC = () => {
  const audioEngineRef = useRef<WebAudioGraphEngine>(new WebAudioGraphEngine());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [nodes, setNodes] = useState<AudioGraphNode[]>(() =>
    initialAudioGraphNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        parameters: node.data.parameters?.map((parameter) => ({ ...parameter })),
      },
    })),
  );
  const [edges, setEdges] = useState<AudioGraphEdge[]>(() =>
    initialAudioGraphEdges.map((edge) => ({ ...edge })),
  );

  const hasPath = (
    startNodeId: string,
    endNodeId: string,
    edgeList: AudioGraphEdge[],
  ): boolean => {
    const adjacencyMap = new Map<string, string[]>();
    for (const edge of edgeList) {
      const targets = adjacencyMap.get(edge.source) ?? [];
      targets.push(edge.target);
      adjacencyMap.set(edge.source, targets);
    }

    const stack = [startNodeId];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const currentNodeId = stack.pop();
      if (!currentNodeId || visited.has(currentNodeId)) {
        continue;
      }

      if (currentNodeId === endNodeId) {
        return true;
      }

      visited.add(currentNodeId);

      const neighbors = adjacencyMap.get(currentNodeId);
      if (neighbors) {
        stack.push(...neighbors);
      }
    }

    return false;
  };

  const validateConnection = (
    connection: Connection | AudioGraphEdge,
    existingEdges: AudioGraphEdge[],
  ): string | null => {
    if (!connection.source || !connection.target) {
      return 'Connections require both a source and target node.';
    }

    if (connection.source === connection.target) {
      return 'A node cannot connect to itself.';
    }

    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) {
      return 'Connection references an unknown node.';
    }

    const outputNodeCount = nodes.filter((node) => node.type === 'output').length;
    if (outputNodeCount !== 1) {
      return 'Graph must contain exactly one output node.';
    }

    if (sourceNode.type === 'output') {
      return 'Output node cannot be used as a source.';
    }

    if (targetNode.type === 'oscillator') {
      return 'Oscillator nodes cannot receive incoming connections.';
    }

    const isAllowedPair =
      (sourceNode.type === 'oscillator' &&
        (isProcessingNodeType(targetNode.type) || targetNode.type === 'output')) ||
      (isProcessingNodeType(sourceNode.type) &&
        (isProcessingNodeType(targetNode.type) || targetNode.type === 'output'));

    if (!isAllowedPair) {
      return 'Only oscillator/processor to processor/output connections are allowed.';
    }

    const duplicateEdge = existingEdges.some(
      (edge) => edge.source === connection.source && edge.target === connection.target,
    );

    if (duplicateEdge) {
      return 'That connection already exists.';
    }

    const candidateEdges = [
      ...existingEdges,
      {
        id: `${connection.source}_to_${connection.target}`,
        source: connection.source,
        target: connection.target,
      },
    ];

    if (hasPath(connection.target, connection.source, candidateEdges)) {
      return 'Connection would create a cycle. Use a forward chain toward Output.';
    }

    return null;
  };

  const buildSubtitle = (
    nodeType: AudioGraphNode['type'],
    parameters: AudioNodeParameter[] | undefined,
    fallback: string,
  ): string => {
    if (!parameters) {
      return fallback;
    }

    if (nodeType === 'oscillator') {
      const frequency = findNumericParameter(parameters, 'frequency');
      const waveform = findSelectParameter(parameters, 'waveform');
      if (frequency) {
        const waveformLabel = waveform
          ? waveform.options.find((option) => option.value === waveform.value)?.label.toLowerCase() ??
            waveform.value
          : 'sine';
        return `${Math.round(frequency.value)} Hz ${waveformLabel} source`;
      }
    }

    if (nodeType === 'gain') {
      const gain = findNumericParameter(parameters, 'gain');
      if (gain) {
        return `Volume ${gain.value.toFixed(2)}`;
      }
    }

    if (nodeType === 'delay') {
      const delayTime = findNumericParameter(parameters, 'time');
      if (delayTime) {
        return `${delayTime.value.toFixed(2)} s delay`;
      }
    }

    if (nodeType === 'limiter') {
      const threshold = findNumericParameter(parameters, 'threshold');
      if (threshold) {
        return `Threshold ${threshold.value.toFixed(1)} dB`;
      }
    }

    if (nodeType === 'compressor') {
      const ratio = findNumericParameter(parameters, 'ratio');
      if (ratio) {
        return `Ratio ${ratio.value.toFixed(1)}:1`;
      }
    }

    return fallback;
  };

  const getNextNodeId = (
    nodeType: AddableAudioGraphNodeKind,
    currentNodes: AudioGraphNode[],
  ): string => {
    const nodePrefixMap: Record<AddableAudioGraphNodeKind, string> = {
      oscillator: 'osc',
      gain: 'gain',
      delay: 'delay',
      limiter: 'limiter',
      compressor: 'comp',
    };
    const nodePrefix = nodePrefixMap[nodeType];
    let highestIndex = 0;

    for (const node of currentNodes) {
      if (node.type !== nodeType) {
        continue;
      }

      const nodeIdMatch = node.id.match(/-(\d+)$/);
      if (!nodeIdMatch) {
        continue;
      }

      const parsedIndex = Number(nodeIdMatch[1]);
      if (!Number.isNaN(parsedIndex)) {
        highestIndex = Math.max(highestIndex, parsedIndex);
      }
    }

    return `${nodePrefix}-${highestIndex + 1}`;
  };

  const createNodeData = (nodeType: AddableAudioGraphNodeKind): Pick<AudioGraphNode, 'type' | 'data'> => {
    if (nodeType === 'oscillator') {
      const parameters: AudioNodeParameter[] = [
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
      ];

      return {
        type: 'oscillator',
        data: {
          title: 'Oscillator',
          subtitle: buildSubtitle('oscillator', parameters, 'Sine source'),
          parameters,
        },
      };
    }

    if (nodeType === 'gain') {
      const parameters: AudioNodeParameter[] = [
        {
          key: 'gain',
          label: 'Gain',
          kind: 'number',
          value: 0.3,
          min: 0,
          max: 1,
          step: 0.01,
        },
      ];

      return {
        type: 'gain',
        data: {
          title: 'Gain',
          subtitle: buildSubtitle('gain', parameters, 'Volume stage'),
          parameters,
        },
      };
    }

    if (nodeType === 'delay') {
      const parameters: AudioNodeParameter[] = [
        {
          key: 'time',
          label: 'Time',
          kind: 'number',
          value: 0.25,
          min: 0,
          max: 2,
          step: 0.01,
          unit: 's',
        },
        {
          key: 'feedback',
          label: 'Feedback',
          kind: 'number',
          value: 0.3,
          min: 0,
          max: 0.95,
          step: 0.01,
        },
        {
          key: 'mix',
          label: 'Mix',
          kind: 'number',
          value: 0.35,
          min: 0,
          max: 1,
          step: 0.01,
        },
      ];

      return {
        type: 'delay',
        data: {
          title: 'Delay',
          subtitle: buildSubtitle('delay', parameters, 'Echo stage'),
          parameters,
        },
      };
    }

    if (nodeType === 'limiter') {
      const parameters: AudioNodeParameter[] = [
        {
          key: 'threshold',
          label: 'Threshold',
          kind: 'number',
          value: -6,
          min: -40,
          max: 0,
          step: 0.5,
          unit: 'dB',
        },
        {
          key: 'attack',
          label: 'Attack',
          kind: 'number',
          value: 0.003,
          min: 0,
          max: 0.1,
          step: 0.001,
          unit: 's',
        },
        {
          key: 'release',
          label: 'Release',
          kind: 'number',
          value: 0.08,
          min: 0.01,
          max: 1,
          step: 0.01,
          unit: 's',
        },
      ];

      return {
        type: 'limiter',
        data: {
          title: 'Limiter',
          subtitle: buildSubtitle('limiter', parameters, 'Peak control'),
          parameters,
        },
      };
    }

    const parameters: AudioNodeParameter[] = [
      {
        key: 'threshold',
        label: 'Threshold',
        kind: 'number',
        value: -24,
        min: -60,
        max: 0,
        step: 0.5,
        unit: 'dB',
      },
      {
        key: 'knee',
        label: 'Knee',
        kind: 'number',
        value: 30,
        min: 0,
        max: 40,
        step: 1,
        unit: 'dB',
      },
      {
        key: 'ratio',
        label: 'Ratio',
        kind: 'number',
        value: 12,
        min: 1,
        max: 20,
        step: 0.1,
      },
      {
        key: 'attack',
        label: 'Attack',
        kind: 'number',
        value: 0.003,
        min: 0,
        max: 1,
        step: 0.001,
        unit: 's',
      },
      {
        key: 'release',
        label: 'Release',
        kind: 'number',
        value: 0.25,
        min: 0.01,
        max: 1,
        step: 0.01,
        unit: 's',
      },
    ];

    return {
      type: 'compressor',
      data: {
        title: 'Dynamics Compressor',
        subtitle: buildSubtitle('compressor', parameters, 'Dynamic range control'),
        parameters,
      },
    };
  };

  useEffect(() => {
    return () => {
      void audioEngineRef.current.dispose();
    };
  }, []);

  const startTone = async () => {
    try {
      const outputNodeCount = nodes.filter((node) => node.type === 'output').length;
      if (outputNodeCount !== 1) {
        setAudioError('Graph must contain exactly one output node.');
        setIsPlaying(false);
        return;
      }

      await audioEngineRef.current.start(nodes, edges);
      setIsPlaying(true);
      setAudioError(null);
    } catch (error) {
      setAudioError('Failed to start audio playback.');
      console.error('Audio playback error:', error);
      setIsPlaying(false);
    }
  };

  const stopTone = () => {
    try {
      audioEngineRef.current.stop();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping audio:', error);
      setIsPlaying(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    void startTone();
  };

  const handlePointerUp = () => {
    stopTone();
  };

  const handlePointerLeave = () => {
    if (isPlaying) {
      stopTone();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isPlaying && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      void startTone();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      stopTone();
    }
  };

  const handleNodeParameterChange = (
    nodeId: string,
    parameterKey: string,
    value: number | string,
  ) => {
    setNodes((previousNodes) =>
      previousNodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }

        const updatedParameters = node.data.parameters?.map((parameter) => {
          if (parameter.key !== parameterKey) {
            return parameter;
          }

          if (parameter.kind === 'number' && typeof value === 'number') {
            return { ...parameter, value };
          }

          if (parameter.kind === 'select' && typeof value === 'string') {
            return { ...parameter, value };
          }

          return parameter;
        });

        return {
          ...node,
          data: {
            ...node.data,
            parameters: updatedParameters,
            subtitle: buildSubtitle(node.type, updatedParameters, node.data.subtitle),
          },
        };
      }),
    );

    audioEngineRef.current.updateNodeParameter(nodeId, parameterKey, value);
  };

  const handleAddNode = (
    nodeType: AddableAudioGraphNodeKind,
    position: { x: number; y: number },
  ) => {
    setNodes((previousNodes) => {
      const nextNodeId = getNextNodeId(nodeType, previousNodes);
      const nodeTemplate = createNodeData(nodeType);
      const nextNodes = [
        ...previousNodes,
        {
          id: nextNodeId,
          type: nodeTemplate.type,
          position,
          data: nodeTemplate.data,
        },
      ];

      if (isPlaying) {
        void audioEngineRef.current.start(nextNodes, edges).catch((error) => {
          setAudioError('Failed to update audio graph after adding a node.');
          console.error('Audio graph update error:', error);
          setIsPlaying(false);
        });
      }

      return nextNodes;
    });

    setAudioError(null);
  };

  const handleNodesChange = (changes: NodeChange<AudioGraphNode>[]) => {
    const removeChanges = changes.filter((change) => change.type === 'remove');

    if (removeChanges.length === 0) {
      setNodes((previousNodes) => applyNodeChanges(changes, previousNodes));
      return;
    }

    setNodes((previousNodes) => {
      const nodeById = new Map(previousNodes.map((node) => [node.id, node]));
      const blockedOutputRemovals = removeChanges.some(
        (change) => nodeById.get(change.id)?.type === 'output',
      );

      const filteredChanges = changes.filter(
        (change) => !(change.type === 'remove' && nodeById.get(change.id)?.type === 'output'),
      );

      if (blockedOutputRemovals) {
        setAudioError('Output node is fixed and cannot be deleted.');
      }

      const removableNodeIds = new Set(
        removeChanges
          .map((change) => change.id)
          .filter((id) => nodeById.get(id)?.type !== 'output'),
      );

      const nextNodes = applyNodeChanges(filteredChanges, previousNodes);

      if (removableNodeIds.size === 0) {
        return nextNodes;
      }

      setEdges((previousEdges) => {
        const nextEdges = previousEdges.filter(
          (edge) => !removableNodeIds.has(edge.source) && !removableNodeIds.has(edge.target),
        );

        if (isPlaying) {
          void audioEngineRef.current.start(nextNodes, nextEdges).catch((error) => {
            setAudioError('Failed to update audio graph after deleting a node.');
            console.error('Audio graph update error:', error);
            setIsPlaying(false);
          });
        }

        return nextEdges;
      });

      return nextNodes;
    });
  };

  const handleEdgesChange = (changes: EdgeChange<AudioGraphEdge>[]) => {
    setEdges((previousEdges) => {
      const nextEdges = applyEdgeChanges(changes, previousEdges);
      if (isPlaying) {
        audioEngineRef.current.updateConnections(nextEdges);
      }

      return nextEdges;
    });
  };

  const handleConnect = (connection: Connection) => {
    setEdges((previousEdges) => {
      const validationError = validateConnection(connection, previousEdges);
      if (validationError) {
        setAudioError(validationError);
        return previousEdges;
      }

      const nextEdges = addEdge(
        {
          ...connection,
          id: `${connection.source}_to_${connection.target}`,
          animated: true,
        },
        previousEdges,
      );

      if (isPlaying) {
        audioEngineRef.current.updateConnections(nextEdges);
      }

      setAudioError(null);
      return nextEdges;
    });
  };

  const isValidConnection: IsValidConnection<AudioGraphEdge> = (connection) =>
    validateConnection(connection, edges) === null;

  return (
    <ThemeProvider theme={audioPlayerTheme}>
      <Box
        component="section"
        className="audio-player-section"
        sx={{
          py: 10,
          background: audioPlayerGradients.darkMystic,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: audioPlayerGradients.cosmicPurple,
            opacity: 0.1,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ 
              mb: 2,
              background: audioPlayerGradients.whiteSubtle,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}
          >
            SDK Designer Demo
          </Typography>

          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 5,
              color: 'text.primary',
              opacity: 0.9,
            }}
          >
            Design your own audio processing SDK by dragging and connecting nodes in the graph below.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 920,
                background: 'rgba(10, 26, 40, 0.75)',
                borderRadius: 3,
                border: '1px solid rgba(115, 183, 242, 0.28)',
                backdropFilter: 'blur(12px)',
                p: { xs: 1.5, md: 2 },
              }}
            >
              <NodeGraphEditor
                nodes={nodes}
                edges={edges}
                onNodeParameterChange={handleNodeParameterChange}
                onConnect={handleConnect}
                onEdgesChange={handleEdgesChange}
                onNodesChange={handleNodesChange}
                onAddNode={handleAddNode}
                isValidConnection={isValidConnection}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              sx={{
                minWidth: 260,
                minHeight: 62,
                fontSize: '1.25rem',
                background: isPlaying
                  ? audioPlayerGradients.magentaPink
                  : audioPlayerGradients.vibrantAction,
                border: '2px solid',
                borderColor: isPlaying ? '#CC73CD' : '#B54348',
                boxShadow: isPlaying
                  ? '0 8px 32px rgba(175, 36, 158, 0.5), 0 0 40px rgba(204, 115, 205, 0.3)'
                  : '0 8px 24px rgba(181, 67, 72, 0.4)',
                '&:hover': {
                  background: isPlaying
                    ? audioPlayerGradients.magentaPink
                    : audioPlayerGradients.vibrantAction,
                  boxShadow: isPlaying
                    ? '0 12px 40px rgba(175, 36, 158, 0.6), 0 0 50px rgba(204, 115, 205, 0.4)'
                    : '0 12px 32px rgba(181, 67, 72, 0.5)',
                },
                '&:active': {
                  transform: 'scale(0.99)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
              }}
            >
              {isPlaying ? 'Playing (hold)' : 'Hold to Play'}
            </Button>

            {audioError && (
              <Box
                sx={{
                  background: audioPlayerGradients.vibrantAction,
                  borderRadius: 2,
                  padding: 2,
                  border: '1px solid',
                  borderColor: 'error.main',
                }}
              >
                <Typography variant="body2" color="error.contrastText" align="center">
                  Warning: {audioError}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AudioPlayerComponent;
