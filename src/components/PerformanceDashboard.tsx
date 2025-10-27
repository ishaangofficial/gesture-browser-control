import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PerformanceMetrics {
  latency: number;
  fps: number;
  confidence: number;
  predictionAccuracy: number;
  gesture: string;
  status: "ready" | "processing" | "error";
}

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
}

export const PerformanceDashboard = ({ metrics }: PerformanceDashboardProps) => {
  const getLatencyColor = (latency: number) => {
    if (latency < 30) return "text-green-500";
    if (latency < 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 90) return "text-green-500";
    if (confidence > 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-4 bg-black/80 border-cyan-500/30">
      <h3 className="text-lg font-bold text-cyan-400 mb-3">Performance Monitor</h3>
      
      <div className="space-y-3">
        {/* Latency */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Latency</span>
            <span className={`text-sm font-bold ${getLatencyColor(metrics.latency)}`}>
              {metrics.latency.toFixed(1)}ms
            </span>
          </div>
          <Progress value={Math.min((metrics.latency / 100) * 100, 100)} className="h-2" />
          <div className="text-xs text-gray-400 mt-1">Target: &lt;30ms</div>
        </div>

        {/* FPS */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Frame Rate</span>
            <span className={`text-sm font-bold ${metrics.fps >= 58 ? 'text-green-500' : 'text-yellow-500'}`}>
              {metrics.fps.toFixed(0)} FPS
            </span>
          </div>
          <Progress value={(metrics.fps / 60) * 100} className="h-2" />
          <div className="text-xs text-gray-400 mt-1">Target: 60 FPS</div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Confidence</span>
            <span className={`text-sm font-bold ${getConfidenceColor(metrics.confidence)}`}>
              {metrics.confidence.toFixed(0)}%
            </span>
          </div>
          <Progress value={metrics.confidence} className="h-2" />
          <div className="text-xs text-gray-400 mt-1">Min: 90% for actions</div>
        </div>

        {/* Prediction Accuracy */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Prediction Accuracy</span>
            <span className="text-sm font-bold text-cyan-400">
              {metrics.predictionAccuracy.toFixed(0)}%
            </span>
          </div>
          <Progress value={metrics.predictionAccuracy} className="h-2" />
          <div className="text-xs text-gray-400 mt-1">Target: &gt;85%</div>
        </div>

        {/* Current Gesture */}
        <div className="pt-2 border-t border-cyan-500/30">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Gesture</span>
            <span className="text-sm font-bold text-cyan-400">{metrics.gesture}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Status</span>
          <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
            metrics.status === 'ready' ? 'bg-green-500/20 text-green-400' :
            metrics.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {metrics.status}
          </span>
        </div>
      </div>
    </Card>
  );
};
