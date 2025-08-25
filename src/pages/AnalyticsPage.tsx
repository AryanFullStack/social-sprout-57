import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageSquare, 
  Share, 
  Calendar,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [posts, setPosts] = useState([]);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsResponse, accountsResponse] = await Promise.all([
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('social_accounts').select('*')
      ]);

      if (postsResponse.error) throw postsResponse.error;
      if (accountsResponse.error) throw accountsResponse.error;

      setPosts(postsResponse.data || []);
      setSocialAccounts(accountsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyticsData = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    totalReach: 45600,
    totalEngagement: 3240,
    engagementRate: 7.1,
    trend: "+12%"
  };

  const platformMetrics = [
    { platform: "Facebook", posts: 12, reach: 18500, engagement: 1250, rate: 6.8 },
    { platform: "Instagram", posts: 8, reach: 15200, engagement: 1180, rate: 7.8 },
    { platform: "LinkedIn", posts: 6, reach: 11900, engagement: 810, rate: 6.8 }
  ];

  const topPosts = posts.slice(0, 5).map((post, index) => ({
    id: post.id,
    title: post.title || 'Untitled Post',
    platform: post.platforms?.[0] || 'facebook',
    engagement: 150 - (index * 20),
    reach: 2500 - (index * 300),
    date: new Date(post.created_at).toLocaleDateString()
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your social media performance and engagement
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalPosts}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">{analyticsData.trend}</span>
                <span>from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalReach.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">+8%</span>
                <span>from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalEngagement.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">+15%</span>
                <span>from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.engagementRate}%</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span className="text-destructive">-2%</span>
                <span>from last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Breakdown by social media platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {platformMetrics.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{platform.platform}</span>
                      <span className="text-sm text-muted-foreground">{platform.rate}% engagement</span>
                    </div>
                    <Progress value={platform.rate * 10} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>Posts: {platform.posts}</div>
                      <div>Reach: {platform.reach.toLocaleString()}</div>
                      <div>Engagement: {platform.engagement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Your best content this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{post.platform} • {post.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm">
                        <Heart className="w-3 h-3" />
                        <span>{post.engagement}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{post.reach}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>Types of engagement across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold">1,250</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold">340</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share className="w-8 h-8 text-accent" />
                </div>
                <div className="text-2xl font-bold">186</div>
                <div className="text-sm text-muted-foreground">Shares</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;