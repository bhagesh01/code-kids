
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProgressBadge from "@/components/ProgressBadge";

interface ProfileHeaderProps {
  user: {
    name: string;
    profileImage?: string;
    role: string;
  };
  userStats: {
    totalCompetitions: number;
    wins: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, userStats }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={user.profileImage} alt={user.name} />
          <AvatarFallback className="text-2xl">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">{user.name}</h1>
          <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
            <Badge variant="outline" className="bg-primary/10">Level 4</Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-700">
              {userStats.totalCompetitions} Competitions
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700">
              {userStats.wins} Wins
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
              {user.role}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-center md:text-left mb-4">
            {user.role === 'student' 
              ? "Coding enthusiast who loves solving problems and learning new algorithms!" 
              : user.role === 'recruiter'
                ? "Tech recruiter looking for top coding talent."
                : "Platform administrator and coding mentor."}
          </p>
          
          <ProgressBadge level={4} progress={65} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
