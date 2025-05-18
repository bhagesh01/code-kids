
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface LobbyViewProps {
  competitionData: {
    title: string;
    difficulty: string;
    duration: number;
    startTime: Date;
  };
  onCompetitionStart: (duration: number) => void;
}

const LobbyView = ({ competitionData, onCompetitionStart }: LobbyViewProps) => {
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [isNotified, setIsNotified] = useState(false);
  
  // Format time display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleNotifyMe = () => {
    setShowNotifyDialog(true);
  };
  
  const handleSubmitEmail = () => {
    // Email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsNotified(true);
    setShowNotifyDialog(false);
    
    // Logic to store the email for notifications would go here
    // For now, we'll just show a success toast
    toast.success(`You'll be notified at ${email} when the competition starts`);
    
    // Simulate the competition starting immediately for arena competitions
    if (competitionData.startTime.getTime() <= Date.now()) {
      onCompetitionStart(competitionData.duration * 60);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <h1 className="font-bold">{competitionData.title}</h1>
            <Badge className={
              competitionData.difficulty === "Easy" ? "bg-green-500" : 
              competitionData.difficulty === "Medium" ? "bg-yellow-500" : 
              "bg-red-500"
            }>
              {competitionData.difficulty}
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Competition Details</h2>
                <p className="text-muted-foreground mb-4">
                  Get notified when this competition starts.
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-xl font-bold">
                <Clock className="w-6 h-6 text-primary" />
                <span>Starts: {formatDate(competitionData.startTime)}</span>
              </div>
              
              <div className="w-full space-y-2">
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Title:</span> {competitionData.title}</p>
                  <p><span className="font-medium">Difficulty:</span> {competitionData.difficulty}</p>
                  <p><span className="font-medium">Duration:</span> {competitionData.duration} minutes</p>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleNotifyMe}
                disabled={isNotified}
              >
                {isNotified ? "Notification Set" : "Notify Me"}
                <Bell className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Notification Dialog */}
      <Dialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Notified</DialogTitle>
            <DialogDescription>
              Enter your email to receive notifications about this competition.
              You'll be notified 5 minutes before the competition starts and when it begins.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEmail}>
              Set Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LobbyView;
