
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Mail, Users, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Share = () => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://researchmind.app/share/abc123");
    toast({
      title: "Link copied",
      description: "The share link has been copied to your clipboard.",
    });
  };

  const handleInvite = () => {
    toast({
      title: "Invitation sent",
      description: "Your invitation has been sent successfully.",
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <AppHeader />
        <main className="container mx-auto py-6 px-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Research</CardTitle>
                <CardDescription>
                  Collaborate with others on your research project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Share Link</Label>
                  <div className="flex gap-2">
                    <Input readOnly value="https://researchmind.app/share/abc123" />
                    <Button variant="outline" size="icon" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Anyone with this link can view your research</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Invite by Email</Label>
                  <div className="flex gap-2">
                    <Input placeholder="colleague@university.edu" />
                    <Button variant="outline" onClick={handleInvite}>
                      <Mail className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium">Sharing Permissions</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-view">Allow Viewing</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to view your research documents
                      </p>
                    </div>
                    <Switch id="allow-view" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-edit">Allow Editing</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to edit your research documents
                      </p>
                    </div>
                    <Switch id="allow-edit" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-citation">Allow Citation Export</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to export citations from your research
                      </p>
                    </div>
                    <Switch id="allow-citation" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  No active collaborators
                </div>
                <Button>
                  <Link className="mr-2 h-4 w-4" />
                  Update Sharing Settings
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Export and Publish</CardTitle>
                <CardDescription>
                  Export your research or publish it to external platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-6 flex flex-col">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">Export as PDF</span>
                    <span className="text-xs text-muted-foreground mt-1">Standard document format</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-6 flex flex-col">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="font-medium">Export as DOCX</span>
                    <span className="text-xs text-muted-foreground mt-1">Microsoft Word format</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-6 flex flex-col">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <span className="font-medium">Export Citations</span>
                    <span className="text-xs text-muted-foreground mt-1">BibTeX, RIS formats</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Share;
