
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CompetitionData {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  category: 'practice' | 'scheduled';
  start_time?: string;
  duration_minutes: number;
  max_participants?: number;
  participants?: number; // This would come from a join with participants table
}

interface CompetitionCardProps {
  competition: CompetitionData;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [canJoin, setCanJoin] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  
  useEffect(() => {
    const calculateTimeStatus = () => {
      // For practice competitions, always allow joining
      if (competition.category === 'practice') {
        setCanJoin(true);
        setHasStarted(false);
        return;
      }

      // For scheduled competitions, check timing
      if (!competition.start_time) {
        setCanJoin(true);
        return;
      }

      const now = new Date();
      const startTime = new Date(competition.start_time);
      
      // Time in milliseconds until competition starts
      const timeToStart = startTime.getTime() - now.getTime();
      
      // Competition already started
      if (timeToStart <= 0) {
        setHasStarted(true);
        setCanJoin(true);
        return;
      }
      
      // Allow joining 5 minutes (300000ms) before start time
      setCanJoin(timeToStart <= 300000);
      
      // Update timeRemaining in minutes
      setTimeRemaining(Math.ceil(timeToStart / (1000 * 60)));
    };
    
    // Initial calculation
    calculateTimeStatus();
    
    // Update every minute for scheduled competitions
    if (competition.category === 'scheduled') {
      const timer = setInterval(calculateTimeStatus, 60000);
      return () => clearInterval(timer);
    }
  }, [competition.start_time, competition.category]);

  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Format time to display
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date to display
  const formatDate = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const isPractice = competition.category === 'practice';

  const handleDisabledClick = () => {
    toast({
      title: "Competition not available yet",
      description: `You can join this competition ${timeRemaining} minute${timeRemaining !== 1 ? 's' : ''} before it starts.`,
    });
  };

  return (
    <Card className="hover-card overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{competition.title}</CardTitle>
          <Badge className={`${getDifficultyColor(competition.difficulty)} text-white`}>
            {competition.difficulty}
          </Badge>
        </div>
        {competition.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {competition.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {competition.start_time && (
          <>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Date:</span> {formatDate(competition.start_time)}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Time:</span> {formatTime(competition.start_time)}
            </div>
          </>
        )}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Duration:</span> {competition.duration_minutes} mins
        </div>
        {competition.max_participants && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Max Participants:</span> {competition.max_participants}
          </div>
        )}
        
        {!canJoin && !hasStarted && !isPractice && (
          <div className="flex items-center gap-2 text-amber-600 mt-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Available in {timeRemaining} min</span>
          </div>
        )}
        
        {isPractice && (
          <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
            <Users className="h-3 w-3" /> 
            <span>Practice Mode</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {canJoin ? (
          <Link to={`/competitions/${competition.id}`} className="w-full">
            <Button className="w-full hover-scale">
              {isPractice ? "Start Practice" : "Join Competition"}
            </Button>
          </Link>
        ) : (
          <Button 
            className="w-full" 
            variant="secondary" 
            disabled
            onClick={handleDisabledClick}
          >
            {hasStarted ? "Competition In Progress" : "Opens Soon"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CompetitionCard;
