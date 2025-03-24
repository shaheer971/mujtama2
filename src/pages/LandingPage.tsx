
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Shield, 
  Target, 
  Medal, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight,
  Star,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/Container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Community Support',
    description: 'Join groups of like-minded individuals all working towards the same goal.'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Financial Accountability',
    description: 'Put your money where your motivation is. Complete your goals to get it back.'
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Structured Goals',
    description: 'Set clear, measurable goals with deadlines that keep you on track.'
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: 'Track Progress',
    description: 'Monitor your progress and watch as you get closer to achievement.'
  },
  {
    icon: <Medal className="h-6 w-6" />,
    title: 'Rewards & Recognition',
    description: 'Earn badges, climb leaderboards, and get rewarded for your consistency.'
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Flexible Deadlines',
    description: 'Community-driven deadlines that can be adjusted through democratic voting.'
  }
];

const testimonials = [
  {
    quote: "I've tried so many habit-tracking apps, but adding the financial stake made all the difference. I finally completed my goal!",
    author: "Sarah J.",
    role: "Completed 30-day fitness challenge",
    avatar: "/placeholder.svg",
    rating: 5
  },
  {
    quote: "The community aspect is what keeps me going. Knowing others are working alongside me and holding me accountable changed everything.",
    author: "Michael T.",
    role: "Studying for MCAT exam",
    avatar: "/placeholder.svg",
    rating: 5
  },
  {
    quote: "I put $50 on the line to write my novel in 30 days. Not only did I finish, but I earned extra from those who dropped out!",
    author: "Elena K.",
    role: "Aspiring novelist",
    avatar: "/placeholder.svg",
    rating: 4
  }
];

const popularCommunities = [
  {
    name: "Daily Meditation Group",
    members: 128,
    stake: 25,
    category: "Wellness",
    dateRange: "30 days",
    color: "blue"
  },
  {
    name: "Novel Writing Month",
    members: 74,
    stake: 50,
    category: "Creativity",
    dateRange: "1 month",
    color: "purple"
  },
  {
    name: "10K Training Program",
    members: 156,
    stake: 35,
    category: "Fitness",
    dateRange: "8 weeks",
    color: "green"
  }
];

const howItWorks = [
  {
    number: 1,
    title: "Create or Join",
    description: "Create a new community with your goal or join an existing one that matches what you want to achieve."
  },
  {
    number: 2,
    title: "Stake Your Claim",
    description: "Put down a financial stake that you'll only get back if you complete your goal by the deadline."
  },
  {
    number: 3,
    title: "Track Progress",
    description: "Update your progress regularly and get support from community members."
  },
  {
    number: 4,
    title: "Achieve & Earn",
    description: "Complete your goal to get your stake back, plus earn from the stakes of those who didn't finish."
  }
];

