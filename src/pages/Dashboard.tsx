import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Trophy, Users, Target, TrendingUp, Award, Code } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import Navbar from "@/components/Navbar";
import CompetitionHistory from "@/components/CompetitionHistory";
import WeeklyTip from "@/components/WeeklyTip";
import ProgressBadge from "@/components/ProgressBadge";

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([
    { title: "Array Adventures", difficulty: "Easy", startTime: new Date(Date.now() + 3600000) }, // 1 hour from now
    { title: "String Shenanigans", difficulty: "Medium", startTime: new Date(Date.now() + 7200000) }, // 2 hours from now
  ]);
  const [completedCompetitions, setCompletedCompetitions] = useState([
    { title: "Sorting Showdown", rank: 2, date: new Date(Date.now() - 86400000) }, // 1 day ago
    { title: "Looping Legends", rank: 1, date: new Date(Date.now() - 172800000) }, // 2 days ago
  ]);
  const [userProgress, setUserProgress] = useState(75);
  const [weeklyTip, setWeeklyTip] = useState({
    title: "Optimize Your Code",
    content: "Use efficient algorithms to reduce time complexity.",
  });

  useEffect(() => {
    // Mock fetching upcoming competitions
    const fetchUpcomingCompetitions = async () => {
      // Simulate API call
      setTimeout(() => {
        setUpcomingCompetitions([
          { title: "Array Adventures", difficulty: "Easy", startTime: new Date(Date.now() + 3600000) }, // 1 hour from now
          { title: "String Shenanigans", difficulty: "Medium", startTime: new Date(Date.now() + 7200000) }, // 2 hours from now
          { title: "Recursion Rumble", difficulty: "Hard", startTime: new Date(Date.now() + 10800000) }, // 3 hours from now
        ]);
      }, 500);
    };

    // Mock fetching completed competitions
    const fetchCompletedCompetitions = async () => {
      // Simulate API call
      setTimeout(() => {
        setCompletedCompetitions([
          { title: "Sorting Showdown", rank: 2, date: new Date(Date.now() - 86400000) }, // 1 day ago
          { title: "Looping Legends", rank: 1, date: new Date(Date.now() - 172800000) }, // 2 days ago
          { title: "Binary Blitz", rank: 3, date: new Date(Date.now() - 259200000) }, // 3 days ago
        ]);
      }, 500);
    };

    // Mock fetching user progress
    const fetchUserProgress = async () => {
      // Simulate API call
      setTimeout(() => {
        setUserProgress(85);
      }, 500);
    };

    // Mock fetching weekly tip
    const fetchWeeklyTip = async () => {
      // Simulate API call
      setTimeout(() => {
        setWeeklyTip({
          title: "Mastering Recursion",
          content: "Understand base cases and recursive steps for effective recursion.",
        });
      }, 500);
    };

    fetchUpcomingCompetitions();
    fetchCompletedCompetitions();
    fetchUserProgress();
    fetchWeeklyTip();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-semibold mb-6">
          Welcome, {user?.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Stats */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall Completion</span>
                <ProgressBadge progress={userProgress} />
              </div>
              <Progress value={userProgress} />
              <div className="text-sm text-gray-500">
                Keep up the great work!
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Competitions */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Competitions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingCompetitions.map((competition, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{competition.title}</h3>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>
                        {competition.startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Badge className={
                        competition.difficulty === "Easy" ? "bg-green-500" :
                        competition.difficulty === "Medium" ? "bg-yellow-500" :
                        "bg-red-500"
                      }>
                        {competition.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Join
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Tip */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                Weekly Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h3 className="font-semibold">{weeklyTip.title}</h3>
              <p className="text-gray-600">{weeklyTip.content}</p>
            </CardContent>
          </Card>
        </div>

        {/* Competition History */}
        <CompetitionHistory completedCompetitions={completedCompetitions} />

        {/* Weekly Tip Component */}
        <WeeklyTip tip={weeklyTip} />
      </div>
    </div>
  );
};

export default Dashboard;
