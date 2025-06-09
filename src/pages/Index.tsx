import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { Code, Trophy, Users, Zap, Star, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const IndexPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container flex items-center justify-center flex-grow">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          <Card className="bg-gradient-to-br from-primary/80 to-secondary/80 text-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-start justify-between p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Code Challenges</h2>
              </div>
              <p className="text-sm text-white/80">Sharpen your coding skills with fun challenges.</p>
              <Button variant="secondary" onClick={() => navigate("/competitions")}>
                Explore Challenges
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-start justify-between p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Compete & Win</h2>
              </div>
              <p className="text-sm text-white/80">Join competitions and climb the leaderboard.</p>
              <Button variant="secondary" onClick={() => navigate("/competitions")}>
                Join a Competition
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-start justify-between p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Community</h2>
              </div>
              <p className="text-sm text-white/80">Connect with other developers and share your knowledge.</p>
              <Button variant="secondary" onClick={() => navigate("/community")}>
                Explore Community
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-start justify-between p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Quick Tips</h2>
              </div>
              <p className="text-sm text-white/80">Learn new tricks and shortcuts to boost your productivity.</p>
              <Button variant="secondary" onClick={() => navigate("/tips")}>
                Discover Tips
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-start justify-between p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Achievements</h2>
              </div>
              <p className="text-sm text-white/80">Track your progress and unlock achievements.</p>
              <Button variant="secondary" onClick={() => navigate("/achievements")}>
                View Achievements
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-start justify-between p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Practice Arena</h2>
              </div>
              <p className="text-sm text-white/80">Hone your skills in a practice environment.</p>
              <Button variant="secondary" onClick={() => navigate("/practice")}>
                Enter Arena
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
