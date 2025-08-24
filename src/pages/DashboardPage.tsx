import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  PenTool, 
  Clock,
  MessageSquare,
  HelpCircle,
  Plus,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const DashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const kpiData = [
    {
      title: "Scheduled Posts",
      value: 24,
      change: "+12%",
      trend: "up",
      icon: Calendar,
      description: "Posts scheduled for this week"
    },
    {
      title: "Published Posts",
      value: 156,
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      description: "Successfully published this month"
    },
    {
      title: "Failed Posts",
      value: 3,
      change: "-50%",
      trend: "down",
      icon: AlertTriangle,
      description: "Failed posts requiring attention"
    },
    {
      title: "Account Health",
      value: "98%",
      change: "+2%",
      trend: "up",
      icon: Activity,
      description: "Overall account connectivity status"
    }
  ];

  const recentActivity = [
    {
      type: "scheduled",
      title: "New post scheduled for Facebook",
      description: "Marketing campaign for Black Friday",
      time: "2 minutes ago",
      status: "success"
    },
    {
      type: "published",
      title: "Instagram post published",
      description: "Product showcase went live",
      time: "15 minutes ago",
      status: "success"
    },
    {
      type: "failed",
      title: "LinkedIn post failed",
      description: "Authentication error - needs reconnection",
      time: "1 hour ago",
      status: "error"
    },
    {
      type: "scheduled",
      title: "Bulk posts scheduled",
      description: "5 posts scheduled for next week",
      time: "2 hours ago",
      status: "success"
    }
  ];

  const connectedAccounts = [
    { name: "Facebook Page", status: "connected", posts: 12 },
    { name: "Instagram Business", status: "connected", posts: 8 },
    { name: "LinkedIn Company", status: "warning", posts: 4 },
    { name: "Twitter", status: "disconnected", posts: 0 }
  ];

  const quickActions = [
    {
      title: "Create New Post",
      description: "Compose and schedule a new post",
      icon: PenTool,
      action: "/composer",
      gradient: true
    },
    {
      title: "View Calendar",
      description: "See your posting schedule",
      icon: Calendar,
      action: "/calendar"
    },
    {
      title: "Connect Account",
      description: "Add a new social media account",
      icon: Plus,
      action: "/accounts"
    },
    {
      title: "View Analytics",
      description: "Check your performance metrics",
      icon: BarChart3,
      action: "/analytics"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your social media.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPeriod("24h")}>
                24h
              </Button>
              <Button 
                variant={selectedPeriod === "7d" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedPeriod("7d")}
              >
                7d
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedPeriod("30d")}>
                30d
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={kpi.trend === "up" ? "text-success" : "text-destructive"}>
                    {kpi.change}
                  </span>
                  <span>from last period</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>
                  Get started with these common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                      action.gradient 
                        ? "bg-gradient-brand text-white border-transparent hover:opacity-90" 
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md ${
                        action.gradient 
                          ? "bg-white/20" 
                          : "bg-primary/10"
                      }`}>
                        <action.icon className={`h-4 w-4 ${
                          action.gradient ? "text-white" : "text-primary"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${
                          action.gradient ? "text-white" : "text-foreground"
                        }`}>
                          {action.title}
                        </p>
                        <p className={`text-xs ${
                          action.gradient ? "text-white/80" : "text-muted-foreground"
                        }`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className={`p-2 rounded-full ${
                        activity.status === "success" 
                          ? "bg-success/10 text-success" 
                          : "bg-destructive/10 text-destructive"
                      }`}>
                        {activity.status === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Connected Accounts Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connected Accounts</CardTitle>
            <CardDescription>
              Monitor the health of your social media connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {connectedAccounts.map((account, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{account.name}</h3>
                    <Badge variant={
                      account.status === "connected" ? "default" :
                      account.status === "warning" ? "secondary" : "destructive"
                    }>
                      {account.status === "connected" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {account.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {account.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Posts this month</span>
                      <span className="font-medium">{account.posts}</span>
                    </div>
                    <Progress 
                      value={account.posts * 5} 
                      className="h-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;