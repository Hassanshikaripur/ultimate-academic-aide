
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">ScholarScribe</span>
          </div>
          <div className="flex space-x-4">
            <AuthDialog trigger={<Button variant="outline">Login</Button>} />
            <AuthDialog trigger={<Button>Sign Up</Button>} />
          </div>
        </nav>

        <div className="py-24 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 mb-10 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Your AI-Powered <span className="text-primary">Research Assistant</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              ScholarScribe helps researchers organize, connect, and unlock insights from academic literature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AuthDialog trigger={<Button size="lg" className="px-8">Get Started Free</Button>} />
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link to="/tour">Take a Tour</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-research-300/20 rounded-full filter blur-3xl"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                <img 
                  src="/placeholder.svg" 
                  alt="ScholarScribe Dashboard Preview" 
                  className="rounded-lg border shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Powerful Features for Researchers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ScholarScribe streamlines your research workflow with intelligent tools designed for academic success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Smart Document Management</h3>
              <p className="text-muted-foreground">
                Organize your research papers and notes in one place with AI-powered summaries and insights.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Knowledge Graph</h3>
              <p className="text-muted-foreground">
                Discover connections between papers and concepts with an interactive knowledge graph.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Citation Management</h3>
              <p className="text-muted-foreground">
                Automatically format and manage citations in various academic styles with ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Trusted by Researchers Worldwide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of academics using ScholarScribe to enhance their research workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-medium">Dr. Jane Smith</h4>
                  <p className="text-sm text-muted-foreground">Professor of Computer Science</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "ScholarScribe has transformed how I manage my research. The AI insights have helped me discover connections I would have otherwise missed."
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MJ</span>
                </div>
                <div>
                  <h4 className="font-medium">Mark Johnson</h4>
                  <p className="text-sm text-muted-foreground">PhD Candidate in Biology</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "The citation management feature alone is worth it. I've saved countless hours formatting references for my dissertation."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Transform Your Research Workflow?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join ScholarScribe today and experience the power of AI-assisted academic research.
          </p>
          <AuthDialog trigger={<Button size="lg" className="px-8">Get Started Free</Button>} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <span className="text-2xl font-bold">ScholarScribe</span>
              <p className="mt-2 text-slate-400 max-w-xs">
                AI-powered research assistant for academics and students.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Use Cases</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-6 text-center md:text-left text-slate-500">
            <p>&copy; {new Date().getFullYear()} ScholarScribe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