const statistics = [
  { value: "87%", label: "Goal completion rate", icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
  { value: "15,000+", label: "Active members", icon: <Users className="h-5 w-5 text-blue-500" /> },
  { value: "500+", label: "Communities", icon: <Users className="h-5 w-5 text-purple-500" /> },
  { value: "$250,000+", label: "Staked for goals", icon: <Shield className="h-5 w-5 text-amber-500" /> }
];

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentTestimonial]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />
          
          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-center lg:text-left"
              >
                <Badge className="mb-6 text-sm py-1.5 px-4 rounded-full font-medium border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                  Achieve More Together
                </Badge>
                
                <h1 className="font-bold mb-6 tracking-tight">
                  <span className="block text-4xl md:text-5xl lg:text-6xl mb-2">Turn Your Goals Into</span>
                  <span className="block text-4xl md:text-5xl lg:text-6xl text-gradient">Reality</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                  Join groups with shared goals, stake money on your success, and earn rewards by completing what you start.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    onClick={() => setIsAuthModalOpen(true)} 
                    className="btn-premium group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="btn-outline-premium"
                  >
                    <Link to="#how-it-works">
                      How It Works
                    </Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto lg:mx-0 lg:ml-auto"
              >
                <div className="w-full max-w-md mx-auto aspect-square rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/30 p-px">
                  <div className="w-full h-full rounded-3xl bg-white/90 backdrop-blur-lg dark:bg-gray-900/80 border border-white/50 dark:border-gray-800/50 flex items-center justify-center relative overflow-hidden shadow-xl">
                    <div className="text-center p-8 relative z-10">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/10 mb-6">
                        <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">م</div>
                      </div>
                      <div className="text-3xl font-semibold mb-4">Mujtama</div>
                      <p className="text-muted-foreground">Community. Accountability. Achievement.</p>
                    </div>
                    
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl z-0"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl z-0"></div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="absolute -top-8 -right-4 md:right-4"
                >
                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700 w-52">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Goal Completed</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                  className="absolute -bottom-8 -left-4 md:left-0"
                >
                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700 w-56">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">$125 Earned</p>
                      <p className="text-xs text-muted-foreground">From completed goals</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </section>
        
        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center hover-lift"
                >
                  <div className="flex justify-center mb-3">
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Popular Communities */}
        <section className="py-24">
          <Container>
            <div className="text-center mb-16">
              <Badge className="mb-4 text-sm py-1.5 px-4 rounded-full font-medium border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                Popular Communities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thriving Communities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover communities with shared goals and accountability systems that help members succeed.
              </p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {popularCommunities.map((community, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="h-full"
                >
                  <Card className="overflow-hidden hover-scale border-0 shadow-lg h-full premium-card dark:premium-card-dark">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className={`h-2 bg-${community.color}-500`}></div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline" className={`px-2 py-1 border-${community.color}-200 bg-${community.color}-50 text-${community.color}-600 dark:bg-${community.color}-900/30 dark:text-${community.color}-400 dark:border-${community.color}-800`}>
                            {community.category}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {community.dateRange}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3">{community.name}</h3>
                        
                        <div className="flex justify-between text-sm text-muted-foreground mt-2 mb-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {community.members} members
                          </div>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-1" />
                            ${community.stake} stake
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <div className="flex -space-x-2 mb-4">
                            {[1, 2, 3].map((i) => (
                              <Avatar key={i} className="border-2 border-white dark:border-gray-800 w-8 h-8">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                                  {String.fromCharCode(64 + i)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                              +{community.members - 3}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Join Now
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary gap-1 p-0 h-auto">
                          View Details
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="text-center mt-16">
              <Button asChild className="btn-premium">
                <Link to="/dashboard/communities">
                  Explore All Communities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-950">
          <Container>
            <div className="text-center mb-16">
              <Badge className="mb-4 text-sm py-1.5 px-4 rounded-full font-medium border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Achieve Your Goals in 4 Simple Steps</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple process that combines community support with financial accountability to help you achieve your goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-400/50 to-transparent" />
                  )}
                  
                  <div className="premium-card p-6 h-full flex flex-col items-center text-center relative z-10 dark:premium-card-dark">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 font-bold text-2xl border border-blue-100 dark:border-blue-800">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Features Section */}
        <section className="py-24">
          <Container>
            <div className="text-center mb-16">
              <Badge className="mb-4 text-sm py-1.5 px-4 rounded-full font-medium border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tools and features designed to maximize your motivation and keep you accountable.
              </p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="premium-card p-8 rounded-xl group hover-lift dark:premium-card-dark"
                >
                  <div className="flex items-start gap-5">
                    <div className="mt-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl h-fit border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-950">
          <Container>
            <div className="text-center mb-16">
              <Badge className="mb-4 text-sm py-1.5 px-4 rounded-full font-medium border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Members Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how others have used Mujtama to achieve their goals.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="overflow-hidden relative h-[300px]">
                <AnimatePresence mode="wait">
                  {testimonials.map((testimonial, index) => (
                    index === currentTestimonial && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-full"
                      >
                        <div className="premium-card p-8 text-center dark:premium-card-dark">
                          <div className="flex justify-center mb-6">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-xl font-medium italic mb-8">"{testimonial.quote}"</p>
                          <div className="flex items-center justify-center">
                            <Avatar className="h-12 w-12 mr-4 border-2 border-blue-100 dark:border-blue-800">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                                {testimonial.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="font-semibold">{testimonial.author}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex justify-center mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                      index === currentTestimonial 
                        ? 'bg-blue-600 dark:bg-blue-400' 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section className="py-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-0"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                
                <div className="relative z-10 px-6 py-16 md:p-16 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Badge className="mb-6 text-sm py-1.5 px-4 rounded-full font-medium border-white/20 bg-white/10 text-white">
                      Start Today
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Achieve Your Goals?</h2>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                      Join Mujtama today and experience the power of community-driven accountability.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg" 
                        onClick={() => setIsAuthModalOpen(true)} 
                        className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8 shadow-lg"
                      >
                        Get Started Now
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        asChild 
                        className="border-white text-white hover:bg-white/10 rounded-full px-8"
                      >
                        <Link to="/dashboard/communities">
                          Explore Communities
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
      
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;
