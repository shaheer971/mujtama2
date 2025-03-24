
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/Container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';

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
  }
];

const testimonials = [
  {
    quote: "I've tried so many habit-tracking apps, but adding the financial stake made all the difference. I finally completed my goal!",
    author: "Sarah J.",
    role: "Completed 30-day fitness challenge"
  },
  {
    quote: "The community aspect is what keeps me going. Knowing others are working alongside me and holding me accountable changed everything.",
    author: "Michael T.",
    role: "Studying for MCAT exam"
  },
  {
    quote: "I put $50 on the line to write my novel in 30 days. Not only did I finish, but I earned extra from those who dropped out!",
    author: "Elena K.",
    role: "Aspiring novelist"
  }
];

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background z-0" />
          
          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Achieve Your Goals With 
                  <span className="text-gradient"> Community & Accountability</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                  Join groups with shared goals, stake money on your success, and earn rewards by completing what you start.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" onClick={() => setIsAuthModalOpen(true)}>
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/communities">
                      Browse Communities
                    </Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mx-auto lg:mx-0 lg:ml-auto"
              >
                <div className="w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-primary/5 to-primary/20 p-1">
                  <div className="w-full h-full rounded-xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-5xl font-bold mb-4">مجتمع</div>
                      <div className="text-3xl font-semibold mb-4">Mujtama</div>
                      <p className="text-muted-foreground">Community. Accountability. Achievement.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl z-0"></div>
              </motion.div>
            </div>
          </Container>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-secondary/30">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How Mujtama Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple process that combines community support with financial accountability to help you achieve your goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create or Join</h3>
                <p className="text-muted-foreground">
                  Create a new community with your goal or join an existing one that matches what you want to achieve.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Stake Your Claim</h3>
                <p className="text-muted-foreground">
                  Put down a financial stake that you'll only get back if you complete your goal by the deadline.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Achieve & Earn</h3>
                <p className="text-muted-foreground">
                  Complete your goal to get your stake back, plus earn from the stakes of those who didn't finish.
                </p>
              </motion.div>
            </div>
          </Container>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to set, track, and achieve your goals with community support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-6 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="mt-1 text-primary">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-secondary/30">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how others have used Mujtama to achieve their goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-xl flex flex-col"
                >
                  <div className="text-4xl text-primary mb-4">"</div>
                  <p className="text-foreground flex-grow mb-4">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card max-w-4xl mx-auto text-center p-8 md:p-12 rounded-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Achieve Your Goals?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join Mujtama today and experience the power of community-driven accountability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setIsAuthModalOpen(true)}>
                  Get Started Now
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/communities">
                    Explore Communities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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

export default Index;
