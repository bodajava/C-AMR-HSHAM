import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '@/api/user';
import { useAssignment } from '@/context/assignment-context';
import { toast } from 'sonner';
import { 
  Users, 
  Dumbbell, 
  Apple, 
  Shield, 
  User as UserIcon,
  Search,
  Loader2,
  CheckCircle2,
  PlusCircle,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminClientsPage = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setAssignmentTarget } = useAssignment();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clientsRes = await userApi.adminGetClients();
      setClients(clientsRes.data?.clients || []);
    } catch (error: any) {
      console.error('Fetch Error:', error);
      toast.error(`Failed to fetch dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    (client.userName || client.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (client.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Client Management
          </h1>
          <p className="text-muted-foreground">Manage your gym members and assign personalized programs.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading clients...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Card key={client._id} className="overflow-hidden border-border/40 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={client.profilePicture ? `${import.meta.env.VITE_API_URL}/upload/${client.profilePicture}` : ''} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {client.userName?.substring(0, 2).toUpperCase() || client.name?.substring(0, 2).toUpperCase() || 'CL'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{client.userName || client.name || 'Anonymous'}</CardTitle>
                      <CardDescription className="truncate text-xs">{client.email}</CardDescription>
                    </div>
                    {client.role === 1 && (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        <Shield className="w-3 h-3 mr-1" /> Admin
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-accent/20 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground">
                        <Dumbbell className="w-3 h-3" /> Workout
                      </div>
                      <div className="text-xs font-semibold truncate">
                        {client.assignedWorkouts?.length > 0 ? (
                          <span className="text-primary flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Assigned
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50 italic">None</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-accent/20 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground">
                        <Apple className="w-3 h-3" /> Meal Plan
                      </div>
                      <div className="text-xs font-semibold truncate">
                        {client.assignedMeals?.length > 0 ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Assigned
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50 italic">None</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 gap-2"
                      asChild
                    >
                      <Link to={`/admin/clients/${client._id}/program`}>
                        <PlusCircle className="w-4 h-4" />
                        Assign Program
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" asChild>
                      <a href={`mailto:${client.email}`}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-accent/5 border-2 border-dashed rounded-3xl">
              <UserIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No clients found</h3>
              <p className="text-sm text-muted-foreground/60">Registered users with CLIENT role will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;
