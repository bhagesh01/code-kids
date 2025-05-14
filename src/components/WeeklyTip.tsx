
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';

interface WeeklyTipProps {
  tip: {
    title: string;
    description: string;
  };
}

const WeeklyTip: React.FC<WeeklyTipProps> = ({ tip }) => {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-bounce-small" />
            Weekly Tip
          </CardTitle>
        </div>
        <CardDescription>Suggested area to improve this week</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-1 text-foreground">{tip.title}</h3>
        <p className="text-sm text-muted-foreground">{tip.description}</p>
      </CardContent>
    </Card>
  );
};

export default WeeklyTip;
