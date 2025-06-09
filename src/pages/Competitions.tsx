import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy, Target, Zap, Star } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/auth";
import DifficultyFilter from "@/components/DifficultyFilter";
import CompetitionCard from "@/components/CompetitionCard";

const Competitions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const [pastCompetitions, setPastCompetitions] = useState([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API endpoint
    // Here we're simulating with dynamic mock data based on user
    
    // Generate upcoming competitions (future dates)
    const generateUpcoming = () => {
      const upcoming: CompetitionData[] = [
        {
          id: "comp-1",
          title: "Array Adventures",
          difficulty: "Easy" as const,
          participants: 12,
          maxParticipants: 20,
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
          duration: 45,
          category: "arena" as const
        },
        {
          id: "comp-2",
          title: "Loop Challenge",
          difficulty: "Easy" as const,
          participants: 8,
          maxParticipants: 15,
          startTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // 5 minutes from now
          duration: 30,
          category: "arena" as const
        },
        {
          id: "comp-3",
          title: "Function Frenzy",
          difficulty: "Medium" as const,
          participants: 15,
          maxParticipants: 25,
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
          duration: 60,
          category: "arena" as const
        }
      ];
      
      // Add hiring challenges if user is student or admin
      if (user?.role === 'student' || user?.role === 'admin') {
        upcoming.push(
          {
            id: "comp-4",
            title: "Google Frontend Challenge",
            difficulty: "Hard" as const,
            participants: 6,
            maxParticipants: 10,
            startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes from now
            duration: 90,
            category: "hiring" as const,
            company: "Google",
            positions: 5
          },
          {
            id: "comp-5",
            title: "Amazon Algorithm Challenge",
            difficulty: "Medium" as const,
            participants: 10,
            maxParticipants: 20,
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
            duration: 60,
            category: "hiring" as const,
            company: "Amazon",
            positions: 10
          }
        );
      }
      
      // Add recruiter's own competitions
      if (user?.role === 'recruiter') {
        upcoming.push(
          {
            id: "comp-6",
            title: `${user.name}'s Coding Challenge`,
            difficulty: "Medium" as const,
            participants: 3,
            maxParticipants: 15,
            startTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
            duration: 75,
            category: "hiring" as const,
            company: "Your Company",
            positions: 2
          }
        );
      }
      
      return upcoming;
    };
    
    // Generate past competitions (past dates)
    const generatePast = () => {
      return [
        {
          id: "past-1",
          title: "Array Basics",
          difficulty: "Easy" as const,
          participants: 20,
          maxParticipants: 20,
          startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
          duration: 45,
          category: "arena" as const
        },
        {
          id: "past-2",
          title: "For Loop Fun",
          difficulty: "Easy" as const,
          participants: 15,
          maxParticipants: 15,
          startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
          duration: 30,
          category: "arena" as const
        },
        {
          id: "past-3",
          title: "Meta Frontend Challenge",
          difficulty: "Medium" as const,
          participants: 18,
          maxParticipants: 25,
          startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
          duration: 60,
          category: "hiring" as const,
          company: "Meta",
          positions: 5
        }
      ] as CompetitionData[];
    };
    
    setUpcomingCompetitions(generateUpcoming());
    setPastCompetitions(generatePast());
  }, [user]);
  
  // Filter and search functions
  const filterCompetitions = (competitions: CompetitionData[]) => {
    let filtered = competitions;
    
    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter(comp => comp.category === category);
    }
    
    // Apply difficulty filter
    if (filter) {
      filtered = filtered.filter(comp => comp.difficulty === filter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(comp => 
        comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comp.company && comp.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };
  
  const filteredUpcoming = filterCompetitions(upcomingCompetitions);
  const filteredPast = filterCompetitions(pastCompetitions);
  
  const handleCreateCompetition = () => {
    if (user?.role === 'recruiter' || user?.role === 'admin') {
      navigate('/competitions/create');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Coding Competitions</h1>
          
          {(user?.role === 'recruiter' || user?.role === 'admin') && (
            <Button 
              onClick={handleCreateCompetition}
              className="hover-scale"
            >
              Create Competition
            </Button>
          )}
        </div>
        
        {/* Category Tabs */}
        <div className="mb-6">
          <Tabs 
            defaultValue="all" 
            value={category} 
            onValueChange={setCategory}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
              <TabsTrigger value="all" className="flex items-center gap-2 hover-scale">
                <Trophy className="h-4 w-4" /> 
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="hiring" className="flex items-center gap-2 hover-scale">
                <Building className="h-4 w-4" /> 
                <span>Hiring</span>
              </TabsTrigger>
              <TabsTrigger value="arena" className="flex items-center gap-2 hover-scale">
                <Users className="h-4 w-4" /> 
                <span>Arena</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <Input
            placeholder="Search competitions..."
            className="max-w-md"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <DifficultyFilter onFilterChange={setFilter} />
        </div>
        
        {/* Competitions Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming" className="hover-scale">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="hover-scale">Past</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Competitions */}
          <TabsContent value="upcoming" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUpcoming.length > 0 ? (
                filteredUpcoming.map((competition) => (
                  <CompetitionCard 
                    key={competition.id} 
                    competition={competition} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No upcoming competitions found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Past Competitions */}
          <TabsContent value="past" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPast.length > 0 ? (
                filteredPast.map((competition) => (
                  <CompetitionCard 
                    key={competition.id} 
                    competition={competition} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No past competitions found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Competitions;
