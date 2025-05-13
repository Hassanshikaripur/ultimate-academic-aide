
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";

const Settings = () => {
  const { toast } = useToast();
  const { state } = useSidebar();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 transition-all duration-300 w-full">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <div className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="mb-6 flex flex-wrap">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
                <TabsTrigger value="citations">Citations</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Manage your application preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Default Project Name</Label>
                      <Input id="username" defaultValue="Research Project" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-save">Auto-save documents</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically save your documents every 5 minutes
                        </p>
                      </div>
                      <Switch id="auto-save" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable dark mode for the application interface
                        </p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="ai-settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Settings</CardTitle>
                    <CardDescription>
                      Configure how AI analyzes your research
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-suggestions">AI Suggestions</Label>
                        <p className="text-sm text-muted-foreground">
                          Show real-time suggestions while writing
                        </p>
                      </div>
                      <Switch id="ai-suggestions" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-summarization">Automatic Summarization</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically generate summaries for imported papers
                        </p>
                      </div>
                      <Switch id="ai-summarization" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="knowledge-graph">Knowledge Graph Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically update knowledge graph with new content
                        </p>
                      </div>
                      <Switch id="knowledge-graph" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="citations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Citation Settings</CardTitle>
                    <CardDescription>
                      Configure your citation preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-style">Default Citation Style</Label>
                      <select 
                        id="default-style"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>APA 7th Edition</option>
                        <option>MLA 9th Edition</option>
                        <option>Chicago 17th Edition</option>
                        <option>Harvard</option>
                        <option>IEEE</option>
                        <option>Vancouver</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-cite">Automatic Citation</Label>
                        <p className="text-sm text-muted-foreground">
                          Suggest citations while typing based on content
                        </p>
                      </div>
                      <Switch id="auto-cite" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ref-manager">Use Reference Manager</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable integration with reference management tools
                        </p>
                      </div>
                      <Switch id="ref-manager" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Name</Label>
                      <Input id="user-name" defaultValue="CS Student" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input id="user-email" defaultValue="student@university.edu" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="user-password">Password</Label>
                      <Input id="user-password" type="password" value="•••••••••" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
