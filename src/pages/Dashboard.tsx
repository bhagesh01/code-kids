
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CompetitionCard, { CompetitionData } from "@/components/CompetitionCard";
import DifficultyFilter from "@/components/DifficultyFilter";
import ProgressBadge from "@/components/ProgressBadge";
import WeeklyTip from "@/components/WeeklyTip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<CompetitionData[]>([]);
  const { user } = useAuth();
  
  // Weekly tip personalized for the user
  const weeklyTip = {
    title: `Work on your ${user?.role === 'student' ? 'loop skills' : 'recruiting strategy'}!`,
    description: user?.role === 'student' 
      ? "Based on your recent challenges, try practicing different loop patterns like nested loops and loop optimizations." 
      : "Consider creating more specific challenges that test the exact skills you're looking for in candidates."
  };

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now we're simulating this with user-specific mock data
    const mockCompetitions: CompetitionData[] = [
      {
        id: "comp-1",
        title: "Array Adventures",
        difficulty: "Easy",
        participants: 12,
        maxParticipants: 20,
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
        duration: 45,
        category: "arena"
      },
      {
        id: "comp-2",
        title: "Loop Challenge",
        difficulty: "Easy",
        participants: 8,
        maxParticipants: 15,
        startTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // 5 minutes from now
        duration: 30,
        category: "arena"
      },
      {
        id: "comp-3",
        title: "Function Frenzy",
        difficulty: "Medium",
        participants: 15,
        maxParticipants: 25,
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
        duration: 60,
        category: "arena"
      },
    ];
    
    // Add hiring challenges only for students or all users
    if (user?.role === 'student' || user?.role === 'admin') {
      mockCompetitions.push({
        id: "comp-4",
        title: "Google Frontend Challenge",
        difficulty: "Hard",
        participants: 6,
        maxParticipants: 10,
        startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes from now
        duration: 90,
        category: "hiring",
        company: "Google",
        positions: 5
      });
    }
    
    // Add extra competition for recruiters to show their own challenges
    if (user?.role === 'recruiter' || user?.role === 'admin') {
      mockCompetitions.push({
        id: "comp-5",
        title: `${user?.name}'s Coding Challenge`,
        difficulty: "Medium",
        participants: 3,
        maxParticipants: 15,
        startTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
        duration: 75,
        category: "hiring",
        company: "Your Company",
        positions: 2
      });
    }
    
    setUpcomingCompetitions(mockCompetitions);
  }, [user]);

  // Filter competitions by difficulty
  const filteredCompetitions = filter 
    ? upcomingCompetitions.filter(comp => comp.difficulty === filter)
    : upcomingCompetitions;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold mb-2 md:mb-0">Welcome, {user?.name}</h1>
              <ProgressBadge level={4} progress={65} />
            </div>

            {/* Weekly Tip */}
            <div className="mb-8">
              <WeeklyTip tip={weeklyTip} />
            </div>
            
            {/* Upcoming Competitions */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upcoming Competitions</h2>
                <Link to="/competitions">
                  <Button variant="link" className="p-0 h-auto hover-scale">
                    View All
                  </Button>
                </Link>
              </div>
              
              <DifficultyFilter onFilterChange={setFilter} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {filteredCompetitions.map((competition) => (
                  <CompetitionCard 
                    key={competition.id} 
                    competition={competition} 
                  />
                ))}
              </div>
              
              {filteredCompetitions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No competitions found with the selected filter</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setFilter(null)}
                  >
                    Clear filter
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            {/* Credits */}
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Your Credits</h3>
              <div className="text-3xl font-bold text-center py-2">5</div>
              <p className="text-xs text-muted-foreground text-center">Resets in 4 days</p>
            </div>
            
            {/* Role-specific options */}
            {user?.role === 'recruiter' && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Recruiter Tools</h3>
                <Link to="/competitions/create">
                  <Button className="w-full mb-2">Create Competition</Button>
                </Link>
                <p className="text-xs text-muted-foreground">Create a coding challenge to find your next hire</p>
              </div>
            )}
            
            {/* Links */}
            <div className="bg-background border rounded-lg overflow-hidden">
              <Link to="/profile" className="block p-3 hover:bg-muted transition-colors border-b last:border-0">
                View Profile
              </Link>
              <Link to="/competitions" className="block p-3 hover:bg-muted transition-colors border-b last:border-0">
                All Competitions
              </Link>
              <Link to="/practice" className="block p-3 hover:bg-muted transition-colors">
                Practice Area
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
