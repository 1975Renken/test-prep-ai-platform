export interface Agent {
  id: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: string[];
  initialize(): Promise<void>;
  execute(task: Task): Promise<TaskResult>;
  shutdown(): Promise<void>;
}

export enum AgentType {
  CODE_REVIEW = 'CODE_REVIEW',
  TESTING = 'TESTING',
  DEVOPS = 'DEVOPS',
  CONTENT_GENERATION = 'CONTENT_GENERATION',
  CONTENT_QUALITY = 'CONTENT_QUALITY',
  LEARNING_ANALYTICS = 'LEARNING_ANALYTICS',
  SUPPORT = 'SUPPORT',
  ONBOARDING = 'ONBOARDING',
  SEO = 'SEO',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  BUSINESS_INTELLIGENCE = 'BUSINESS_INTELLIGENCE',
  USER_BEHAVIOR = 'USER_BEHAVIOR'
}

export enum AgentStatus {
  IDLE = 'IDLE',
  BUSY = 'BUSY',
  ERROR = 'ERROR',
  OFFLINE = 'OFFLINE'
}

export interface Task {
  id: string;
  type: string;
  priority: number;
  data: any;
  dependencies?: string[];
  deadline?: Date;
}

export interface TaskResult {
  taskId: string;
  status: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  data: any;
  errors?: Error[];
  metrics?: {
    startTime: Date;
    endTime: Date;
    resourceUsage: any;
  };
}