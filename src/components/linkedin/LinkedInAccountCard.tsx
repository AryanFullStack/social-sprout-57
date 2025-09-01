import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Linkedin, 
  Building2, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Settings, 
  BarChart3, 
  X,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkedInAccount {
  id: string;
  account_name: string;
  account_id: string;
  platform: string;
  is_active: boolean;
  last_sync_at: string | null;
  last_error: string | null;
  created_at: string;
  expires_at: string | null;
  page_id?: string | null;
  metadata?: any;
}

interface LinkedInAccountCardProps {
  account: LinkedInAccount;
  isReconnecting: boolean;
  onReconnect: (accountId: string, platformName: string) => void;
  onDisconnect: (accountId: string, platformName: string) => void;
  onSync?: (accountId: string) => void;
}

export const LinkedInAccountCard = ({ 
  account, 
  isReconnecting, 
  onReconnect, 
  onDisconnect,
  onSync 
}: LinkedInAccountCardProps) => {
  const { toast } = useToast();

  const getAccountType = () => {
    return account.page_id ? 'company' : 'profile';
  };

  const getAccountTypeDisplay = () => {
    return account.page_id ? 'Company Page' : 'Personal Profile';
  };

  const getAccountIcon = () => {
    return account.page_id ? Building2 : User;
  };

  const getStatus = () => {
    if (!account.is_active) return 'disconnected';
    if (account.last_error) return 'warning';
    if (account.expires_at && new Date(account.expires_at) < new Date()) return 'warning';
    return 'connected';
  };

  const getStatusBadge = () => {
    const status = getStatus();
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

  const getDaysUntilExpiry = () => {
    if (!account.expires_at) return null;
    const daysLeft = Math.ceil((new Date(account.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const getExpiryWarning = () => {
    const daysLeft = getDaysUntilExpiry();
    if (daysLeft === null) return null;
    
    if (daysLeft <= 0) {
      return { message: "Token expired", severity: "error" };
    } else if (daysLeft <= 7) {
      return { message: `Expires in ${daysLeft} days`, severity: "warning" };
    } else if (daysLeft <= 30) {
      return { message: `Expires in ${daysLeft} days`, severity: "info" };
    }
    return null;
  };

  const handleSync = async () => {
    if (onSync) {
      onSync(account.id);
      toast({
        title: "Syncing account",
        description: "Refreshing account data from LinkedIn...",
      });
    }
  };

  const AccountIcon = getAccountIcon();
  const status = getStatus();
  const expiryWarning = getExpiryWarning();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[hsl(var(--linkedin))] rounded-lg flex items-center justify-center text-white">
              <Linkedin className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center">
                {account.account_name}
                <AccountIcon className="w-4 h-4 ml-2 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                {getAccountTypeDisplay()} • {account.account_id}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Error or Warning Messages */}
        {account.last_error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{account.last_error}</span>
            </div>
          </div>
        )}

        {expiryWarning && (
          <div className={`p-3 rounded-lg border ${
            expiryWarning.severity === 'error' 
              ? 'bg-destructive/10 border-destructive/20' 
              : expiryWarning.severity === 'warning'
              ? 'bg-warning/10 border-warning/20'
              : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-4 h-4 ${
                expiryWarning.severity === 'error' 
                  ? 'text-destructive' 
                  : expiryWarning.severity === 'warning'
                  ? 'text-warning'
                  : 'text-blue-600 dark:text-blue-400'
              }`} />
              <span className={`text-sm ${
                expiryWarning.severity === 'error' 
                  ? 'text-destructive' 
                  : expiryWarning.severity === 'warning'
                  ? 'text-warning'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {expiryWarning.message}
              </span>
            </div>
          </div>
        )}

        {/* Account Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold">-</p>
            <p className="text-xs text-muted-foreground">Connections</p>
          </div>
          <div>
            <p className="text-lg font-semibold">0</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-lg font-semibold">-</p>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Last sync:</span>
            <span>{account.last_sync_at ? new Date(account.last_sync_at).toLocaleDateString() : "Never"}</span>
          </div>
          <div className="flex justify-between">
            <span>Connected:</span>
            <span>{new Date(account.created_at).toLocaleDateString()}</span>
          </div>
          {account.expires_at && (
            <div className="flex justify-between">
              <span>Token expires:</span>
              <span>{new Date(account.expires_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            {status === "connected" && (
              <Button variant="outline" size="sm" onClick={handleSync}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Sync
              </Button>
            )}
            {(status === "warning" || status === "disconnected") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onReconnect(account.id, account.account_name)}
                disabled={isReconnecting}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isReconnecting ? 'animate-spin' : ''}`} />
                {isReconnecting ? 'Reconnecting...' : 'Reconnect'}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-3 h-3 mr-1" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Button>
            {status === "connected" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={() => onDisconnect(account.id, account.account_name)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};