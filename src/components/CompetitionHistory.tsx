
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface HistoryItem {
  id: string;
  date: string;
  competition: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rank: number;
  participants: number;
  score: number;
}

interface CompetitionHistoryProps {
  history: HistoryItem[];
}

const CompetitionHistory: React.FC<CompetitionHistoryProps> = ({ history }) => {
  // Helper function to get badge color based on difficulty
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Badge className="bg-green-500">Easy</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'Hard':
        return <Badge className="bg-red-500">Hard</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Function to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Function to get rank style
  const getRankStyle = (rank: number, participants: number) => {
    // Top 25%
    if (rank <= Math.ceil(participants * 0.25)) {
      return "text-green-600 font-bold";
    }
    // Top 50%
    if (rank <= Math.ceil(participants * 0.5)) {
      return "text-blue-600";
    }
    return "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Your competition history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Competition</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="text-right">Rank</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                You haven't participated in any competitions yet
              </TableCell>
            </TableRow>
          ) : (
            history.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>{item.competition}</TableCell>
                <TableCell>{getDifficultyBadge(item.difficulty)}</TableCell>
                <TableCell className={`text-right ${getRankStyle(item.rank, item.participants)}`}>
                  {item.rank}/{item.participants}
                </TableCell>
                <TableCell className="text-right">{item.score}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompetitionHistory;
