
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface LeaderboardPlayer {
  name: string;
  progress: number;
}

interface LiveLeaderboardProps {
  leaderboard: LeaderboardPlayer[];
  isCompleted: boolean;
  currentUserName: string;
}

const LiveLeaderboard = ({ leaderboard, isCompleted, currentUserName }: LiveLeaderboardProps) => {
  return (
    <Card className="h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Live Leaderboard</h2>
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="w-6 text-muted-foreground">{index + 1}.</span>
                  <span className={player.name === currentUserName ? "font-bold text-primary" : ""}>
                    {player.name}
                  </span>
                </div>
                <span className="text-sm">{player.progress}%</span>
              </div>
              <Progress value={player.progress} className="h-2" />
            </div>
          ))}
        </div>
        
        {isCompleted && (
          <div className="mt-8 p-4 border rounded-md bg-primary/5 text-center">
            <h3 className="font-bold text-xl mb-2">Competition Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your final rank: {leaderboard.findIndex(p => p.name === currentUserName) + 1}
            </p>
            <Button className="hover-scale w-full">View Solutions</Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveLeaderboard;
