
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Clock, Trophy, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import CompetitionCard from "@/components/CompetitionCard";
import DifficultyFilter from "@/components/DifficultyFilter";

// Define types for the competitions data
interface CompetitionData {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  startTime: string; // Changed from Date to string to match CompetitionCard
  duration: number;
  participants: number;
  category: "arena" | "hiring";
  company?: string;
  prize?: string;
}

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

const Competitions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");
  const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from your backend
  const mockCompetitions: CompetitionData[] = [
    {
      id: "1",
      title: "Array Algorithms Challenge",
      description: "Master the fundamentals of array manipulation and sorting algorithms.",
      difficulty: "Easy",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duration: 90,
      participants: 156,
      category: "arena"
    },
    {
      id: "2",
      title: "TechCorp Hiring Sprint",
      description: "Solve real-world problems used in our interview process.",
      difficulty: "Hard",
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      participants: 45,
      category: "hiring",
      company: "TechCorp",
      prize: "$5,000 signing bonus"
    },
    {
      id: "3",
      title: "Dynamic Programming Mastery",
      description: "Advanced dynamic programming techniques and optimization.",
      difficulty: "Hard",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration: 150,
      participants: 89,
      category: "arena"
    },
    {
      id: "4",
      title: "String Processing Sprint",
      description: "Work with text processing and pattern matching algorithms.",
      difficulty: "Medium",
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      duration: 75,
      participants: 234,
      category: "arena"
    },
    {
      id: "5",
      title: "StartupX Code Challenge",
      description: "Help us find the next great developer for our growing team.",
      difficulty: "Medium",
      startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      duration: 90,
      participants: 67,
      category: "hiring",
      company: "StartupX",
      prize: "Direct interview + $3,000 bonus"
    },
    {
      id: "6",
      title: "Graph Theory Fundamentals",
      description: "Explore graph traversal, shortest paths, and network algorithms.",
      difficulty: "Medium",
      startTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
      duration: 105,
      participants: 178,
      category: "arena"
    }
  ];

  useEffect(() => {
    // Simulate loading competitions from backend
    const timer = setTimeout(() => {
      setCompetitions(mockCompetitions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter competitions based on search and difficulty
  const filteredCompetitions = competitions.filter((competition) => {
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (competition.company && competition.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "All" || competition.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  // Separate arena and hiring competitions
  const arenaCompetitions = filteredCompetitions.filter(comp => comp.category === "arena");
  const hiringCompetitions = filteredCompetitions.filter(comp => comp.category === "hiring");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading competitions...</p>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Competitions</h1>
            <p className="text-muted-foreground">Join coding challenges and showcase your skills</p>
          </div>
          
          {(user?.role === "recruiter" || user?.role === "admin") && (
            <Button 
              onClick={() => navigate("/competitions/create")}
              className="mt-4 md:mt-0 hover-scale"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Competition
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search competitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DifficultyFilter
            value={difficultyFilter}
            onValueChange={setDifficultyFilter}
          />
        </div>

        {/* Arena Competitions */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Arena Competitions</h2>
            <Badge variant="secondary">Practice & Learn</Badge>
          </div>
          
          {arenaCompetitions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {arenaCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  onJoin={() => navigate(`/competitions/${competition.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No arena competitions match your filters.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Hiring Competitions */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Hiring Competitions</h2>
            <Badge variant="secondary">Career Opportunities</Badge>
          </div>
          
          {hiringCompetitions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hiringCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  onJoin={() => navigate(`/competitions/${competition.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hiring competitions match your filters.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Competitions;
