
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import CompetitionCard from "@/components/CompetitionCard";
import DifficultyFilter from "@/components/DifficultyFilter";

interface CompetitionData {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "hiring" | "arena";
  participants: number;
  maxParticipants: number;
  startTime: Date;
  duration: number;
  isActive: boolean;
  company?: string;
  positions?: number;
}

const Competitions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [activeTab, setActiveTab] = useState<"arena" | "hiring">("arena");

  // Mock competitions data
  const [competitions, setCompetitions] = useState<CompetitionData[]>([
    {
      id: "1",
      title: "Array Adventures",
      description: "Master array manipulation and sorting algorithms in this beginner-friendly competition.",
      difficulty: "Easy",
      category: "arena",
      participants: 156,
      maxParticipants: 200,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      isActive: true
    },
    {
      id: "2",
      title: "String Theory Challenge",
      description: "Dive deep into string processing, pattern matching, and text algorithms.",
      difficulty: "Medium",
      category: "arena",
      participants: 89,
      maxParticipants: 150,
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      duration: 90,
      isActive: true
    },
    {
      id: "3",
      title: "TechCorp Hiring Challenge",
      description: "Join TechCorp's exclusive hiring competition. Solve real-world problems and get noticed by our recruiters.",
      difficulty: "Hard",
      category: "hiring",
      participants: 45,
      maxParticipants: 100,
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      duration: 120,
      isActive: true,
      company: "TechCorp",
      positions: 5
    },
    {
      id: "4",
      title: "Graph Theory Masterclass",
      description: "Test your knowledge of graphs, trees, and advanced algorithms in this challenging competition.",
      difficulty: "Hard",
      category: "arena",
      participants: 67,
      maxParticipants: 120,
      startTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      duration: 150,
      isActive: true
    },
    {
      id: "5",
      title: "StartupXYZ Code Sprint",
      description: "Fast-paced coding challenge from StartupXYZ. Show your skills in full-stack development.",
      difficulty: "Medium",
      category: "hiring",
      participants: 23,
      maxParticipants: 50,
      startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      duration: 180,
      isActive: true,
      company: "StartupXYZ",
      positions: 3
    }
  ]);

  useEffect(() => {
    // Mock fetching competitions from API
    console.log("Fetching competitions...");
  }, []);

  const filteredCompetitions = competitions.filter((comp: CompetitionData) => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || comp.difficulty === selectedDifficulty;
    const matchesCategory = comp.category === activeTab;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleJoinCompetition = (competition: CompetitionData) => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    navigate(`/competitions/${competition.id}`);
  };

  const arenaCompetitions = filteredCompetitions.filter(comp => comp.category === "arena");
  const hiringCompetitions = filteredCompetitions.filter(comp => comp.category === "hiring");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Coding Competitions</h1>
            <p className="text-muted-foreground">Challenge yourself and showcase your skills</p>
          </div>
          
          {user?.role === "recruiter" && (
            <Button 
              onClick={() => navigate("/competitions/create")}
              className="hover-scale"
            >
              <Building className="mr-2 h-4 w-4" />
              Create Competition
            </Button>
          )}
        </div>

        {/* Competition Type Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "arena" | "hiring")} className="mb-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
            <TabsTrigger value="arena" className="flex items-center gap-2 hover-scale">
              <Users className="h-4 w-4" />
              Arena
            </TabsTrigger>
            <TabsTrigger value="hiring" className="flex items-center gap-2 hover-scale">
              <Building className="h-4 w-4" />
              Hiring
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search competitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:max-w-xs"
          />
          <DifficultyFilter 
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
          />
        </div>

        {/* Competition Listings */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "arena" | "hiring")}>
          <TabsContent value="arena" className="space-y-4">
            {arenaCompetitions.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {arenaCompetitions.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                    onJoin={() => handleJoinCompetition(competition)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No arena competitions found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hiring" className="space-y-4">
            {hiringCompetitions.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hiringCompetitions.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                    onJoin={() => handleJoinCompetition(competition)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hiring competitions found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Competitions;
