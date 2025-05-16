
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface Hint {
  text: string;
  penalty: number;
}

interface HintSystemProps {
  hints: Hint[];
  isCompleted: boolean;
  onHintUsed: (penalty: number) => void;
}

const HintSystem = ({ hints, isCompleted, onHintUsed }: HintSystemProps) => {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [nextHint, setNextHint] = useState(0);

  const handleRevealHint = () => {
    if (nextHint < hints.length) {
      const hint = hints[nextHint];
      setRevealedHints([...revealedHints, nextHint]);
      setNextHint(nextHint + 1);
      
      // Apply the penalty
      onHintUsed(hint.penalty);
      
      // Notify the user about the penalty
      toast.info(`Hint revealed! Time penalty: ${hint.penalty} seconds`);
    } else {
      toast.info("No more hints available!");
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Hints</h3>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Using hints will add a time penalty to your score.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-3">
        {revealedHints.map((index) => (
          <div key={index} className="bg-muted p-3 rounded-md text-sm">
            <div className="font-medium mb-1">Hint {index + 1}</div>
            <div>{hints[index].text}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Penalty: {hints[index].penalty} seconds
            </div>
          </div>
        ))}
        
        {nextHint < hints.length && !isCompleted && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleRevealHint}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Reveal Hint {nextHint + 1}
            <span className="text-xs ml-2 opacity-70">
              ({hints[nextHint].penalty}s penalty)
            </span>
          </Button>
        )}
        
        {(nextHint >= hints.length || isCompleted) && (
          <div className="text-center text-muted-foreground text-sm p-2">
            {revealedHints.length > 0 
              ? "All hints revealed" 
              : "No hints used. Great job!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default HintSystem;
