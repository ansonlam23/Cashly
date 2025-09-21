import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { 
  TrendingUp, 
  PieChart, 
  Target, 
  Zap, 
  Upload, 
  Brain,
  DollarSign,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized financial advice with a sense of humor. Our AI roasts your spending habits while helping you improve.",
      color: "#00ff88"
    },
    {
      icon: Upload,
      title: "Smart PDF Processing",
      description: "Upload messy bank statements and watch our AI extract clean, categorized transaction data automatically.",
      color: "#0088ff"
    },
    {
      icon: PieChart,
      title: "Interactive Analytics",
      description: "Beautiful visualizations that make your spending patterns crystal clear. No more boring spreadsheets.",
      color: "#ff0080"
    },
    {
      icon: Target,
      title: "Goal Planning",
      description: "Set financial goals for houses, cars, or investments. We'll show you exactly how to get there.",
      color: "#ffaa00"
    },
    {
      icon: Zap,
      title: "Humorous Coaching",
      description: "Financial advice that doesn't put you to sleep. Get roasted for spending $600 on Uber (you need the exercise).",
      color: "#aa00ff"
    },
    {
      icon: Shield,
      title: "Student-Focused",
      description: "Built by students, for students. We understand your financial reality and Martian credit constraints.",
      color: "#00ffff"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "Finally, a budgeting app that doesn't make me want to cry. The AI insights are hilarious but actually helpful!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Business Major",
      content: "Uploaded my bank statement and immediately saw where all my money was going. The house buying analysis is incredible.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Engineering Student",
      content: "The investment planning feature helped me start my first portfolio. Love the risk tolerance assessment!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-[#333]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Cashly Logo" 
                className="w-8 h-8"
              />
              <span className="text-[#f5f5f5] font-bold text-xl">Cashly</span>
            </div>
            
            <div className="flex items-center gap-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Button 
                      onClick={() => navigate("/dashboard")}
                      className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a] font-semibold"
                    >
                      Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate("/auth")}
                        className="text-[#ccc] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => navigate("/auth")}
                        className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a] font-semibold"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 hover:bg-[#00ff88]/30">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Financial Analytics
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] bg-clip-text text-transparent">
              Cashly
            </h1>
            
            <p className="text-xl md:text-2xl text-[#ccc] mb-4 max-w-3xl mx-auto">
              Financial Analytics Platform for Students
            </p>
            
            <p className="text-lg text-[#888] mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your messy bank statements into actionable insights. Get AI-powered advice 
              that's actually fun to read, set realistic goals, and finally understand where your money goes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a] font-semibold text-lg px-8 py-6 h-auto shadow-lg shadow-[#00ff88]/25 hover:shadow-[#00ff88]/40 transition-all"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your First Statement
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-[#555] text-[#f5f5f5] hover:bg-[#1a1a1a] text-lg px-8 py-6 h-auto"
              >
                <PieChart className="mr-2 h-5 w-5" />
                See Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#111111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#f5f5f5]">
              Why Students Love Cashly
            </h2>
            <p className="text-xl text-[#888] max-w-3xl mx-auto">
              We built the financial tool we wished we had as students. No intimidating jargon, 
              just real insights that actually help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#111111] border-[#333] hover:border-[#555] transition-all duration-300 h-full group hover:shadow-lg hover:shadow-[#333]/50">
                  <CardHeader>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-[#f5f5f5] text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#ccc] leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#f5f5f5]">
              What Students Are Saying
            </h2>
            <p className="text-xl text-[#888] max-w-2xl mx-auto">
              Real feedback from real students who've transformed their financial habits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#111111] border-[#333] h-full">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#ffaa00] text-[#ffaa00]" />
                      ))}
                    </div>
                    <CardDescription className="text-[#ccc] text-base leading-relaxed">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold text-[#f5f5f5]">{testimonial.name}</p>
                      <p className="text-sm text-[#888]">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#111111] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#f5f5f5]">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl text-[#888] mb-12 max-w-2xl mx-auto">
              Join thousands of students who've already discovered where their money really goes. 
              Upload your first bank statement and get insights in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a] font-semibold text-lg px-8 py-6 h-auto shadow-lg shadow-[#00ff88]/25 hover:shadow-[#00ff88]/40 transition-all"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Financial Journey
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#888]">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#00ff88]" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#00ff88]" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#00ff88]" />
                Student-friendly
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#333]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img 
                src="/logo.svg" 
                alt="Cashly Logo" 
                className="w-8 h-8"
              />
              <span className="text-[#f5f5f5] font-bold text-xl">Cashly</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#888]">
              <span>Built by students, for students</span>
              <span>•</span>
              <a 
                href="https://cashly.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#00ff88] transition-colors"
              >
                Powered by Cashly
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}