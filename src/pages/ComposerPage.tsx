import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  PenTool, 
  Calendar, 
  Save, 
  Send, 
  Image, 
  Hash, 
  Target,
  Facebook,
  Instagram,
  Linkedin,
  Eye,
  Sparkles
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const ComposerPage = () => {
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook"]);
  const [postContent, setPostContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [topic, setTopic] = useState("");

  const tones = [
    { value: "professional", label: "Professional", description: "Formal and business-oriented" },
    { value: "casual", label: "Casual", description: "Friendly and conversational" },
    { value: "promotional", label: "Promotional", description: "Sales-focused and persuasive" }
  ];

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "facebook" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "instagram" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "linkedin" }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generatePreview = (platform: string) => {
    const platformConfig = platforms.find(p => p.id === platform);
    if (!platformConfig) return null;

    return (
      <div className="border rounded-lg p-4 bg-background">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${
            platform === 'facebook' ? 'bg-[hsl(var(--facebook))]' :
            platform === 'instagram' ? 'bg-[hsl(var(--instagram))]' :
            'bg-[hsl(var(--linkedin))]'
          }`}>
            <platformConfig.icon className="w-3 h-3" />
          </div>
          <span className="font-medium text-sm">{platformConfig.name} Preview</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">YC</span>
            </div>
            <div>
              <p className="font-medium text-sm">Your Company</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
          
          <div className="text-sm">
            {postContent || "Your post content will appear here..."}
          </div>
          
          {hashtags && (
            <div className="text-sm text-primary">
              {hashtags.split(' ').map((tag, index) => (
                <span key={index} className="mr-1">#{tag.replace('#', '')}</span>
              ))}
            </div>
          )}
          
          {callToAction && (
            <div className="pt-2 border-t">
              <Button size="sm" variant="outline" className="text-xs">
                {callToAction}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <PenTool className="w-8 h-8 mr-3 text-primary" />
              Composer
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and schedule engaging social media content
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-gradient-brand hover:opacity-90">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Creation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  AI-Powered Content Creation
                </CardTitle>
                <CardDescription>
                  Describe your topic and let AI help you create engaging content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic">What do you want to post about?</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., New product launch, company milestone, industry insights..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tone">Tone of Voice</Label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          <div>
                            <div className="font-medium">{tone.label}</div>
                            <div className="text-xs text-muted-foreground">{tone.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content with AI
                </Button>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Content</CardTitle>
                <CardDescription>
                  Write your post content or edit AI-generated content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content here..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="mt-1 min-h-[120px]"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        <Image className="w-4 h-4 mr-2" />
                        Add Media
                      </Button>
                      <Button variant="outline" size="sm">
                        <Hash className="w-4 h-4 mr-2" />
                        Suggest Hashtags
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {postContent.length}/280 characters
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <Input
                      id="hashtags"
                      placeholder="#marketing #socialmedia #growth"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta">Call to Action</Label>
                    <Input
                      id="cta"
                      placeholder="Learn More, Shop Now, Sign Up..."
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Platforms</CardTitle>
                <CardDescription>
                  Choose which social media platforms to post to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${
                          platform.id === 'facebook' ? 'bg-[hsl(var(--facebook))]' :
                          platform.id === 'instagram' ? 'bg-[hsl(var(--instagram))]' :
                          'bg-[hsl(var(--linkedin))]'
                        }`}>
                          <platform.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{platform.name}</p>
                          {selectedPlatforms.includes(platform.id) && (
                            <Badge variant="secondary" className="mt-1">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your post will appear on each platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {platforms.map((platform) => (
                      <TabsTrigger 
                        key={platform.id} 
                        value={platform.id}
                        disabled={!selectedPlatforms.includes(platform.id)}
                        className="text-xs"
                      >
                        <platform.icon className="w-3 h-3 mr-1" />
                        {platform.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {platforms.map((platform) => (
                    <TabsContent key={platform.id} value={platform.id} className="mt-4">
                      {generatePreview(platform.id)}
                    </TabsContent>
                  ))}
                </Tabs>

                <Separator className="my-6" />

                {/* Scheduling Options */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Scheduling Options
                  </h3>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Send className="w-4 h-4 mr-2" />
                      Post Now
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule for Later
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Add to Queue
                    </Button>
                  </div>
                </div>

                {/* Analytics Preview */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Predicted Performance</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Estimated Reach:</span>
                      <span className="font-medium">1.2K - 3.5K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Time to Post:</span>
                      <span className="font-medium">2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Score:</span>
                      <span className="font-medium text-success">High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComposerPage;