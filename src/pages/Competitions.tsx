
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

// Define types for the competitions data - matching CompetitionCard interface
interface CompetitionData {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description?: string;
  category: "practice" | "scheduled";
  start_time?: string;
  duration_minutes: number;
  max_participants?: number;
  participants?: number;
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
          description: comp.description || undefined,
          difficulty: comp.difficulty as "Easy" | "Medium" | "Hard",
          category: comp.category as "practice" | "scheduled",
          start_time: comp.start_time || undefined,
          duration_minutes: comp.duration_minutes,
          max_participants: comp.max_participants || undefined,
          participants: Math.floor(Math.random() * 50) // Mock participant count for now
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
                         (competition.description && competition.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "All" || competition.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  // Separate practice and scheduled competitions
  const practiceCompetitions = filteredCompetitions.filter(comp => comp.category === "practice");
  const scheduledCompetitions = filteredCompetitions.filter(comp => comp.category === "scheduled");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading competitions...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Coding Competitions</h1>
            <p className="text-muted-foreground">
              Practice your skills or compete in live tournaments
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => navigate("/rooms")} variant="outline" className="hover-scale">
              <Users className="mr-2 h-4 w-4" />
              Competition Rooms
            </Button>
            
            {user?.role === "recruiter" || user?.role === "admin" ? (
              <Button onClick={() => navigate("/create-competition")} className="hover-scale">
                <Plus className="mr-2 h-4 w-4" />
                Create Competition
              </Button>
            ) : null}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

        {/* Practice Competitions Section */}
        {practiceCompetitions.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Code className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-semibold">Practice Problems</h2>
              <Badge variant="secondary">{practiceCompetitions.length}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          </section>
        )}

        {/* Scheduled Competitions Section */}
        {scheduledCompetitions.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-green-600" />
              <h2 className="text-2xl font-semibold">Scheduled Competitions</h2>
              <Badge variant="secondary">{scheduledCompetitions.length}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
