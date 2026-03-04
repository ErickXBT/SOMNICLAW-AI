import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function RiskDisclaimer() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative p-8 md:p-10 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0" />
              <h3 className="text-xl md:text-2xl text-yellow-300">Risk Disclaimer</h3>
            </div>

            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              <p>
                <strong className="text-yellow-300">Investment Risk:</strong> Cryptocurrency investments carry significant risk. $SOMNICLAW is a utility token and should not be considered as financial advice or an investment vehicle. The value of tokens can be highly volatile and may result in substantial loss.
              </p>

              <p>
                <strong className="text-yellow-300">Medical Disclaimer:</strong> SOMNICLAW AI assistant is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received from the SOMNICLAW AI assistant.
              </p>

              <p>
                <strong className="text-yellow-300">No Guarantees:</strong> While we strive to provide accurate and helpful information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, products, services, or related graphics contained in the application.
              </p>

              <p>
                <strong className="text-yellow-300">Regulatory Compliance:</strong> Cryptocurrency regulations vary by jurisdiction. It is your responsibility to ensure compliance with local laws and regulations before purchasing or using $SOMNICLAW tokens.
              </p>

              <p>
                <strong className="text-yellow-300">Do Your Own Research (DYOR):</strong> Always conduct thorough research and due diligence before making any cryptocurrency-related decisions. Only invest what you can afford to lose.
              </p>

              <p className="text-xs text-gray-400 pt-4 border-t border-yellow-500/20">
                By accessing this website or using SOMNICLAW services, you acknowledge that you have read, understood, and agreed to be bound by these disclaimers.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
