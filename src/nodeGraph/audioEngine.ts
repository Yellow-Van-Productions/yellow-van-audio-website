import type { AudioGraphEdge, AudioGraphNode, AudioNodeParameter } from './types';

type WindowWithWebkitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

abstract class RuntimeAudioNode {
  protected readonly context: AudioContext;
  public readonly id: string;

  protected constructor(id: string, context: AudioContext) {
    this.id = id;
    this.context = context;
  }

  public start(_time: number): void {
    // Optional lifecycle hook.
  }

  public stop(_time: number): void {
    // Optional lifecycle hook.
  }

  public disconnect(): void {
    this.getOutputNode()?.disconnect();
  }

  public connectTo(targetNode: RuntimeAudioNode): boolean {
    const source = this.getOutputNode();
    const destination = targetNode.getInputNode();

    if (!source || !destination) {
      return false;
    }

    source.connect(destination);
    return true;
  }

  public disconnectFrom(targetNode: RuntimeAudioNode): boolean {
    const source = this.getOutputNode();
    const destination = targetNode.getInputNode();

    if (!source || !destination) {
      return false;
    }

    try {
      source.disconnect(destination);
      return true;
    } catch {
      return false;
    }
  }

  public applyParameters(parameters: AudioNodeParameter[] | undefined): void {
    if (!parameters) {
      return;
    }

    for (const parameter of parameters) {
      this.setParameter(parameter.key, parameter.value);
    }
  }

  public abstract setParameter(key: string, value: number | string): boolean;
  protected abstract getInputNode(): AudioNode | null;
  protected abstract getOutputNode(): AudioNode | null;
}

class OscillatorRuntimeNode extends RuntimeAudioNode {
  private oscillatorNode: OscillatorNode | null = null;
  private frequency = 440;
  private waveform: OscillatorType = 'sine';

  public constructor(id: string, context: AudioContext) {
    super(id, context);
  }

  public start(time: number): void {
    const oscillator = this.context.createOscillator();
    oscillator.type = 'sine';
    oscillator.type = this.waveform;
    oscillator.frequency.setValueAtTime(this.frequency, time);
    oscillator.start(time);
    this.oscillatorNode = oscillator;
  }

  public stop(time: number): void {
    if (!this.oscillatorNode) {
      return;
    }

    try {
      this.oscillatorNode.stop(time + 0.02);
    } catch {
      // Ignore invalid state errors if the oscillator has already stopped.
    }
  }

  public setParameter(key: string, value: number | string): boolean {
    if (key === 'frequency' && typeof value === 'number') {
      this.frequency = value;
      if (this.oscillatorNode) {
        this.oscillatorNode.frequency.setValueAtTime(value, this.context.currentTime);
      }

      return true;
    }

    if (
      key === 'waveform' &&
      typeof value === 'string' &&
      (value === 'sine' || value === 'square' || value === 'sawtooth' || value === 'triangle')
    ) {
      this.waveform = value;
      if (this.oscillatorNode) {
        this.oscillatorNode.type = value;
      }

      return true;
    }

    return false;
  }

  protected getInputNode(): AudioNode | null {
    return null;
  }

  protected getOutputNode(): AudioNode | null {
    return this.oscillatorNode;
  }
}

class GainRuntimeNode extends RuntimeAudioNode {
  private readonly gainNode: GainNode;
  private gainValue = 0.3;

  public constructor(id: string, context: AudioContext) {
    super(id, context);
    this.gainNode = context.createGain();
    this.gainNode.gain.setValueAtTime(this.gainValue, context.currentTime);
  }

  public stop(time: number): void {
    this.gainNode.gain.cancelScheduledValues(time);
    this.gainNode.gain.setValueAtTime(Math.max(this.gainNode.gain.value, 0.001), time);
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
  }

  public setParameter(key: string, value: number | string): boolean {
    if (key !== 'gain' || typeof value !== 'number') {
      return false;
    }

    this.gainValue = value;
    this.gainNode.gain.setValueAtTime(value, this.context.currentTime);
    return true;
  }

  protected getInputNode(): AudioNode | null {
    return this.gainNode;
  }

