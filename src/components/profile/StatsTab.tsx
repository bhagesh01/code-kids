
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface UserStats {
  totalCompetitions: number;
  wins: number;
  averageRank: string;
  favoriteCategory: string;
  topLanguage: string;
}

interface StatsTabProps {
  userStats: UserStats;
}

const StatsTab: React.FC<StatsTabProps> = ({ userStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Coding Stats</CardTitle>
        <CardDescription>A summary of your performance</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-muted/50 p-3 rounded-md">
            <dt className="text-muted-foreground">Total Competitions</dt>
            <dd className="font-medium text-lg">{userStats.totalCompetitions}</dd>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <dt className="text-muted-foreground">Wins</dt>
            <dd className="font-medium text-lg">{userStats.wins}</dd>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <dt className="text-muted-foreground">Average Rank</dt>
            <dd className="font-medium text-lg">{userStats.averageRank}</dd>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <dt className="text-muted-foreground">Favorite Category</dt>
            <dd className="font-medium text-lg">{userStats.favoriteCategory}</dd>
          </div>
          <div className="bg-muted/50 p-3 rounded-md col-span-1 md:col-span-2">
            <dt className="text-muted-foreground">Top Language</dt>
            <dd className="font-medium text-lg">{userStats.topLanguage}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default StatsTab;
