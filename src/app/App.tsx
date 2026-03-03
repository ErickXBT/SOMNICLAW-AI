import { ParticleBackground } from './components/ParticleBackground';
import { SEO } from './components/SEO';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { LoadingScreen } from './components/LoadingScreen';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { TokenOverview } from './components/TokenOverview';
import { TokenDistribution } from './components/TokenDistribution';
import { OurProduct } from './components/OurProduct';
import { Utility } from './components/Utility';
import { Roadmap } from './components/Roadmap';
import { Security } from './components/Security';
import { Vision } from './components/Vision';
import { RiskDisclaimer } from './components/RiskDisclaimer';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <LoadingScreen />
      <SEO />
      <ParticleBackground />
      <Navigation />
      <ScrollToTop />
      <div className="relative z-10 min-h-screen">
        <Hero />
        <OurProduct />
        <Overview />
        <Problem />
        <Solution />
        <TokenOverview />
        <TokenDistribution />
        <Utility />
        <Roadmap />
        <Security />
        <Vision />
        <RiskDisclaimer />
        <Footer />
      </div>
    </>
  );
}