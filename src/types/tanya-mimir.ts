export interface AnalysisChart {
  kind: "bar" | "pie" | "line";
  title: string;
  points: { label: string; value: number }[];
}

export interface AnalysisCluster {
  name: string;
  count: number;
  samples: string[];
}

export interface AnalysisStat {
  label: string;
  value: string;
}

export interface CleanupProposal {
  description: string;
  count: number;
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
