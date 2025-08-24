import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Book, 
  Mail, 
  Phone,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Send
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const HelpPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "medium"
  });

  const faqs = [
    {
      question: "How do I connect my social media accounts?",
      answer: "To connect your social media accounts, go to the Accounts page and click 'Connect New Account'. Choose your platform (Facebook, Instagram, LinkedIn, etc.) and follow the authorization process. Make sure you have admin access to the accounts you want to connect.",
      category: "Getting Started"
    },
    {
      question: "Why did my post fail to publish?",
      answer: "Posts can fail for several reasons: expired access tokens, account permissions changes, platform API issues, or content policy violations. Check your account status in the Accounts page and look for any warning indicators. You can also view detailed error messages in the Logs section.",
      category: "Troubleshooting"
    },
    {
      question: "How do I schedule posts for multiple time zones?",
      answer: "You can set your primary timezone in Settings > Preferences. When scheduling posts, the system will use this timezone by default. For global campaigns, you can create separate posts for different regions or use our bulk scheduling feature to target specific time zones.",
      category: "Scheduling"
    },
    {
      question: "Can I collaborate with my team members?",
      answer: "Yes! Social Sprout supports team collaboration. You can invite team members from Settings > Organization. Different roles are available: Admin (full access), Editor (create and schedule posts), and Viewer (read-only access to analytics and scheduled content).",
      category: "Collaboration"
    },
    {
      question: "How do I view my post analytics?",
      answer: "Analytics are available in the Analytics section of your dashboard. You can view performance metrics for individual posts, compare engagement across platforms, and generate custom reports. Premium plans include advanced analytics and historical data.",
      category: "Analytics"
    },
    {
      question: "What's the difference between scheduling and queuing posts?",
      answer: "Scheduling lets you set specific dates and times for posts to go live. Queuing adds posts to an automated posting schedule based on your optimal posting times. The queue system automatically spaces out your content for consistent engagement.",
      category: "Scheduling"
    },
    {
      question: "How do I upgrade or downgrade my plan?",
      answer: "You can change your plan anytime from Settings > Billing. Upgrades take effect immediately, while downgrades occur at the end of your current billing cycle. Your existing scheduled posts and connected accounts will remain intact during plan changes.",
      category: "Billing"
    },
    {
      question: "Is my data secure with Social Sprout?",
      answer: "Absolutely. We use enterprise-grade security including SOC 2 compliance, end-to-end encryption, and regular security audits. Your social media credentials are encrypted and stored securely. We never post without your explicit permission.",
      category: "Security"
    }
  ];

  const recentTickets = [
    {
      id: "TICK-001",
      subject: "Instagram connection issue",
      status: "resolved",
      created: "2 days ago",
      category: "Technical"
    },
    {
      id: "TICK-002", 
      subject: "Analytics not loading",
      status: "in-progress",
      created: "1 week ago",
      category: "Bug Report"
    }
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for new users",
      icon: Book,
      link: "#"
    },
    {
      title: "API Documentation", 
      description: "Technical documentation for developers",
      icon: Book,
      link: "#"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: Book,
      link: "#"
    },
    {
      title: "Best Practices",
      description: "Tips for social media success",
      icon: Book,
      link: "#"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message sent!",
      description: "We've received your message and will get back to you within 24 hours.",
    });

    setContactForm({
      subject: "",
      category: "",
      message: "",
      priority: "medium"
    });

    setIsSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      case "in-progress":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "open":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Open</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center">
            <HelpCircle className="w-8 h-8 mr-3 text-primary" />
            Help Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, FAQs, or guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-start space-x-3">
                          <Badge variant="outline" className="mt-1 text-xs">
                            {faq.category}
                          </Badge>
                          <span className="flex-1">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pt-2 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No results found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or browse our resources below
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Support
                </CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({...prev, subject: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Technical Issue, Billing, Feature Request"
                        value={contactForm.category}
                        onChange={(e) => setContactForm(prev => ({...prev, category: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue in detail..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-brand hover:opacity-90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Email Support</p>
                      <p className="text-xs text-muted-foreground">24-48 hour response</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Live Chat</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Phone Support</p>
                      <p className="text-xs text-muted-foreground">Enterprise plans only</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Helpful Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <resource.icon className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">{resource.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            {recentTickets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTickets.map((ticket) => (
                      <div key={ticket.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{ticket.id}</span>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{ticket.subject}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{ticket.category}</span>
                          <span>{ticket.created}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Facebook Integration</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Instagram Integration</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LinkedIn Integration</span>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Degraded
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Status Page
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;