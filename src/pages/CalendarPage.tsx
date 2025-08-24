import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState("all");

  // Mock data for scheduled posts
  const scheduledPosts = [
    {
      id: 1,
      title: "Product Launch Announcement",
      content: "Excited to announce our new product line! 🚀",
      platform: "facebook",
      date: new Date(2024, 11, 15, 14, 0), // December 15, 2024, 2:00 PM
      status: "scheduled",
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      title: "Behind the scenes",
      content: "Take a look at our creative process...",
      platform: "instagram", 
      date: new Date(2024, 11, 16, 10, 30),
      status: "scheduled",
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 3,
      title: "Industry Insights",
      content: "Key trends shaping our industry in 2024",
      platform: "linkedin",
      date: new Date(2024, 11, 18, 9, 0),
      status: "scheduled", 
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 4,
      title: "Customer Success Story",
      content: "Amazing results from our client partnership",
      platform: "facebook",
      date: new Date(2024, 11, 20, 16, 0),
      status: "scheduled",
      engagement: { likes: 0, comments: 0, shares: 0 }
    }
  ];

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "facebook" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "instagram" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "linkedin" }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getPostsForDate = (date: Date) => {
    if (!date) return [];
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.date);
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear() &&
             (selectedPlatformFilter === "all" || post.platform === selectedPlatformFilter);
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : Clock;
  };

  const getPlatformColor = (platformId: string) => {
    const colorMap = {
      facebook: 'bg-[hsl(var(--facebook))]',
      instagram: 'bg-[hsl(var(--instagram))]',
      linkedin: 'bg-[hsl(var(--linkedin))]'
    };
    return colorMap[platformId as keyof typeof colorMap] || 'bg-muted';
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-primary" />
              Content Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and schedule your social media posts
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedPlatformFilter} onValueChange={setSelectedPlatformFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-gradient-brand hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Calendar Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">{monthYear}</h2>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={viewMode === "month" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("month")}
                >
                  Month
                </Button>
                <Button 
                  variant={viewMode === "week" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("week")}
                >
                  Week
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Week day headers */}
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((date, index) => {
                const postsForDate = date ? getPostsForDate(date) : [];
                const isToday = date && 
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border rounded-lg ${
                      date ? "hover:bg-muted/50 cursor-pointer" : ""
                    } ${isToday ? "bg-primary/10 border-primary/20" : ""}`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          isToday ? "text-primary" : "text-foreground"
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {postsForDate.slice(0, 3).map((post) => {
                            const PlatformIcon = getPlatformIcon(post.platform);
                            return (
                              <div
                                key={post.id}
                                className="group relative p-2 bg-background border rounded text-xs hover:shadow-sm transition-all"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${getPlatformColor(post.platform)}`}>
                                    <PlatformIcon className="w-2 h-2 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{post.title}</p>
                                    <p className="text-muted-foreground">{formatTime(post.date)}</p>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="w-3 h-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Edit className="w-3 h-3 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Calendar className="w-3 h-3 mr-2" />
                                        Reschedule
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="w-3 h-3 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            );
                          })}
                          {postsForDate.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center p-1">
                              +{postsForDate.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Posts</CardTitle>
            <CardDescription>
              Posts scheduled for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledPosts
                .filter(post => {
                  const postDate = new Date(post.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return postDate >= today && postDate <= weekFromNow;
                })
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((post) => {
                  const PlatformIcon = getPlatformIcon(post.platform);
                  return (
                    <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getPlatformColor(post.platform)}`}>
                        <PlatformIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {post.date.toLocaleDateString()} at {formatTime(post.date)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="w-4 h-4 mr-2" />
                            Post Now
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;