import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Home,
  Send,
  Bell,
  Search,
  Menu,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import mujLogo from "@/assets/muj-logo.png";

interface Profile {
  enrollment_number: string;
  full_name: string;
  phone: string | null;
  department: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

const navigationItems = [
  { title: "Home", icon: Home, url: "#" },
  { title: "Academics", icon: Send, url: "#" },
  { title: "Finance", icon: Send, url: "#" },
  { title: "Examination", icon: Send, url: "#" },
  { title: "Scholarship", icon: Send, url: "#" },
  { title: "Counselling", icon: Send, url: "#" },
  { title: "E-Library", icon: Send, url: "#" },
];

const AppSidebar = () => {
  return (
    <Sidebar className="border-r-0 bg-[hsl(var(--primary))]">
      <SidebarContent className="bg-[hsl(var(--primary))]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-white/10">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[hsl(var(--primary))]">
        <div className="py-6">
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="text-white hover:bg-white/10">
                  <a href={item.url}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        fetchData(session.user.id);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      } else if (session) {
        setUser(session.user);
        fetchData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch profile (optimized)
      const profileData = await (async () => {
        const {
          data: { user },
          error: sessionErr,
        } = await supabase.auth.getUser();

        if (sessionErr || !user) {
          throw sessionErr ?? new Error('No user found');
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, enrollment_number, phone, department, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error.message);
          throw error;
        }

        return data;
      })();

      setProfile(profileData as unknown as Profile);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (eventsError) {
        console.error("Events error:", eventsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events",
        });
      } else {
        setEvents(eventsData || []);
      }

      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (notificationsError) {
        console.error("Notifications error:", notificationsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notifications",
        });
      } else {
        setNotifications(notificationsData || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="bg-white border-b px-4 py-3 flex items-center gap-4">
            <MobileSidebar />
            
            <div className="hidden md:block">
              <img src={mujLogo} alt="Manipal University Jaipur" className="h-10" />
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:flex items-center gap-3">
                {loading ? (
                  <Skeleton className="h-10 w-32" />
                ) : profile ? (
                  <div className="text-right text-sm">
                    <div className="font-medium">{profile.enrollment_number}</div>
                    <div className="text-muted-foreground">{profile.full_name}</div>
                  </div>
                ) : (
                  <div className="text-right text-sm">
                    <div className="font-medium">{user.email}</div>
                  </div>
                )}
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-[hsl(var(--primary))] text-white">
                    {profile ? profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Class Coordinator Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Class Coordinator Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-24">Name:</span>
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      MR. SURBHI SYAL
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-24">Email:</span>
                    <a href="mailto:surbhi.syal@jaipur.manipal.edu" className="text-blue-600 hover:underline">
                      surbhi.syal@jaipur.manipal.edu
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-24">Phone:</span>
                    <span>7973729102</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-24">Department:</span>
                    <span>DOCSE</span>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications and Events */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : notifications.length > 0 ? (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="border-b pb-3 last:border-0">
                            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(notification.created_at), "MMM dd, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No notifications at the moment.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>List of Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : events.length > 0 ? (
                      <div className="space-y-4">
                        {events.map((event) => (
                          <div key={event.id} className="border-b pb-3 last:border-0">
                            <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                            )}
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>{format(new Date(event.event_date), "MMM dd, yyyy")}</span>
                              {event.location && <span>{event.location}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No upcoming events.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
