import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Twitter,
  RefreshCw,
  Settings,
  BarChart3,
  Calendar
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const AccountsPage = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const connectedAccounts = [
    {
      id: "facebook-page-1",
      type: "facebook",
      name: "Your Business Page",
      username: "@yourbusiness",
      followers: 12500,
      status: "connected",
      lastSync: "2 minutes ago",
      postsThisMonth: 18,
      engagement: 94,
      avatar: "FB"
    },
    {
      id: "instagram-1", 
      type: "instagram",
      name: "Your Instagram Business",
      username: "@yourbusiness.ig",
      followers: 8750,
      status: "connected",
      lastSync: "5 minutes ago",
      postsThisMonth: 24,
      engagement: 87,
      avatar: "IG"
    },
    {
      id: "linkedin-1",
      type: "linkedin", 
      name: "Your Company Page",
      username: "your-company",
      followers: 3200,
      status: "warning",
      lastSync: "2 hours ago",
      postsThisMonth: 12,
      engagement: 76,
      avatar: "LI",
      warning: "Token expires in 3 days"
    },
    {
      id: "twitter-1",
      type: "twitter",
      name: "Your Twitter",
      username: "@yourbusiness",
      followers: 5600,
      status: "disconnected",
      lastSync: "Never",
      postsThisMonth: 0,
      engagement: 0,
      avatar: "TW"
    }
  ];

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
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      description: "Connect your Twitter account",
      color: "twitter"
    }
  ];

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Account connected!",
      description: `Your ${platformId} account has been connected successfully.`,
    });
    
    setIsConnecting(null);
  };

  const handleDisconnect = (accountId: string, platformName: string) => {
    toast({
      title: "Account disconnected",
      description: `Your ${platformName} account has been disconnected.`,
    });
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

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement Rate</span>
                      <span>{account.engagement}%</span>
                    </div>
                    <Progress value={account.engagement} className="h-2" />
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