  protected getOutputNode(): AudioNode | null {
    return this.gainNode;
  }
}

class DelayRuntimeNode extends RuntimeAudioNode {
  private readonly inputGainNode: GainNode;
  private readonly outputGainNode: GainNode;
  private readonly delayNode: DelayNode;
  private readonly feedbackGainNode: GainNode;
  private readonly wetGainNode: GainNode;
  private readonly dryGainNode: GainNode;

  private delayTime = 0.25;
  private feedback = 0.3;
  private mix = 0.35;

  public constructor(id: string, context: AudioContext) {
    super(id, context);

    this.inputGainNode = context.createGain();
    this.outputGainNode = context.createGain();
    this.delayNode = context.createDelay(2);
    this.feedbackGainNode = context.createGain();
    this.wetGainNode = context.createGain();
    this.dryGainNode = context.createGain();

    this.inputGainNode.connect(this.dryGainNode);
    this.dryGainNode.connect(this.outputGainNode);

    this.inputGainNode.connect(this.delayNode);
    this.delayNode.connect(this.wetGainNode);
    this.wetGainNode.connect(this.outputGainNode);

    this.delayNode.connect(this.feedbackGainNode);
    this.feedbackGainNode.connect(this.delayNode);

    this.applyMix(this.mix, context.currentTime);
    this.delayNode.delayTime.setValueAtTime(this.delayTime, context.currentTime);
    this.feedbackGainNode.gain.setValueAtTime(this.feedback, context.currentTime);
  }

  public disconnect(): void {
    this.inputGainNode.disconnect();
    this.delayNode.disconnect();
    this.feedbackGainNode.disconnect();
    this.wetGainNode.disconnect();
    this.dryGainNode.disconnect();
    this.outputGainNode.disconnect();
  }

  public setParameter(key: string, value: number | string): boolean {
    if (typeof value !== 'number') {
      return false;
    }

    const now = this.context.currentTime;

    if (key === 'time') {
      this.delayTime = value;
      this.delayNode.delayTime.setValueAtTime(value, now);
      return true;
    }

    if (key === 'feedback') {
      this.feedback = value;
      this.feedbackGainNode.gain.setValueAtTime(Math.min(value, 0.99), now);
      return true;
    }

    if (key === 'mix') {
      this.mix = value;
      this.applyMix(value, now);
      return true;
    }

    return false;
  }

  private applyMix(value: number, time: number): void {
    const clampedMix = Math.max(0, Math.min(1, value));
    this.wetGainNode.gain.setValueAtTime(clampedMix, time);
    this.dryGainNode.gain.setValueAtTime(1 - clampedMix, time);
  }

  protected getInputNode(): AudioNode | null {
    return this.inputGainNode;
  }

  protected getOutputNode(): AudioNode | null {
    return this.outputGainNode;
  }
}

class LimiterRuntimeNode extends RuntimeAudioNode {
  private readonly compressorNode: DynamicsCompressorNode;

  private threshold = -6;
  private attack = 0.003;
  private release = 0.08;

  public constructor(id: string, context: AudioContext) {
    super(id, context);
    this.compressorNode = context.createDynamicsCompressor();
    this.compressorNode.knee.setValueAtTime(0, context.currentTime);
    this.compressorNode.ratio.setValueAtTime(20, context.currentTime);
    this.compressorNode.threshold.setValueAtTime(this.threshold, context.currentTime);
    this.compressorNode.attack.setValueAtTime(this.attack, context.currentTime);
    this.compressorNode.release.setValueAtTime(this.release, context.currentTime);
  }

  public setParameter(key: string, value: number | string): boolean {
    if (typeof value !== 'number') {
      return false;
    }

    const now = this.context.currentTime;

    if (key === 'threshold') {
      this.threshold = value;
      this.compressorNode.threshold.setValueAtTime(value, now);
      return true;
    }

    if (key === 'attack') {
      this.attack = value;
      this.compressorNode.attack.setValueAtTime(value, now);
      return true;
    }

    if (key === 'release') {
      this.release = value;
      this.compressorNode.release.setValueAtTime(value, now);
      return true;
    }

    return false;
  }

  protected getInputNode(): AudioNode | null {
    return this.compressorNode;
  }

