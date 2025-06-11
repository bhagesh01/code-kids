import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Clock, Trophy, Calendar, Code } from "lucide-react";
import Navbar from "@/components/Navbar";
import CompetitionCard from "@/components/CompetitionCard";
import DifficultyFilter from "@/components/DifficultyFilter";

// Define types for the competitions data - matching CompetitionCard interface
interface CompetitionData {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  startTime: string;
  duration_minutes: number; // Changed from duration to duration_minutes
  participants: number;
  maxParticipants: number;
  category: "arena" | "hiring";
  company?: string;
  positions?: number;
}

type DifficultyFilterType = "All" | "Easy" | "Medium" | "Hard";

const Competitions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilterType>("All");
  const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock competitions - 20+ always-available DSA competitions
  const mockCompetitions: CompetitionData[] = [
    // Scheduled competitions (timed)
    {
      id: "1",
      title: "Array Algorithms Challenge",
      difficulty: "Easy",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 90,
      participants: 156,
      maxParticipants: 500,
      category: "arena"
    },
    {
      id: "2",
      title: "TechCorp Hiring Sprint",
      difficulty: "Hard",
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 120,
      participants: 45,
      maxParticipants: 100,
      category: "hiring",
      company: "TechCorp",
      positions: 5
    },
    {
      id: "3",
      title: "Dynamic Programming Mastery",
      difficulty: "Hard",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 150,
      participants: 89,
      maxParticipants: 300,
      category: "arena"
    },

    // Always available mock competitions (anytime access)
    {
      id: "mock-1",
      title: "Two Sum Problem",
      difficulty: "Easy",
      startTime: new Date().toISOString(), // Available now
      duration_minutes: 30,
      participants: 1243,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-2", 
      title: "Binary Search Basics",
      difficulty: "Easy",
      startTime: new Date().toISOString(),
      duration_minutes: 45,
      participants: 987,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-3",
      title: "Linked List Manipulation",
      difficulty: "Easy",
      startTime: new Date().toISOString(),
      duration_minutes: 60,
      participants: 856,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-4",
      title: "Stack and Queue Operations",
      difficulty: "Easy",
      startTime: new Date().toISOString(),
      duration_minutes: 50,
      participants: 734,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-5",
      title: "String Pattern Matching",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 75,
      participants: 621,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-6",
      title: "Tree Traversal Algorithms",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 90,
      participants: 543,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-7",
      title: "Graph BFS & DFS",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 100,
      participants: 432,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-8",
      title: "Sliding Window Technique",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 80,
      participants: 567,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-9",
      title: "Heap Operations",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 85,
      participants: 398,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-10",
      title: "Backtracking Problems",
      difficulty: "Hard",
      startTime: new Date().toISOString(),
      duration_minutes: 120,
      participants: 234,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-11",
      title: "Advanced Dynamic Programming",
      difficulty: "Hard",
      startTime: new Date().toISOString(),
      duration_minutes: 150,
      participants: 189,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-12",
      title: "Trie Data Structure",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 70,
      participants: 345,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-13",
      title: "Union Find Algorithm",
      difficulty: "Hard",
      startTime: new Date().toISOString(),
      duration_minutes: 110,
      participants: 156,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-14",
      title: "Bit Manipulation Tricks",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 65,
      participants: 278,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-15",
      title: "Shortest Path Algorithms",
      difficulty: "Hard",
      startTime: new Date().toISOString(),
      duration_minutes: 130,
      participants: 123,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-16",
      title: "Greedy Algorithm Patterns",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 95,
      participants: 456,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-17",
      title: "Segment Tree Fundamentals",
      difficulty: "Hard",
      startTime: new Date().toISOString(),
      duration_minutes: 140,
      participants: 87,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-18",
      title: "Matrix Problems Collection",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 85,
      participants: 367,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-19",
      title: "Binary Tree Advanced",
      difficulty: "Hard",
      startTime: new Date().toISOString(),
      duration_minutes: 125,
      participants: 145,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-20",
      title: "Hash Table Mastery",
      difficulty: "Easy",
      startTime: new Date().toISOString(),
      duration_minutes: 55,
      participants: 789,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-21",
      title: "Recursive Problem Solving",
      difficulty: "Medium",
      startTime: new Date().toISOString(),
      duration_minutes: 90,
      participants: 423,
      maxParticipants: 9999,
      category: "arena"
    },
    {
      id: "mock-22",
      title: "Advanced Graph Algorithms",
      difficulty: "Hard",
      startTime: new Date().toISOString(),
      duration_minutes: 160,
      participants: 98,
      maxParticipants: 9999,
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
                         (competition.company && competition.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "All" || competition.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  // Separate scheduled, mock, and hiring competitions
  const scheduledCompetitions = filteredCompetitions.filter(comp => 
    comp.category === "arena" && !comp.id.startsWith("mock-")
  );
  const mockArenaCompetitions = filteredCompetitions.filter(comp => 
    comp.category === "arena" && comp.id.startsWith("mock-")
  );
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

        {/* Mock Competitions - Always Available */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Practice Arena</h2>
            <Badge variant="secondary">Available Anytime</Badge>
          </div>
          
          {mockArenaCompetitions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockArenaCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <Code className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No practice competitions match your filters.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Scheduled Arena Competitions */}
        {scheduledCompetitions.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Scheduled Competitions</h2>
              <Badge variant="secondary">Timed Events</Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scheduledCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          </section>
        )}

        {/* Hiring Competitions */}
        {hiringCompetitions.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Hiring Competitions</h2>
              <Badge variant="secondary">Career Opportunities</Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hiringCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Competitions;
