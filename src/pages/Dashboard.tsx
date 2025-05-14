
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CompetitionCard, { CompetitionData } from "@/components/CompetitionCard";
import DifficultyFilter from "@/components/DifficultyFilter";
import ProgressBadge from "@/components/ProgressBadge";
import WeeklyTip from "@/components/WeeklyTip";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Mock data
  const upcomingCompetitions: CompetitionData[] = [
    {
      id: "comp-1",
      title: "Array Adventures",
      difficulty: "Easy",
      participants: 12,
      maxParticipants: 20,
      startTime: "2025-05-20T15:30:00",
      duration: 45,
    },
    {
      id: "comp-2",
      title: "Loop Challenge",
      difficulty: "Easy",
      participants: 8,
      maxParticipants: 15,
      startTime: "2025-05-21T16:00:00",
      duration: 30,
    },
    {
      id: "comp-3",
      title: "Function Frenzy",
      difficulty: "Medium",
      participants: 15,
      maxParticipants: 25,
      startTime: "2025-05-22T14:00:00",
      duration: 60,
    },
    {
      id: "comp-4",
      title: "Object-Oriented Olympics",
      difficulty: "Hard",
      participants: 6,
      maxParticipants: 10,
      startTime: "2025-05-23T17:30:00",
      duration: 90,
    },
  ];

  // Filter competitions by difficulty
  const filteredCompetitions = filter 
    ? upcomingCompetitions.filter(comp => comp.difficulty === filter)
    : upcomingCompetitions;

  // Weekly tip
  const weeklyTip = {
    title: "Work on your loop skills!",
    description: "Based on your recent challenges, try practicing different loop patterns like nested loops and loop optimizations."
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow container px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold mb-2 md:mb-0">Your Dashboard</h1>
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
