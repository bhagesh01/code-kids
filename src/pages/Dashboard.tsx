
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  Clock, 
  TrendingUp, 
  Star, 
  Award,
  Code,
  Target,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProgressBadge from "@/components/ProgressBadge";
import WeeklyTip from "@/components/WeeklyTip";
import CompetitionHistory, { HistoryItem } from "@/components/CompetitionHistory";
import { useAuth } from "@/contexts/auth";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeCompetitions, setActiveCompetitions] = useState([
    {
      id: "1",
      title: "Array Algorithms",
      difficulty: "Medium" as const,
      participants: 45,
      timeLeft: "2h 15m",
      progress: 60
    },
    {
      id: "2", 
      title: "String Manipulation",
      difficulty: "Easy" as const,
      participants: 78,
      timeLeft: "45m",
      progress: 80
    }
  ]);

  const [userStats, setUserStats] = useState({
    totalCompetitions: 24,
    wins: 8,
    topThreeFinishes: 15,
    currentRank: 142,
    totalParticipants: 2847,
    averageScore: 85.6,
    streak: 5,
    level: 7,
    levelProgress: 68
  });

  const [upcomingCompetitions, setUpcomingCompetitions] = useState([
    {
      id: "3",
      title: "Graph Traversal Challenge",
      difficulty: "Hard" as const,
      startTime: "Tomorrow 3:00 PM",
      participants: 32,
      maxParticipants: 100
    },
    {
      id: "4",
      title: "Dynamic Programming",
      difficulty: "Medium" as const,
      startTime: "Dec 18, 2:00 PM", 
      participants: 67,
      maxParticipants: 150
    }
  ]);

  const [recentAchievements, setRecentAchievements] = useState([
    {
      id: "1",
      title: "Speed Demon",
      description: "Complete a challenge in under 5 minutes",
      icon: Zap,
      earnedAt: "2 days ago",
      rarity: "rare"
    },
    {
      id: "2", 
      title: "Problem Solver",
      description: "Solve 10 consecutive problems",
      icon: Target,
      earnedAt: "1 week ago",
      rarity: "common"
    }
  ]);

  // Helper function to get difficulty color
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

  // Helper function to get achievement rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600';
      case 'rare':
        return 'text-blue-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  // Improved weekly tip data
  const weeklyTip = {
    title: "Master Array Methods",
    description: "Focus on learning map(), filter(), and reduce() methods this week. These are essential for solving array-based coding challenges efficiently."
  };

  // Mock competition history data
  const competitionHistory: HistoryItem[] = [
    {
      id: "1",
      date: "2024-01-15",
      competition: "Binary Search Challenge",
      difficulty: "Medium",
      rank: 12,
      participants: 89,
      score: 95
    },
    {
      id: "2", 
      date: "2024-01-10",
      competition: "String Algorithms",
      difficulty: "Easy",
      rank: 3,
      participants: 156,
      score: 98
    },
    {
      id: "3",
      date: "2024-01-05", 
      competition: "Tree Traversal",
      difficulty: "Hard",
      rank: 25,
      participants: 67,
      score: 87
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold animate-fade-in">
            Welcome back, {user?.name || 'Coder'}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to tackle some coding challenges today?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Competitions</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalCompetitions}</div>
              <p className="text-xs text-muted-foreground">
                +{userStats.wins} wins this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{userStats.currentRank}</div>
              <p className="text-xs text-muted-foreground">
                Out of {userStats.totalParticipants.toLocaleString()} users
              </p>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {userStats.streak} day streak 🔥
              </p>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level Progress</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ProgressBadge level={userStats.level} progress={userStats.levelProgress} />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active & Upcoming Competitions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Competitions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Active Competitions
                    </CardTitle>
                    <CardDescription>Competitions you're currently participating in</CardDescription>
                  </div>
                  <Link to="/competitions">
                    <Button variant="outline" size="sm" className="hover-scale">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeCompetitions.map((competition) => (
                  <div key={competition.id} className="flex items-center justify-between p-4 border rounded-lg hover-card">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{competition.title}</h3>
                        <Badge className={`${getDifficultyColor(competition.difficulty)} text-white`}>
                          {competition.difficulty}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {competition.participants} participants • {competition.timeLeft} left
                      </div>
                      <Progress value={competition.progress} className="w-32" />
                    </div>
                    <Link to={`/competitions/${competition.id}`}>
                      <Button size="sm" className="hover-scale">Continue</Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Competitions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Upcoming Competitions
                </CardTitle>
                <CardDescription>Don't miss these exciting challenges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingCompetitions.map((competition) => (
                  <div key={competition.id} className="flex items-center justify-between p-4 border rounded-lg hover-card">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{competition.title}</h3>
                        <Badge className={`${getDifficultyColor(competition.difficulty)} text-white`}>
                          {competition.difficulty}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {competition.startTime} • {competition.participants}/{competition.maxParticipants} registered
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover-scale">
                      Register
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Competition History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Competition History
                </CardTitle>
                <CardDescription>Your recent competition results</CardDescription>
              </CardHeader>
              <CardContent>
                <CompetitionHistory history={competitionHistory} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Weekly Tip & Recent Achievements */}
          <div className="space-y-6">
            {/* Weekly Tip */}
            <WeeklyTip tip={weeklyTip} />

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 border rounded-lg hover-card">
                    <div className={`p-2 rounded-full bg-primary/10 ${getRarityColor(achievement.rarity)}`}>
                      <achievement.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">{achievement.earnedAt}</p>
                    </div>
                  </div>
                ))}
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full hover-scale">
                    View All Achievements
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/competitions">
                  <Button className="w-full hover-scale" size="sm">
                    Browse Competitions
                  </Button>
                </Link>
                <Link to="/competitions/create">
                  <Button variant="outline" className="w-full hover-scale" size="sm">
                    Create Competition
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="w-full hover-scale" size="sm">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
