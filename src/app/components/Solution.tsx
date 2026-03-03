import { motion } from 'motion/react';
import { MessageSquare, LineChart, Lightbulb, Heart, Moon, Calendar, BookOpen, Shield } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function Solution() {
  const { ref, inView } = useInView();

  const features = [
    {
      icon: MessageSquare,
      title: 'Free Insomnia Consultations',
      description: 'Get personalized AI-powered consultations anytime',
    },
    {
      icon: LineChart,
      title: 'Sleep Pattern Analysis',
      description: 'Advanced tracking and analysis of your sleep cycles',
    },
    {
      icon: Lightbulb,
      title: 'Personalized Sleep Guidance',
      description: 'Custom recommendations based on your lifestyle',
    },
    {
      icon: Heart,
      title: 'Stress & Anxiety Tools',
      description: 'Evidence-based techniques for mental wellness',
    },
    {
      icon: Moon,
      title: 'Night Mode Trader Assistant',
      description: 'Special support for late-night market sessions',
    },
    {
      icon: Calendar,
      title: 'Daily Recovery Recommendations',
      description: 'Optimize your daily routine for better sleep',
    },
    {
      icon: BookOpen,
      title: 'Sleep Hygiene Education',
      description: 'Learn best practices for healthy sleep habits',
    },
  ];

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">
              Meet SOMNICLAW
            </span>
            <span className="block text-3xl md:text-4xl text-red-400 mt-2">
              AI Assistant
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative p-6 rounded-xl border border-blue-500/20 bg-black/40 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl rounded-xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-red-600/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg mb-2 text-blue-300">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative p-6 rounded-xl border border-red-600/20 bg-red-600/5 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-red-500 shrink-0 mt-1" />
            <p className="text-sm text-gray-300 italic">
              This AI assistant does not replace professional medical care. Always consult with healthcare professionals for medical advice.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
