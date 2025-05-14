
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import CompetitionHistory, { HistoryItem } from "@/components/CompetitionHistory";
import AchievementsTab from "./AchievementsTab";
import StatsTab from "./StatsTab";

interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface UserStats {
  totalCompetitions: number;
  wins: number;
  averageRank: string;
  favoriteCategory: string;
  topLanguage: string;
}

interface ProfileTabsProps {
  competitionHistory: HistoryItem[];
  achievements: Achievement[];
  userStats: UserStats;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ competitionHistory, achievements, userStats }) => {
  return (
    <Tabs defaultValue="history" className="space-y-4">
      <TabsList className="grid w-full md:w-auto grid-cols-3">
        <TabsTrigger value="history" className="hover-scale">Competition History</TabsTrigger>
        <TabsTrigger value="achievements" className="hover-scale">Achievements</TabsTrigger>
        <TabsTrigger value="stats" className="hover-scale">Stats</TabsTrigger>
      </TabsList>
      
      <TabsContent value="history" className="space-y-4 animate-fade-in">
        <CompetitionHistory history={competitionHistory} />
      </TabsContent>
      
      <TabsContent value="achievements" className="animate-fade-in">
        <AchievementsTab achievements={achievements} />
      </TabsContent>
      
      <TabsContent value="stats" className="animate-fade-in">
        <StatsTab userStats={userStats} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
