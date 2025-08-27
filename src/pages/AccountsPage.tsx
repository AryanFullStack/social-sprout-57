import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Facebook,
  Instagram,
  Linkedin,
  RefreshCw,
  Settings,
  BarChart3,
  Calendar
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const AccountsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchSocialAccounts();
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
    
    // Check for OAuth callback results
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get('connected');
    const account = urlParams.get('account');
    const error = urlParams.get('error');

    if (connected && account) {
      toast({
        title: "Account connected!",
        description: `Your ${connected} account (${account}) has been connected successfully.`,
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => fetchSocialAccounts(), 500);
    } else if (error) {
      toast({
        title: "Connection failed",
        description: error,
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchSocialAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSocialAccounts(data || []);
    } catch (error) {
      console.error('Error fetching social accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load social accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const connectedAccounts = socialAccounts.map(account => ({
    id: account.id,
    type: account.platform,
    name: account.account_name,
    username: account.account_id,
    followers: 0, // This would come from actual API data
    status: account.is_active ? "connected" : "disconnected",
    lastSync: account.last_sync_at ? new Date(account.last_sync_at).toLocaleDateString() : "Never",
    postsThisMonth: 0, // This would be calculated from posts
    engagement: 0, // This would come from analytics
    avatar: account.platform.substring(0, 2).toUpperCase(),
    warning: account.last_error
  }));

  const availablePlatforms = [
    {
      id: "facebook",
      name: "Facebook Pages",
      icon: Facebook,
      description: "Connect your Facebook business pages",
      color: "facebook"
    },
    {
      id: "instagram", 
      name: "Instagram Business",
      icon: Instagram,
      description: "Connect your Instagram business account",
      color: "instagram"
    },
    {
      id: "linkedin",
      name: "LinkedIn Company",
      icon: Linkedin, 
      description: "Connect your LinkedIn company pages",
      color: "linkedin"
    }
  ];

  const handleConnect = async (platformId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect social accounts.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsConnecting(platformId);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase.functions.invoke('oauth-connect', {
        body: { 
          platform: platformId,
          redirectUrl: window.location.href 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      // Redirect to OAuth provider
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to initiate connection. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string, platformName: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      toast({
        title: "Account disconnected",
        description: `Your ${platformName} account has been disconnected.`,
      });

      // Refresh the accounts list
      fetchSocialAccounts();
    } catch (error) {
      console.error('Disconnect error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReconnect = async (accountId: string, platformName: string) => {
    setIsConnecting(accountId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Account reconnected!",
      description: `Your ${platformName} account has been reconnected successfully.`,
    });
    
    setIsConnecting(null);
  };

  const getPlatformIcon = (type: string) => {
    const platform = availablePlatforms.find(p => p.id === type);
    return platform ? platform.icon : Users;
  };

  const getPlatformColor = (type: string) => {
    const colorMap = {
      facebook: 'bg-[hsl(var(--facebook))]',
      instagram: 'bg-[hsl(var(--instagram))]',
      linkedin: 'bg-[hsl(var(--linkedin))]',
      twitter: 'bg-[hsl(var(--twitter))]'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-muted';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-warning text-warning-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Needs Attention
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              {!user ? "Checking authentication..." : "Loading accounts..."}
            </p>
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
              <Users className="w-8 h-8 mr-3 text-primary" />
              Connected Accounts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your social media account connections and monitor their health
            </p>
          </div>
          <Button className="bg-gradient-brand hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Connect New Account
          </Button>
        </div>

        {/* Account Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold">
                    {connectedAccounts.filter(acc => acc.status === "connected").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold">
                    {connectedAccounts.filter(acc => acc.status === "warning").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {formatFollowers(connectedAccounts.reduce((sum, acc) => sum + acc.followers, 0))}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">
                    {connectedAccounts.reduce((sum, acc) => sum + acc.postsThisMonth, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Posts This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Accounts Grid */}
        {connectedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connectedAccounts.map((account) => {
              const PlatformIcon = getPlatformIcon(account.type);
              return (
                <Card key={account.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${getPlatformColor(account.type)}`}>
                          <PlatformIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{account.name}</CardTitle>
                          <CardDescription>{account.username}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(account.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {account.warning && (
                      <div className="p-3 bg-warning-muted border border-warning/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-sm text-warning">{account.warning}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">{formatFollowers(account.followers)}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{account.postsThisMonth}</p>
                        <p className="text-xs text-muted-foreground">Posts</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{account.engagement}%</p>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last sync: {account.lastSync}</span>
                      <div className="flex items-center space-x-2">
                        {account.status === "connected" && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Sync
                          </Button>
                        )}
                        {account.status === "warning" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReconnect(account.id, account.name)}
                            disabled={isConnecting === account.id}
                          >
                            <RefreshCw className={`w-3 h-3 mr-1 ${isConnecting === account.id ? 'animate-spin' : ''}`} />
                            {isConnecting === account.id ? 'Reconnecting...' : 'Reconnect'}
                          </Button>
                        )}
                        {account.status === "disconnected" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReconnect(account.id, account.name)}
                            disabled={isConnecting === account.id}
                          >
                            <RefreshCw className={`w-3 h-3 mr-1 ${isConnecting === account.id ? 'animate-spin' : ''}`} />
                            {isConnecting === account.id ? 'Connecting...' : 'Connect'}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analytics
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Settings
                      </Button>
                      {account.status === "connected" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDisconnect(account.id, account.name)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No accounts connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your social media accounts to start managing your content.
              </p>
              <Button className="bg-gradient-brand hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Available Platforms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connect More Platforms</CardTitle>
            <CardDescription>
              Expand your reach by connecting additional social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availablePlatforms
                .filter(platform => !connectedAccounts.some(acc => acc.type === platform.id && acc.status === "connected"))
                .map((platform) => (
                  <div
                    key={platform.id}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getPlatformColor(platform.id)}`}>
                        <platform.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{platform.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {platform.description}
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting === platform.id}
                    >
                      {isConnecting === platform.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;