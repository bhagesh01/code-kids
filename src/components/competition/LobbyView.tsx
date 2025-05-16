
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface LobbyViewProps {
  competitionData: {
    title: string;
    difficulty: string;
    duration: number;
    startTime: Date;
  };
  onCompetitionStart: (duration: number) => void;
}

const LobbyView = ({ competitionData, onCompetitionStart }: LobbyViewProps) => {
  const [lobbyTime, setLobbyTime] = useState<number | null>(null);
  
  useEffect(() => {
    const now = new Date();
    const timeToStart = Math.floor((competitionData.startTime.getTime() - now.getTime()) / 1000);
    setLobbyTime(timeToStart);
  }, [competitionData.startTime]);
  
  // Timer effect for lobby
  useEffect(() => {
    if (lobbyTime !== null && lobbyTime > 0) {
      const timer = setTimeout(() => {
        setLobbyTime(lobbyTime - 1);
        
        // Check if lobby time is up
        if (lobbyTime <= 1) {
          onCompetitionStart(competitionData.duration * 60);
          toast.success("Competition started!");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lobbyTime, competitionData.duration, onCompetitionStart]);
  
  // Format time display
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <h1 className="font-bold">{competitionData.title}</h1>
            <Badge className={
              competitionData.difficulty === "Easy" ? "bg-green-500" : 
              competitionData.difficulty === "Medium" ? "bg-yellow-500" : 
              "bg-red-500"
            }>
              {competitionData.difficulty}
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Waiting for Competition to Start</h2>
                <p className="text-muted-foreground mb-4">The competition will begin shortly. Get ready!</p>
              </div>
              
              <div className="flex items-center space-x-4 text-2xl font-bold">
                <Clock className="w-8 h-8 text-primary animate-pulse" />
                <span className="text-3xl">{formatTime(lobbyTime)}</span>
              </div>
              
              <div className="w-full space-y-2">
                <h3 className="font-medium">Competition Details:</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Title:</span> {competitionData.title}</p>
                  <p><span className="font-medium">Difficulty:</span> {competitionData.difficulty}</p>
                  <p><span className="font-medium">Duration:</span> {competitionData.duration} minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LobbyView;
