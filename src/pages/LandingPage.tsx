import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import Particles from "@/components/ui/Particles";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Particles Background */}
      <div
        className="fixed inset-0 z-0"
        style={{ width: "100%", height: "100vh", pointerEvents: "none" }}
      >
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={400}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 pt-4">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <img className="h-10 w-10" src="/logo.png" alt="logo" />
            <span className="text-4xl font-bold text-primary">Nexora</span>
          </div>
          <div className="flex space-x-4">
            <AuthDialog trigger={<Button variant="outline">Login</Button>} />
            <AuthDialog trigger={<Button>Sign Up</Button>} />
          </div>
        </nav>

        <div className="py-24 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 mb-10 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-white">
              Research smarter, <br />{" "}
              <span className="text-primary">Not Harder</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              <span className="text-secondary font-bold">Nexora</span> an
              AI-powered research assistant that helps college students find,
              analyze, and cite sources in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AuthDialog
                trigger={
                  <Button size="lg" className="px-8">
                    Get Started Free
                  </Button>
                }
              />
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/30 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-research-300/40 rounded-full filter blur-3xl"></div>
              <div className="relative bg-black/20 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-white/20">
                <img
                  src="https://images.pexels.com/photos/1326947/pexels-photo-1326947.jpeg"
                  alt="Nexora Dashboard Preview"
                  className="rounded-lg border border-white/30 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold mb-6 text-white bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent">
              Powerful Features for Researchers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nexora streamlines your research workflow with intelligent tools
              designed for academic excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Document Management",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                ),
                description:
                  "Organize your research papers and notes in one place with AI-powered summaries and insights.",
              },
              {
                title: "Knowledge Graph",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                ),
                description:
                  "Discover connections between papers and concepts with an interactive knowledge graph.",
              },
              {
                title: "Citation Management",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                ),
                description:
                  "Automatically format and manage citations in various academic styles with ease.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white relative z-10">
        <div className="border-t border-slate-800 mt-12 py-6 text-center text-slate-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-blue-600">Nexora</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
