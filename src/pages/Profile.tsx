
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { HistoryItem } from "@/components/CompetitionHistory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [competitionHistory, setCompetitionHistory] = useState<HistoryItem[]>([]);
  const [userStats, setUserStats] = useState<any>({});
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user's competition history
        const { data: participations, error: participationsError } = await supabase
          .from('competition_participants')
          .select(`
            *,
            competition:competitions(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (participationsError) throw participationsError;
        
        // Fetch user's achievements
        const { data: userAchievements, error: achievementsError } = await supabase
          .from('user_achievements')
          .select(`
            *,
            achievement:achievements(*)
          `)
          .eq('user_id', user.id);
          
        if (achievementsError) throw achievementsError;
        
        // Transform data for the UI
        const historyItems: HistoryItem[] = participations?.map((item: any) => ({
          id: item.id,
          date: new Date(item.created_at).toISOString().split('T')[0],
          competition: item.competition?.name || "Unknown Competition",
          difficulty: item.competition?.difficulty as "Easy" | "Medium" | "Hard",
          rank: item.rank || 0,
          participants: item.competition?.total_participants || 0,
          score: item.score || 0
        })) || [];
        
        setCompetitionHistory(historyItems);
        
        // Calculate stats based on history
        const totalCompetitions = historyItems.length;
        const wins = historyItems.filter(item => item.rank === 1).length;
        const avgRank = totalCompetitions > 0 
          ? Math.round(historyItems.reduce((acc, curr) => acc + curr.rank, 0) / totalCompetitions) 
          : 0;
          
        setUserStats({
          totalCompetitions,
          wins,
          averageRank: avgRank > 0 ? `${avgRank}${getOrdinalSuffix(avgRank)}` : "N/A",
          favoriteCategory: user.role === 'student' ? "Arrays" : "Algorithms",
          topLanguage: "JavaScript"
        });
        
        // Process achievements
        const processedAchievements = [
          { id: "a1", name: "First Win", description: "Win your first competition", earned: wins > 0 },
          { id: "a2", name: "Perfect Score", description: "Score 100 in any competition", earned: historyItems.some(item => item.score === 100) },
          { id: "a3", name: "Consistent Coder", description: "Complete 5 competitions in a row", earned: totalCompetitions >= 5 },
          { id: "a4", name: "Algorithm Expert", description: "Solve a Hard difficulty problem in under 15 minutes", earned: false },
          { id: "a5", name: "Bug Hunter", description: "Fix 10 bugs in practice sessions", earned: user.role === 'student' },
        ];
        
        setAchievements(processedAchievements);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Helper function for ordinal suffixes
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };
  
  // If no user is loaded yet, display loading
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Loading profile data...</p>
          </div>
        ) : (
          <>
            <ProfileHeader user={user} userStats={userStats} />
            <ProfileTabs 
              competitionHistory={competitionHistory}
              achievements={achievements}
              userStats={userStats}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
