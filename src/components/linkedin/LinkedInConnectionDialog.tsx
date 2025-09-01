import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Building2, User, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkedInConnectionDialogProps {
  isConnecting: boolean;
  onConnect: (platform: string) => void;
  children: React.ReactNode;
}

export const LinkedInConnectionDialog = ({ isConnecting, onConnect, children }: LinkedInConnectionDialogProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'profile' | 'company' | null>(null);

  const connectionTypes = [
    {
      id: 'profile',
      title: 'Personal Profile',
      description: 'Post as yourself to your LinkedIn profile',
      icon: User,
      features: [
        'Post to your personal feed',
        'Share updates and articles',
        'Build your personal brand',
        'Engage with your network'
      ],
      scopes: 'openid profile email w_member_social',
      recommended: false
    },
    {
      id: 'company',
      title: 'Company Page',
      description: 'Post to your LinkedIn company page',
      icon: Building2,
      features: [
        'Post to company pages',
        'Share company updates',
        'Build brand presence',
        'Reach company followers'
      ],
      scopes: 'openid profile email w_organization_social',
      recommended: true
    }
  ];

  const handleConnect = () => {
    if (!selectedType) {
      toast({
        title: "Selection required",
        description: "Please select whether to connect your profile or company page.",
        variant: "destructive",
      });
      return;
    }

    // Pass the selected type as part of the platform identifier
    onConnect(`linkedin-${selectedType}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="w-8 h-8 bg-[hsl(var(--linkedin))] rounded-lg flex items-center justify-center text-white mr-3">
              <Linkedin className="w-5 h-5" />
            </div>
            Connect LinkedIn Account
          </DialogTitle>
          <DialogDescription>
            Choose how you want to connect your LinkedIn account. You can connect both types if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {connectionTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedType(type.id as 'profile' | 'company')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                        {type.recommended && (
                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>Required scopes:</strong> {type.scopes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Important LinkedIn Requirements:
              </p>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                <li>• For company pages: You must be an Admin, Content Admin, or DSC Poster</li>
                <li>• Tokens expire in ~60 days and will require re-authorization</li>
                <li>• Make sure your LinkedIn app has the required products/scopes approved</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button 
            onClick={handleConnect}
            disabled={!selectedType || isConnecting}
            className="bg-[hsl(var(--linkedin))] hover:bg-[hsl(var(--linkedin))]/90 text-white"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Connecting...
              </>
            ) : (
              <>
                <Linkedin className="w-4 h-4 mr-2" />
                Connect LinkedIn
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};