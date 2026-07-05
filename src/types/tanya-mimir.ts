export interface AnalysisChart {
  kind: "bar" | "pie" | "line";
  title: string;
  points: { label: string; value: number; rowIds: string[] }[];
}

export interface AnalysisCluster {
  name: string;
  count: number;
  samples: string[];
  rowIds: string[];
}

export interface AnalysisStat {
  label: string;
  value: string;
}

export interface CleanupProposal {
  description: string;
  count: number;
  rowIds: string[];
}

export interface AnalysisMessage {
  id: string;
  role: "user" | "mimir";
  content: string;
  chart?: AnalysisChart;
  clusters?: AnalysisCluster[];
  stats?: AnalysisStat[];
  cleanup?: CleanupProposal;
}
