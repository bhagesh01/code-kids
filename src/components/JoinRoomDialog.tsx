
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomJoined?: () => void;
}

const JoinRoomDialog = ({ open, onOpenChange, onRoomJoined }: JoinRoomDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roomKey, setRoomKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !roomKey.trim()) return;

    setLoading(true);
    try {
      // First, check if the room exists and is active
      const { data: room, error: roomError } = await supabase
        .from('competition_rooms')
        .select('id, name, max_participants, room_participants(user_id)')
        .eq('room_key', roomKey.toUpperCase())
        .eq('is_active', true)
        .single();

      if (roomError || !room) {
        toast.error("Room not found or inactive");
        return;
      }

      // Check if user is already in the room
      const isAlreadyParticipant = room.room_participants.some(
        (p: any) => p.user_id === user.id
      );

      if (isAlreadyParticipant) {
        toast.error("You are already in this room");
        return;
      }

      // Check if room is full
      if (room.room_participants.length >= room.max_participants) {
        toast.error("Room is full");
        return;
      }

      // Join the room
      const { error } = await supabase
        .from('room_participants')
        .insert({
          room_id: room.id,
          user_id: user.id
        });

      if (error) {
        throw error;
      }

      toast.success(`Successfully joined "${room.name}"!`);
      setRoomKey("");
      onOpenChange(false);
      onRoomJoined?.();
    } catch (error: any) {
      console.error("Error joining room:", error);
      toast.error("Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Competition Room</DialogTitle>
          <DialogDescription>
            Enter the room key shared by your friend to join their competition room.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomKey">Room Key</Label>
            <Input
              id="roomKey"
              placeholder="Enter 6-character room key"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
              maxLength={6}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !roomKey.trim()}>
              {loading ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomDialog;