  protected getOutputNode(): AudioNode | null {
    return this.compressorNode;
  }
}

class CompressorRuntimeNode extends RuntimeAudioNode {
  private readonly compressorNode: DynamicsCompressorNode;

  private threshold = -24;
  private knee = 30;
  private ratio = 12;
  private attack = 0.003;
  private release = 0.25;

  public constructor(id: string, context: AudioContext) {
    super(id, context);
    this.compressorNode = context.createDynamicsCompressor();
    this.compressorNode.threshold.setValueAtTime(this.threshold, context.currentTime);
    this.compressorNode.knee.setValueAtTime(this.knee, context.currentTime);
    this.compressorNode.ratio.setValueAtTime(this.ratio, context.currentTime);
    this.compressorNode.attack.setValueAtTime(this.attack, context.currentTime);
    this.compressorNode.release.setValueAtTime(this.release, context.currentTime);
  }

  public setParameter(key: string, value: number | string): boolean {
    if (typeof value !== 'number') {
      return false;
    }

    const now = this.context.currentTime;

    if (key === 'threshold') {
      this.threshold = value;
      this.compressorNode.threshold.setValueAtTime(value, now);
      return true;
    }

    if (key === 'knee') {
      this.knee = value;
      this.compressorNode.knee.setValueAtTime(value, now);
      return true;
    }

    if (key === 'ratio') {
      this.ratio = value;
      this.compressorNode.ratio.setValueAtTime(value, now);
      return true;
    }

    if (key === 'attack') {
      this.attack = value;
      this.compressorNode.attack.setValueAtTime(value, now);
      return true;
    }

    if (key === 'release') {
      this.release = value;
      this.compressorNode.release.setValueAtTime(value, now);
      return true;
    }

    return false;
  }

  protected getInputNode(): AudioNode | null {
    return this.compressorNode;
  }

  protected getOutputNode(): AudioNode | null {
    return this.compressorNode;
  }
}

class OutputRuntimeNode extends RuntimeAudioNode {
  private readonly outputGainNode: GainNode;

  public constructor(id: string, context: AudioContext) {
    super(id, context);
    this.outputGainNode = context.createGain();
    this.outputGainNode.gain.setValueAtTime(1, context.currentTime);
    this.outputGainNode.connect(context.destination);
  }

  public setParameter(_key: string, _value: number | string): boolean {
    return false;
  }

  protected getInputNode(): AudioNode | null {
    return this.outputGainNode;
  }

  protected getOutputNode(): AudioNode | null {
    return this.outputGainNode;
  }
}

export class WebAudioGraphEngine {
  private audioContext: AudioContext | null = null;
  private runtimeNodes = new Map<string, RuntimeAudioNode>();
  private graphNodes = new Map<string, AudioGraphNode>();
  private runtimeConnections = new Set<string>();

  private static toEdgeKey(sourceId: string, targetId: string): string {
    return `${sourceId}__to__${targetId}`;
  }

  private static fromEdgeKey(edgeKey: string): { sourceId: string; targetId: string } {
    const [sourceId, targetId] = edgeKey.split('__to__');
    return { sourceId, targetId };
  }

  private connectEdge(sourceId: string, targetId: string): void {
    const sourceNode = this.runtimeNodes.get(sourceId);
    const targetNode = this.runtimeNodes.get(targetId);

    if (!sourceNode || !targetNode) {
      return;
    }

    const didConnect = sourceNode.connectTo(targetNode);
    if (didConnect) {
      this.runtimeConnections.add(WebAudioGraphEngine.toEdgeKey(sourceId, targetId));
    }
  }

  private disconnectEdge(sourceId: string, targetId: string): void {
    const edgeKey = WebAudioGraphEngine.toEdgeKey(sourceId, targetId);
    const sourceNode = this.runtimeNodes.get(sourceId);
    const targetNode = this.runtimeNodes.get(targetId);

    if (!sourceNode || !targetNode) {
      this.runtimeConnections.delete(edgeKey);
      return;
    }

    sourceNode.disconnectFrom(targetNode);
    this.runtimeConnections.delete(edgeKey);
  }

