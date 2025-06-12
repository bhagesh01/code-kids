
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CreateRoomDialog from "@/components/CreateRoomDialog";
import JoinRoomDialog from "@/components/JoinRoomDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Key, Clock, Trophy, Copy } from "lucide-react";

interface Room {
  id: string;
  room_key: string;
  name: string;
  description: string | null;
  created_by: string;
  max_participants: number;
  is_active: boolean;
  created_at: string;
  competition?: {
    title: string;
    difficulty: string;
  } | null;
  room_participants: Array<{
    user_id: string;
    profiles: {
      name: string;
    } | null;
  }>;
  creator_profile: {
    name: string;
  } | null;
}

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [competitions, setCompetitions] = useState<Array<{id: string, title: string, difficulty: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchCompetitions();
  }, [user]);

  const fetchRooms = async () => {
    if (!user) return;

    try {
      // First get the rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('competition_rooms')
        .select(`
          *,
          competitions(title, difficulty)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (roomsError) {
        console.error("Error fetching rooms:", roomsError);
        return;
      }

      // Then get room participants with their profiles
      const roomsWithParticipants = await Promise.all(
        (roomsData || []).map(async (room) => {
          const { data: participantsData } = await supabase
            .from('room_participants')
            .select(`
              user_id,
              profiles(name)
            `)
            .eq('room_id', room.id);

          // Get creator profile
          const { data: creatorProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', room.created_by)
            .single();

          return {
            ...room,
            competition: room.competitions,
            room_participants: participantsData || [],
            creator_profile: creatorProfile
          };
        })
      );

      setRooms(roomsWithParticipants);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('id, title, difficulty')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching competitions:", error);
        return;
      }

      setCompetitions(data || []);
    } catch (error) {
      console.error("Error fetching competitions:", error);
    }
  };

  const copyRoomKey = (roomKey: string) => {
    navigator.clipboard.writeText(roomKey);
    toast.success("Room key copied to clipboard!");
  };

  const leaveRoom = async (roomId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('room_participants')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast.success("Left room successfully");
      fetchRooms();
    } catch (error: any) {
      console.error("Error leaving room:", error);
      toast.error("Failed to leave room");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading rooms...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Competition Rooms</h1>
            <p className="text-muted-foreground">
              Create private rooms or join friends for coding competitions
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setJoinDialogOpen(true)} variant="outline">
              <Key className="mr-2 h-4 w-4" />
              Join Room
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Button>
          </div>
        </div>

        {/* Rooms Grid */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const isParticipant = room.room_participants.some(p => p.user_id === user?.id);
              const isCreator = room.created_by === user?.id;
              
              return (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                        <CardDescription className="mt-1">
                          by {room.creator_profile?.name || 'Unknown'}
                        </CardDescription>
                      </div>
                      {isCreator && (
                        <Badge variant="secondary">Creator</Badge>
                      )}
                      {isParticipant && !isCreator && (
                        <Badge variant="outline">Joined</Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {room.description && (
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                    )}
                    
                    {room.competition && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">{room.competition.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {room.competition.difficulty}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{room.room_participants.length}/{room.max_participants}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Key:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                          {room.room_key}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyRoomKey(room.room_key)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {isParticipant && !isCreator && (
                      <Button
                        onClick={() => leaveRoom(room.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Leave Room
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active rooms found. Create one to get started!</p>
            </CardContent>
          </Card>
        )}
      </main>

      <CreateRoomDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        competitions={competitions}
        onRoomCreated={fetchRooms}
      />
      
      <JoinRoomDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onRoomJoined={fetchRooms}
      />
    </div>
  );
};

export default Rooms;
