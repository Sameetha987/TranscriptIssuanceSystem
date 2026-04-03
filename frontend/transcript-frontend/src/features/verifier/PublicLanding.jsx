import LandingHero from "../../components/verifier/LandingHero";
import Features from "../../components/verifier/Features";
import HowItWorks from "../../components/verifier/HowItWorks";
import CTASection from "../../components/verifier/CTASection";
import { useNavigate } from "react-router-dom";

const PublicLanding = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-12">

      <div className="max-w-6xl mx-auto space-y-16">

        <LandingHero navigate={navigate} />

        <Features />

        <HowItWorks />

        <CTASection navigate={navigate} />

      </div>

    </div>
  );
};

export default PublicLanding;