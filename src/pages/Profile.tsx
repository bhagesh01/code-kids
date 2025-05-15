import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { HistoryItem } from "@/components/CompetitionHistory";

const Profile = () => {
  const { user } = useAuth();
  const [competitionHistory, setCompetitionHistory] = useState<HistoryItem[]>([]);
  const [userStats, setUserStats] = useState<any>({});
  
  // Generate mock statistics based on the user
  useEffect(() => {
    if (user) {
      // Generate competition history based on user role
      const mockHistory = [
        {
          id: "hist-1",
          date: "2025-05-10",
          competition: "Array Adventures",
          difficulty: "Easy" as const,
          rank: 3,
          participants: 18,
          score: 95,
        },
        {
          id: "hist-2",
          date: "2025-05-05",
          competition: "Function Fundamentals",
          difficulty: "Medium" as const,
          rank: 5,
          participants: 15,
          score: 87,
        }
      ];
      
      // Add role-specific history items
      if (user.role === 'student') {
        mockHistory.push({
          id: "hist-3",
          date: "2025-04-28",
          competition: "Google Hiring Challenge",
          difficulty: "Hard" as const,
          rank: 2,
          participants: 20,
          score: 98,
        });
      } else if (user.role === 'recruiter') {
        mockHistory.push({
          id: "hist-3",
          date: "2025-04-28",
          competition: "Recruiter Workshop",
          difficulty: "Medium" as const,
          rank: 1, // Recruiters always win their own competitions!
          participants: 8,
          score: 100,
        });
      }
      
      setCompetitionHistory(mockHistory);
      
      // Set user stats
      setUserStats({
        totalCompetitions: user.role === 'student' ? 12 : 5,
        wins: user.role === 'student' ? 3 : 2,
        averageRank: user.role === 'student' ? "4th" : "2nd",
        favoriteCategory: user.role === 'student' ? "Arrays" : "Algorithms",
        topLanguage: "JavaScript"
      });
    }
  }, [user]);
  
  const achievements = [
    { id: "a1", name: "First Win", description: "Win your first competition", earned: true },
    { id: "a2", name: "Perfect Score", description: "Score 100 in any competition", earned: user?.role === 'recruiter' },
    { id: "a3", name: "Consistent Coder", description: "Complete 5 competitions in a row", earned: true },
    { id: "a4", name: "Algorithm Expert", description: "Solve a Hard difficulty problem in under 15 minutes", earned: false },
    { id: "a5", name: "Bug Hunter", description: "Fix 10 bugs in practice sessions", earned: user?.role === 'student' },
  ];
  
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
        <ProfileHeader user={user} userStats={userStats} />
        <ProfileTabs 
          competitionHistory={competitionHistory}
          achievements={achievements}
          userStats={userStats}
        />
      </main>
    </div>
  );
};

export default Profile;
