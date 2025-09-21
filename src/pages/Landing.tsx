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
  CheckCircle
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#00ff88] rounded-full opacity-30"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                scale: [0.5, 1.5, 0.5],
                opacity: [0.1, 0.8, 0.1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Glowing Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0088ff]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#ff0080]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 hover:bg-[#00ff88]/30 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                </motion.div>
                AI-Powered Financial Analytics
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                Cashly
              </motion.span>
              <motion.div
                className="absolute -top-2 -right-2 text-3xl"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.div>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-[#ccc] mb-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="bg-gradient-to-r from-[#00ff88] to-[#0088ff] bg-clip-text text-transparent font-semibold">
                Plaid-Powered Finance Sidekick
              </span>
            </motion.p>
            
            <motion.p 
              className="text-lg text-[#888] mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Connect your bank account, turn messy statements into actionable insights, get AI-powered advice 
              that's actually fun, and track your spending like a pro.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] hover:from-[#00cc6a] hover:to-[#00ff88] text-[#0a0a0a] font-bold text-lg px-8 py-6 h-auto shadow-2xl shadow-[#00ff88]/30 hover:shadow-[#00ff88]/50 transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="mr-2 h-5 w-5" />
                    </motion.div>
                    Upload Your First Statement
                  </span>
                </Button>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-lg blur-lg opacity-0 group-hover:opacity-50 -z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#0088ff] text-[#0088ff] hover:bg-[#0088ff] hover:text-[#0a0a0a] font-bold text-lg px-8 py-6 h-auto transition-all duration-300 relative group overflow-hidden backdrop-blur-sm"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#0088ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                  <span className="relative z-10 flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <PieChart className="mr-2 h-5 w-5" />
                    </motion.div>
                    See Demo
                  </span>
                </Button>
                <motion.div
                  className="absolute inset-0 border-2 border-[#0088ff] rounded-lg blur-sm opacity-0 group-hover:opacity-50 -z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#111111] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0088ff]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-[#f5f5f5]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] bg-clip-text text-transparent">
                Why Students Love Cashly
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-[#888] max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              We built the financial tool we wished we had as students. No intimidating jargon, 
              just real insights that actually help.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", bounce: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative"
              >
                <Card className="bg-[#111111]/80 backdrop-blur-sm border-[#333] hover:border-[#555] transition-all duration-300 h-full group hover:shadow-2xl hover:shadow-[#00ff88]/10 relative overflow-hidden">
                  {/* Glowing border effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00ff88]/20 via-[#0088ff]/20 to-[#ff0080]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  />
                  
                  <CardHeader className="relative z-10">
                    <motion.div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative"
                      style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <feature.icon className="h-6 w-6" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover:opacity-50"
                        style={{ backgroundColor: feature.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <CardTitle className="text-[#f5f5f5] text-xl group-hover:text-[#00ff88] transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-[#ccc] leading-relaxed group-hover:text-[#f5f5f5] transition-colors duration-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Floating particles for each card */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100"
                        style={{ 
                          backgroundColor: feature.color,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          x: [0, Math.random() * 100 - 50],
                          y: [0, Math.random() * 100 - 50],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-[#111111] to-[#1a1a1a] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#0088ff]/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#00ff88] rounded-full opacity-20"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                scale: [0.5, 1.5, 0.5],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-[#f5f5f5]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] bg-clip-text text-transparent">
                Ready to Take Control of Your Finances?
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-[#888] mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of students who've already discovered where their money really goes. 
              Upload your first bank statement and get insights in minutes.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] hover:from-[#00cc6a] hover:to-[#00ff88] text-[#0a0a0a] font-bold text-lg px-8 py-6 h-auto shadow-2xl shadow-[#00ff88]/30 hover:shadow-[#00ff88]/50 transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                    </motion.div>
                    Start Your Financial Journey
                  </span>
                </Button>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-lg blur-lg opacity-0 group-hover:opacity-50 -z-10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center gap-6 mt-8 text-sm text-[#888]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { text: "Free to start", icon: CheckCircle },
                { text: "No credit card required", icon: CheckCircle },
                { text: "Student-friendly", icon: CheckCircle }
              ].map((item, index) => (
                <motion.div 
                  key={item.text}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <item.icon className="h-4 w-4 text-[#00ff88]" />
                  </motion.div>
                  <span className="group-hover:text-[#00ff88] transition-colors duration-300">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
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