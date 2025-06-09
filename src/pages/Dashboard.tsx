
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, TrendingUp, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CompetitionHistory from "@/components/CompetitionHistory";
import WeeklyTip from "@/components/WeeklyTip";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard
  const upcomingCompetitions = [
    {
      id: "1",
      title: "Array Algorithms Challenge",
      difficulty: "Easy" as const,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      participants: 156
    },
    {
      id: "2", 
      title: "Dynamic Programming Deep Dive",
      difficulty: "Hard" as const,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      participants: 89
    }
  ];

  const recentAchievements = [
    { id: 1, title: "First Competition", description: "Completed your first coding competition", earnedAt: "2024-01-15" },
    { id: 2, title: "Speed Demon", description: "Solved 3 problems in under 30 minutes", earnedAt: "2024-01-10" },
    { id: 3, title: "Problem Solver", description: "Solved 50 coding problems", earnedAt: "2024-01-05" }
  ];

  const weeklyTip = {
    title: "Master Two Pointers Technique",
    content: "The two pointers technique is essential for array problems. Practice with problems like 'Two Sum' and 'Container With Most Water' to build your intuition.",
    category: "Algorithm Pattern"
  };

  // Mock stats
  const stats = {
    totalCompetitions: 12,
    problemsSolved: 145,
    currentRank: 87,
    weeklyProgress: 15
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Ready to tackle some coding challenges today?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Competitions</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompetitions}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.problemsSolved}</div>
              <p className="text-xs text-muted-foreground">+{stats.weeklyProgress} this week</p>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.currentRank}</div>
              <p className="text-xs text-green-600">↑12 positions</p>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyProgress}</div>
              <p className="text-xs text-muted-foreground">problems solved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Upcoming Competitions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Competitions
              </CardTitle>
              <CardDescription>Don't miss these exciting challenges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingCompetitions.map((competition) => (
                <div key={competition.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-medium">{competition.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={`${
                        competition.difficulty === "Easy" ? "bg-green-500" : 
                        competition.difficulty === "Medium" ? "bg-yellow-500" : 
                        "bg-red-500"
                      } text-white`}>
                        {competition.difficulty}
                      </Badge>
                      <span>•</span>
                      <Users className="h-3 w-3" />
                      <span>{competition.participants} participants</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {competition.startTime.toLocaleDateString()} at {competition.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <Link to={`/competitions/${competition.id}`}>
                    <Button size="sm" className="hover-scale">
                      Join
                    </Button>
                  </Link>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Link to="/competitions">
                  <Button variant="outline" className="w-full hover-scale">
                    View All Competitions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Tip */}
          <div className="space-y-6">
            <WeeklyTip tip={weeklyTip} />
            
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(achievement.earnedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                
                <Link to="/profile?tab=achievements">
                  <Button variant="outline" size="sm" className="w-full hover-scale">
                    View All Achievements
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Competition History */}
        <div className="mt-8">
          <CompetitionHistory />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
