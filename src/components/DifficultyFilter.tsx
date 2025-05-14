
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DifficultyFilterProps {
  onFilterChange: (difficulty: string | null) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (difficulty: string | null) => {
    if (activeFilter === difficulty) {
      setActiveFilter(null);
      onFilterChange(null);
    } else {
      setActiveFilter(difficulty);
      onFilterChange(difficulty);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeFilter === null ? "default" : "outline"}
        className={`rounded-full hover-scale ${activeFilter === null ? "bg-primary" : ""}`}
        onClick={() => handleFilterClick(null)}
      >
        All
      </Button>
      <Button
        variant={activeFilter === "Easy" ? "default" : "outline"}
        className={`rounded-full hover-scale ${activeFilter === "Easy" ? "bg-green-500" : ""}`}
        onClick={() => handleFilterClick("Easy")}
      >
        Easy
      </Button>
      <Button
        variant={activeFilter === "Medium" ? "default" : "outline"}
        className={`rounded-full hover-scale ${activeFilter === "Medium" ? "bg-yellow-500" : ""}`}
        onClick={() => handleFilterClick("Medium")}
      >
        Medium
      </Button>
      <Button
        variant={activeFilter === "Hard" ? "default" : "outline"}
        className={`rounded-full hover-scale ${activeFilter === "Hard" ? "bg-red-500" : ""}`}
        onClick={() => handleFilterClick("Hard")}
      >
        Hard
      </Button>
    </div>
  );
};

export default DifficultyFilter;
