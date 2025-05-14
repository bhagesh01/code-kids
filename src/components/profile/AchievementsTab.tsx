
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface AchievementsTabProps {
  achievements: Achievement[];
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className={achievement.earned ? "border-primary/30" : "opacity-70"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {achievement.name}
              {achievement.earned && (
                <Badge className="bg-primary text-xs">Earned</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AchievementsTab;
