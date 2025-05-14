
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface CompetitionData {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
  maxParticipants: number;
  startTime: string;
  duration: number; // in minutes
}

interface CompetitionCardProps {
  competition: CompetitionData;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
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

  return (
    <Card className="hover-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{competition.title}</CardTitle>
          <Badge className={`${getDifficultyColor(competition.difficulty)} text-white`}>
            {competition.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Time:</span> {formatTime(competition.startTime)}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Duration:</span> {competition.duration} mins
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Participants:</span> {competition.participants}/{competition.maxParticipants}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/competitions/${competition.id}`} className="w-full">
          <Button className="w-full hover-scale">
            Join Challenge
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CompetitionCard;
