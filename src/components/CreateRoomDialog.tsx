
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competitions: Array<{
    id: string;
    title: string;
    difficulty: string;
  }>;
}

const CreateRoomDialog = ({ open, onOpenChange, competitions }: CreateRoomDialogProps) => {
  const { user } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!user) {
      toast.error("You must be logged in to create a room");
      return;
    }

    if (!roomName.trim()) {
      toast.error("Room name is required");
      return;
    }

    setIsCreating(true);

    try {
      // Generate room key
      const { data: keyData, error: keyError } = await supabase.rpc('generate_room_key');
      
      if (keyError) {
        throw keyError;
      }

      // Create the room
      const { data: roomData, error: roomError } = await supabase
        .from('competition_rooms')
        .insert({
          room_key: keyData,
          name: roomName.trim(),
          description: description.trim() || null,
          created_by: user.id,
          competition_id: selectedCompetition || null,
          max_participants: parseInt(maxParticipants),
        })
        .select()
        .single();

      if (roomError) {
        throw roomError;
      }

      // Add creator as participant
      const { error: participantError } = await supabase
        .from('room_participants')
        .insert({
          room_id: roomData.id,
          user_id: user.id,
        });

      if (participantError) {
        console.error("Error adding creator as participant:", participantError);
      }

      toast.success(`Room created successfully! Room key: ${keyData}`);
      
      // Reset form
      setRoomName("");
      setDescription("");
      setSelectedCompetition("");
      setMaxParticipants("10");
      onOpenChange(false);

    } catch (error: any) {
      console.error("Error creating room:", error);
      toast.error(error.message || "Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Competition Room</DialogTitle>
          <DialogDescription>
            Create a private room where you can invite friends to compete together.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              maxLength={50}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your room"
              maxLength={200}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="competition">Competition (Optional)</Label>
            <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
              <SelectTrigger>
                <SelectValue placeholder="Select a competition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific competition</SelectItem>
                {competitions.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id}>
                    {comp.title} ({comp.difficulty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="max-participants">Max Participants</Label>
            <Select value={maxParticipants} onValueChange={setMaxParticipants}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2, 5, 10, 20, 50].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} participants
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
