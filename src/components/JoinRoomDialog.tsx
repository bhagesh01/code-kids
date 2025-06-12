
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

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinRoomDialog = ({ open, onOpenChange }: JoinRoomDialogProps) => {
  const { user } = useAuth();
  const [roomKey, setRoomKey] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (!user) {
      toast.error("You must be logged in to join a room");
      return;
    }

    if (!roomKey.trim()) {
      toast.error("Room key is required");
      return;
    }

    setIsJoining(true);

    try {
      // Check if room exists and is active
      const { data: roomData, error: roomError } = await supabase
        .from('competition_rooms')
        .select(`
          id,
          name,
          max_participants,
          room_participants(count)
        `)
        .eq('room_key', roomKey.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (roomError) {
        if (roomError.code === 'PGRST116') {
          throw new Error("Room not found or inactive");
        }
        throw roomError;
      }

      // Check if room is full
      const currentParticipants = roomData.room_participants[0]?.count || 0;
      if (currentParticipants >= roomData.max_participants) {
        throw new Error("Room is full");
      }

      // Check if user is already in the room
      const { data: existingParticipant } = await supabase
        .from('room_participants')
        .select('id')
        .eq('room_id', roomData.id)
        .eq('user_id', user.id)
        .single();

      if (existingParticipant) {
        toast.info("You are already in this room");
        onOpenChange(false);
        return;
      }

      // Join the room
      const { error: joinError } = await supabase
        .from('room_participants')
        .insert({
          room_id: roomData.id,
          user_id: user.id,
        });

      if (joinError) {
        throw joinError;
      }

      toast.success(`Successfully joined "${roomData.name}"!`);
      setRoomKey("");
      onOpenChange(false);

    } catch (error: any) {
      console.error("Error joining room:", error);
      toast.error(error.message || "Failed to join room");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Competition Room</DialogTitle>
          <DialogDescription>
            Enter the room key provided by your friend to join their competition room.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="room-key">Room Key</Label>
            <Input
              id="room-key"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
              placeholder="Enter 6-character room key"
              maxLength={6}
              className="uppercase"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleJoinRoom} disabled={isJoining || roomKey.length !== 6}>
            {isJoining ? "Joining..." : "Join Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomDialog;
