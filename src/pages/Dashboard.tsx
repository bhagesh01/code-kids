
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Users,
  Code,
  Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ProgressBadge from "@/components/ProgressBadge";
import CompetitionHistory from "@/components/CompetitionHistory";
import WeeklyTip from "@/components/WeeklyTip";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from your backend
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCompetitions: 12,
      wins: 3,
      averageRank: 4.2,
      currentStreak: 5,
      totalPoints: 2847,
      level: 4,
      progressToNextLevel: 65
    },
    upcomingCompetitions: [
      {
        id: "1",
        title: "Array Algorithms Challenge",
        difficulty: "Medium" as const,
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        participants: 156,
        category: "arena" as const
      },
      {
        id: "2", 
        title: "TechCorp Hiring Sprint",
        difficulty: "Hard" as const,
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        participants: 45,
        category: "hiring" as const
      }
    ],
    recentHistory: [
      {
        id: "h1",
        date: "2024-01-15",
        competition: "String Processing Challenge",
        difficulty: "Easy" as const,
        rank: 2,
        participants: 89,
        score: 95
      },
      {
        id: "h2", 
        date: "2024-01-12",
        competition: "Graph Theory Basics",
        difficulty: "Medium" as const,
        rank: 5,
        participants: 67,
        score: 87
      },
      {
        id: "h3",
        date: "2024-01-10", 
        competition: "Dynamic Programming Deep Dive",
        difficulty: "Hard" as const,
        rank: 8,
        participants: 124,
        score: 78
      }
    ]
  });

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user?.name || "Coder"}! 👋
          </h1>
          <p className="text-muted-foreground">Ready to tackle some challenges today?</p>
        </div>

        {/* Level Progress */}
        <div className="mb-8">
          <ProgressBadge 
            level={dashboardData.stats.level} 
            progress={dashboardData.stats.progressToNextLevel} 
          />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Competitions</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalCompetitions}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wins</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.wins}</div>
              <p className="text-xs text-muted-foreground">
                {((dashboardData.stats.wins / dashboardData.stats.totalCompetitions) * 100).toFixed(1)}% win rate
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rank</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{dashboardData.stats.averageRank}</div>
              <p className="text-xs text-muted-foreground">
                Improving over time
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                competitions in a row
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Competitions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Competitions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Competitions
                </CardTitle>
                <CardDescription>Don't miss these exciting challenges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.upcomingCompetitions.map((comp) => (
                  <div 
                    key={comp.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/competitions/${comp.id}`)}
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{comp.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge 
                          className={
                            comp.difficulty === "Easy" ? "bg-green-500" :
                            comp.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                          }
                        >
                          {comp.difficulty}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {comp.participants}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Starts in {formatTimeUntil(comp.startTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {comp.startTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <Button 
                  className="w-full hover-scale" 
                  onClick={() => navigate("/competitions")}
                >
                  View All Competitions
                </Button>
              </CardContent>
            </Card>

            {/* Recent Competition History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>Your latest competition results</CardDescription>
              </CardHeader>
              <CardContent>
                <CompetitionHistory history={dashboardData.recentHistory} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tips & Info */}
          <div className="space-y-6">
            <WeeklyTip 
              tip={{
                title: "Pro Tip of the Week",
                description: "Use console.log() statements to debug your code during competitions. They can help you trace through your logic and catch edge cases!"
              }}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start hover-scale" 
                  variant="outline"
                  onClick={() => navigate("/competitions")}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Browse Competitions
                </Button>
                <Button 
                  className="w-full justify-start hover-scale" 
                  variant="outline"
                  onClick={() => navigate("/profile")}
                >
                  <Target className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                {user?.role === "recruiter" && (
                  <Button 
                    className="w-full justify-start hover-scale" 
                    variant="outline"
                    onClick={() => navigate("/competitions/create")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Create Competition
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
