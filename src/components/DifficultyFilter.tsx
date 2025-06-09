
import { Button } from "@/components/ui/button";

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

interface DifficultyFilterProps {
  value: DifficultyFilter;
  onValueChange: (difficulty: DifficultyFilter) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ value, onValueChange }) => {
  const handleFilterClick = (difficulty: DifficultyFilter) => {
    onValueChange(difficulty);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={value === "All" ? "default" : "outline"}
        className={`rounded-full hover-scale ${value === "All" ? "bg-primary" : ""}`}
        onClick={() => handleFilterClick("All")}
      >
        All
      </Button>
      <Button
        variant={value === "Easy" ? "default" : "outline"}
        className={`rounded-full hover-scale ${value === "Easy" ? "bg-green-500" : ""}`}
        onClick={() => handleFilterClick("Easy")}
      >
        Easy
      </Button>
      <Button
        variant={value === "Medium" ? "default" : "outline"}
        className={`rounded-full hover-scale ${value === "Medium" ? "bg-yellow-500" : ""}`}
        onClick={() => handleFilterClick("Medium")}
      >
        Medium
      </Button>
      <Button
        variant={value === "Hard" ? "default" : "outline"}
        className={`rounded-full hover-scale ${value === "Hard" ? "bg-red-500" : ""}`}
        onClick={() => handleFilterClick("Hard")}
      >
        Hard
      </Button>
    </div>
  );
};

export default DifficultyFilter;