  private replaceGraphConnections(edges: AudioGraphEdge[]): void {
    const nextConnectionKeys = new Set(
      edges.map((edge) => WebAudioGraphEngine.toEdgeKey(edge.source, edge.target)),
    );

    for (const existingKey of this.runtimeConnections) {
      if (nextConnectionKeys.has(existingKey)) {
        continue;
      }

      const { sourceId, targetId } = WebAudioGraphEngine.fromEdgeKey(existingKey);
      this.disconnectEdge(sourceId, targetId);
    }

    for (const nextKey of nextConnectionKeys) {
      if (this.runtimeConnections.has(nextKey)) {
        continue;
      }

      const { sourceId, targetId } = WebAudioGraphEngine.fromEdgeKey(nextKey);
      this.connectEdge(sourceId, targetId);
    }
  }

  private createAudioContext(): AudioContext {
    if (this.audioContext) {
      return this.audioContext;
    }

    const compatibleWindow = window as WindowWithWebkitAudioContext;
    const AudioContextClass =
      compatibleWindow.AudioContext || compatibleWindow.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error('Web Audio API is not supported in this browser.');
    }

    this.audioContext = new AudioContextClass();

    return this.audioContext;
  }

  private createRuntimeNode(node: AudioGraphNode, context: AudioContext): RuntimeAudioNode {
    switch (node.type) {
      case 'oscillator':
        return new OscillatorRuntimeNode(node.id, context);
      case 'gain':
        return new GainRuntimeNode(node.id, context);
      case 'delay':
        return new DelayRuntimeNode(node.id, context);
      case 'limiter':
        return new LimiterRuntimeNode(node.id, context);
      case 'compressor':
        return new CompressorRuntimeNode(node.id, context);
      case 'output':
        return new OutputRuntimeNode(node.id, context);
      default:
        throw new Error(`Unsupported node type: ${String(node.type)}`);
    }
  }

  public async start(nodes: AudioGraphNode[], edges: AudioGraphEdge[]): Promise<void> {
    const context = this.createAudioContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    this.graphNodes = new Map(nodes.map((node) => [node.id, node]));

    this.stop();

    for (const node of nodes) {
      const runtimeNode = this.createRuntimeNode(node, context);
      runtimeNode.applyParameters(node.data.parameters);
      this.runtimeNodes.set(node.id, runtimeNode);
    }

    const now = context.currentTime;
    for (const runtimeNode of this.runtimeNodes.values()) {
      runtimeNode.start(now);
    }

    this.replaceGraphConnections(edges);
  }

  public updateNodeParameter(nodeId: string, parameterKey: string, value: number | string): void {
    const graphNode = this.graphNodes.get(nodeId);
    if (graphNode?.data.parameters) {
      graphNode.data.parameters = graphNode.data.parameters.map((parameter) =>
        parameter.key === parameterKey
          ? parameter.kind === 'number' && typeof value === 'number'
            ? { ...parameter, value }
            : parameter.kind === 'select' && typeof value === 'string'
              ? { ...parameter, value }
              : parameter
          : parameter,
      );
    }

    const runtimeNode = this.runtimeNodes.get(nodeId);
    runtimeNode?.setParameter(parameterKey, value);
  }

  public updateConnections(edges: AudioGraphEdge[]): void {
    if (this.runtimeNodes.size === 0) {
      return;
    }

    this.replaceGraphConnections(edges);
  }

  public stop(): void {
    if (!this.audioContext || this.runtimeNodes.size === 0) {
      return;
    }

    const context = this.audioContext;
    const now = context.currentTime;

    for (const runtimeNode of this.runtimeNodes.values()) {
      runtimeNode.stop(now);
    }

    for (const edgeKey of this.runtimeConnections) {
      const { sourceId, targetId } = WebAudioGraphEngine.fromEdgeKey(edgeKey);
      this.disconnectEdge(sourceId, targetId);
    }

    for (const runtimeNode of this.runtimeNodes.values()) {
      runtimeNode.disconnect();
    }

    this.runtimeNodes.clear();
    this.runtimeConnections.clear();
  }

  public async dispose(): Promise<void> {
    this.stop();

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
  }
}
