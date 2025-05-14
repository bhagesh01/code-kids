
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CompetitionHistory from "@/components/CompetitionHistory";
import ProgressBadge from "@/components/ProgressBadge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  // Mock data
  const competitionHistory = [
    {
      id: "hist-1",
      date: "2025-05-10",
      competition: "Array Adventures",
      difficulty: "Easy" as const,
      rank: 3,
      participants: 18,
      score: 95,
    },
    {
      id: "hist-2",
      date: "2025-05-05",
      competition: "Function Fundamentals",
      difficulty: "Medium" as const,
      rank: 5,
      participants: 15,
      score: 87,
    },
    {
      id: "hist-3",
      date: "2025-04-28",
      competition: "Loop Mastery",
      difficulty: "Easy" as const,
      rank: 2,
      participants: 20,
      score: 98,
    },
    {
      id: "hist-4",
      date: "2025-04-20",
      competition: "Object Challenge",
      difficulty: "Hard" as const,
      rank: 7,
      participants: 12,
      score: 82,
    },
  ];
  
  const achievements = [
    { id: "a1", name: "First Win", description: "Win your first competition", earned: true },
    { id: "a2", name: "Perfect Score", description: "Score 100 in any competition", earned: false },
    { id: "a3", name: "Consistent Coder", description: "Complete 5 competitions in a row", earned: true },
    { id: "a4", name: "Algorithm Expert", description: "Solve a Hard difficulty problem in under 15 minutes", earned: false },
    { id: "a5", name: "Bug Hunter", description: "Fix 10 bugs in practice sessions", earned: true },
  ];
  
  const stats = {
    totalCompetitions: 12,
    wins: 3,
    averageRank: "4th",
    favoriteCategory: "Arrays",
    topLanguage: "JavaScript"
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow container px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src="https://i.pravatar.cc/300" />
              <AvatarFallback className="text-2xl">CK</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">CodeMaster123</h1>
              <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                <Badge variant="outline" className="bg-primary/10">Level 4</Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-700">12 Competitions</Badge>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">3 Wins</Badge>
              </div>
              
              <p className="text-muted-foreground text-center md:text-left mb-4">
                Coding enthusiast who loves solving problems and learning new algorithms!
              </p>
              
              <ProgressBadge level={4} progress={65} />
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="history" className="hover-scale">Competition History</TabsTrigger>
            <TabsTrigger value="achievements" className="hover-scale">Achievements</TabsTrigger>
            <TabsTrigger value="stats" className="hover-scale">Stats</TabsTrigger>
          </TabsList>
          
          {/* Competition History Tab */}
          <TabsContent value="history" className="space-y-4 animate-fade-in">
            <CompetitionHistory history={competitionHistory} />
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="animate-fade-in">
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
          </TabsContent>
          
          {/* Stats Tab */}
          <TabsContent value="stats" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Your Coding Stats</CardTitle>
                <CardDescription>A summary of your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <dt className="text-muted-foreground">Total Competitions</dt>
                    <dd className="font-medium text-lg">{stats.totalCompetitions}</dd>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <dt className="text-muted-foreground">Wins</dt>
                    <dd className="font-medium text-lg">{stats.wins}</dd>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <dt className="text-muted-foreground">Average Rank</dt>
                    <dd className="font-medium text-lg">{stats.averageRank}</dd>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <dt className="text-muted-foreground">Favorite Category</dt>
                    <dd className="font-medium text-lg">{stats.favoriteCategory}</dd>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md col-span-1 md:col-span-2">
                    <dt className="text-muted-foreground">Top Language</dt>
                    <dd className="font-medium text-lg">{stats.topLanguage}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
