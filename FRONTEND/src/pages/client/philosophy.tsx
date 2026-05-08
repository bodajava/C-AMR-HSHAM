import { motion } from 'framer-motion';
import { Quote, Zap, Target, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PhilosophyPage = () => {
  const pillars = [
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: "Clarity of Vision",
      description: "We believe in setting precise goals. Transformation begins when you know exactly what you're fighting for."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Explosive Discipline",
      description: "Motivation is the spark, but discipline is the fuel. We cultivate habits that transcend mere physical training."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Mental Resilience",
      description: "Your body follows where your mind leads. Our philosophy prioritizes cognitive strength as much as muscular endurance."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Elite Community",
      description: "You are the average of the people you surround yourself with. Join a brotherhood of high-performers."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              THE ELITE<br />PHILOSOPHY
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Transformation is not a destination; it's a state of being. We don't just build bodies; we forge legends.
          </motion.p>
        </div>

        {/* Quote Section */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative p-12 rounded-3xl bg-accent/5 border border-border/40 text-center"
        >
          <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/20" />
          <p className="text-2xl italic font-medium leading-relaxed">
            "The difference between the impossible and the possible lies in a person's determination. 
            We provide the blueprint; you provide the fire."
          </p>
          <p className="mt-6 font-bold text-primary">— COACH HSHAM</p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
            >
              <div className="mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
              <p className="text-muted-foreground">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 pt-10"
        >
          <h2 className="text-3xl font-bold">READY TO COMMENCE YOUR JOURNEY?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
              <Link to="/workouts">START TRAINING</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold">
              <Link to="/workouts">VIEW WORKOUTS</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhilosophyPage;
