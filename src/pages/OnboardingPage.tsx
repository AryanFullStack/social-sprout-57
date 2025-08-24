import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [searchTimezone, setSearchTimezone] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ur", name: "اردو (Urdu)", flag: "🇵🇰" },
  ];

  const timezones = [
    "UTC-12:00 - Baker Island",
    "UTC-11:00 - American Samoa",
    "UTC-10:00 - Hawaii",
    "UTC-09:00 - Alaska",
    "UTC-08:00 - Pacific Time",
    "UTC-07:00 - Mountain Time",
    "UTC-06:00 - Central Time",
    "UTC-05:00 - Eastern Time",
    "UTC-04:00 - Atlantic Time",
    "UTC-03:00 - Brazil",
    "UTC-02:00 - Mid-Atlantic",
    "UTC-01:00 - Azores",
    "UTC+00:00 - London, Dublin",
    "UTC+01:00 - Paris, Berlin",
    "UTC+02:00 - Cairo, Athens",
    "UTC+03:00 - Moscow, Istanbul",
    "UTC+04:00 - Dubai, Baku",
    "UTC+05:00 - Karachi, Tashkent",
    "UTC+05:30 - Mumbai, Delhi",
    "UTC+06:00 - Dhaka, Almaty",
    "UTC+07:00 - Bangkok, Jakarta",
    "UTC+08:00 - Beijing, Singapore",
    "UTC+09:00 - Tokyo, Seoul",
    "UTC+10:00 - Sydney, Melbourne",
    "UTC+11:00 - Solomon Islands",
    "UTC+12:00 - New Zealand",
  ];

  const filteredTimezones = timezones.filter(tz =>
    tz.toLowerCase().includes(searchTimezone.toLowerCase())
  );

  const socialPlatforms = [
    {
      name: "Facebook Pages",
      icon: Facebook,
      color: "facebook",
      description: "Connect your Facebook business pages",
      connected: connectedAccounts.includes("facebook")
    },
    {
      name: "Instagram Business",
      icon: Instagram,
      color: "instagram",
      description: "Connect your Instagram business account",
      connected: connectedAccounts.includes("instagram")
    },
    {
      name: "LinkedIn Company",
      icon: Linkedin,
      color: "linkedin",
      description: "Connect your LinkedIn company page",
      connected: connectedAccounts.includes("linkedin")
    }
  ];

  const handleConnectAccount = (platform: string) => {
    if (connectedAccounts.includes(platform)) {
      setConnectedAccounts(prev => prev.filter(p => p !== platform));
      toast({
        title: "Account disconnected",
        description: `${platform} account has been disconnected.`,
      });
    } else {
      setConnectedAccounts(prev => [...prev, platform]);
      toast({
        title: "Account connected",
        description: `${platform} account connected successfully!`,
      });
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      toast({
        title: "Onboarding complete!",
        description: "Welcome to Social Sprout. Let's start creating amazing content!",
      });
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedLanguage !== "";
      case 2:
        return selectedTimezone !== "";
      case 3:
        return true; // Social connections are optional
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Choose Your Language</h2>
              <p className="text-muted-foreground">
                Select your preferred language for the interface
              </p>
            </div>

            <div className="grid gap-4">
              {languages.map((language) => (
                <Card
                  key={language.code}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLanguage === language.code
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedLanguage(language.code)}
                >
                  <CardContent className="flex items-center space-x-4 p-4">
                    <span className="text-2xl">{language.flag}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{language.name}</h3>
                    </div>
                    {selectedLanguage === language.code && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Select Your Timezone</h2>
              <p className="text-muted-foreground">
                This helps us schedule your posts at the optimal times
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="timezone-search">Search Timezone</Label>
                <Input
                  id="timezone-search"
                  placeholder="Search for your city or timezone..."
                  value={searchTimezone}
                  onChange={(e) => setSearchTimezone(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="timezone-select">Available Timezones</Label>
                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredTimezones.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTimezone && (
                <div className="p-4 bg-success-muted rounded-lg border border-success/20">
                  <div className="flex items-center space-x-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Selected: {selectedTimezone}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-brand rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Connect Your Social Accounts</h2>
              <p className="text-muted-foreground">
                Connect your social media accounts to start scheduling posts
              </p>
            </div>

            <div className="space-y-4">
              {socialPlatforms.map((platform) => (
                <Card
                  key={platform.name}
                  className={`transition-all hover:shadow-md ${
                    platform.connected ? "border-success bg-success-muted/30" : ""
                  }`}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                        platform.color === 'facebook' ? 'bg-[hsl(var(--facebook))]' :
                        platform.color === 'instagram' ? 'bg-[hsl(var(--instagram))]' :
                        'bg-[hsl(var(--linkedin))]'
                      }`}>
                        <platform.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {platform.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {platform.connected && (
                        <Badge variant="secondary" className="bg-success-muted text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                      <Button
                        variant={platform.connected ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleConnectAccount(platform.name.toLowerCase().split(' ')[0])}
                      >
                        {platform.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Optional Step</p>
                    <p>
                      You can skip this step and connect your social accounts later from the Accounts page. 
                      You'll need at least one connected account to start scheduling posts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">
              Social Sprout
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Social Sprout!</h1>
          <p className="text-muted-foreground">
            Let's get your account set up in just a few simple steps
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-brand hover:opacity-90"
          >
            {currentStep === totalSteps ? "Complete Setup" : "Continue"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;