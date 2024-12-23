import { EventEmitter } from 'events';
import { Agent, AgentType, AgentStatus, Task, TaskResult } from '../types';

export class AgentOrchestrator extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private taskQueue: Task[] = [];
  private activeJobs: Map<string, { task: Task; agent: Agent }> = new Map();
  
  constructor() {
    super();
    this.initialize();
  }

  private async initialize() {
    this.setupMonitoring();
    this.initializeTaskScheduler();
    this.setupCommunicationChannels();
  }

  public async registerAgent(agent: Agent): Promise<void> {
    try {
      await agent.initialize();
      this.agents.set(agent.id, agent);
      this.emit('agent:registered', { agentId: agent.id, type: agent.type });
    } catch (error) {
      this.emit('agent:error', { agentId: agent.id, error });
    }
  }

  public async submitTask(task: Task): Promise<void> {
    this.taskQueue.push(task);
    this.emit('task:submitted', { taskId: task.id });
    await this.processTaskQueue();
  }

  private async processTaskQueue() {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => agent.status === AgentStatus.IDLE);
    
    for (const agent of availableAgents) {
      const task = this.findSuitableTask(agent);
      if (task) {
        await this.assignTask(agent, task);
      }
    }
  }

  private findSuitableTask(agent: Agent): Task | null {
    return this.taskQueue
      .filter(task => this.canAgentHandleTask(agent, task))
      .sort((a, b) => b.priority - a.priority)[0] || null;
  }

  private canAgentHandleTask(agent: Agent, task: Task): boolean {
    return agent.capabilities.includes(task.type);
  }

  private async assignTask(agent: Agent, task: Task) {
    try {
      this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
      this.activeJobs.set(task.id, { task, agent });
      
      const result = await agent.execute(task);
      this.emit('task:complete', { taskId: task.id, result });
    } catch (error) {
      this.emit('task:error', { taskId: task.id, error });
    }
  }
}