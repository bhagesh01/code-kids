
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CompetitionCard, { CompetitionData } from "@/components/CompetitionCard";
import DifficultyFilter from "@/components/DifficultyFilter";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Competitions = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for upcoming competitions
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
    {
      id: "comp-5",
      title: "String Showdown",
      difficulty: "Medium",
      participants: 10,
      maxParticipants: 20,
      startTime: "2025-05-24T13:00:00",
      duration: 60,
    },
    {
      id: "comp-6",
      title: "Algorithm Arena",
      difficulty: "Hard",
      participants: 5,
      maxParticipants: 12,
      startTime: "2025-05-25T16:00:00",
      duration: 75,
    },
  ];
  
  // Mock data for past competitions
  const pastCompetitions: CompetitionData[] = [
    {
      id: "past-1",
      title: "Array Basics",
      difficulty: "Easy",
      participants: 20,
      maxParticipants: 20,
      startTime: "2025-05-10T15:30:00",
      duration: 45,
    },
    {
      id: "past-2",
      title: "For Loop Fun",
      difficulty: "Easy",
      participants: 15,
      maxParticipants: 15,
      startTime: "2025-05-08T16:00:00",
      duration: 30,
    },
    {
      id: "past-3",
      title: "Function Masters",
      difficulty: "Medium",
      participants: 18,
      maxParticipants: 25,
      startTime: "2025-05-05T14:00:00",
      duration: 60,
    },
    {
      id: "past-4",
      title: "Advanced Algorithms",
      difficulty: "Hard",
      participants: 10,
      maxParticipants: 10,
      startTime: "2025-05-01T17:30:00",
      duration: 90,
    },
  ];
  
  // Filter and search functions
  const filterCompetitions = (competitions: CompetitionData[]) => {
    let filtered = competitions;
    
    // Apply difficulty filter
    if (filter) {
      filtered = filtered.filter(comp => comp.difficulty === filter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(comp => 
        comp.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  const filteredUpcoming = filterCompetitions(upcomingCompetitions);
  const filteredPast = filterCompetitions(pastCompetitions);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <main className="flex-grow container px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Coding Competitions</h1>
        
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
