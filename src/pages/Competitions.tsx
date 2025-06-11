
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
import { supabase } from "@/integrations/supabase/client";

// Define types for the competitions data - matching database structure
interface CompetitionData {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  startTime: string;
  duration_minutes: number;
  participants: number;
  maxParticipants: number;
  category: "practice" | "scheduled"; // Match database categories
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

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        console.log("Fetching competitions from Supabase...");
        
        const { data, error } = await supabase
          .from('competitions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching competitions:", error);
          setLoading(false);
          return;
        }

        console.log("Fetched competitions:", data);

        // Transform Supabase data to match our interface
        const transformedCompetitions: CompetitionData[] = data.map(comp => ({
          id: comp.id,
          title: comp.title,
          difficulty: comp.difficulty as "Easy" | "Medium" | "Hard",
          startTime: comp.start_time || new Date().toISOString(),
          duration_minutes: comp.duration_minutes,
          participants: Math.floor(Math.random() * 100), // Mock participant count
          maxParticipants: comp.max_participants || 100,
          category: comp.category as "practice" | "scheduled"
        }));

        setCompetitions(transformedCompetitions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching competitions:", error);
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  // Filter competitions based on search and difficulty
  const filteredCompetitions = competitions.filter((competition) => {
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (competition.company && competition.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "All" || competition.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  // Separate practice and scheduled competitions
  const practiceCompetitions = filteredCompetitions.filter(comp => comp.category === "practice");
  const scheduledCompetitions = filteredCompetitions.filter(comp => comp.category === "scheduled");

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

        {/* Practice Competitions - Always Available */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Practice Arena</h2>
            <Badge variant="secondary">Available Anytime</Badge>
          </div>
          
          {practiceCompetitions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {practiceCompetitions.map((competition) => (
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

        {/* Scheduled Competitions */}
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

        {/* Show message if no competitions found */}
        {filteredCompetitions.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No competitions found. Try adjusting your filters.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Competitions;
