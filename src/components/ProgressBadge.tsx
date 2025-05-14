
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProgressBadgeProps {
  level: number;
  progress: number; // 0-100
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({ level, progress }) => {
  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="bg-primary/10 text-primary font-medium">
          Level {level}
        </Badge>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProgressBadge;
