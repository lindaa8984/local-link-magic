import { HeroSection } from "@/components/HeroSection";
import { StorySection } from "@/components/StorySection";
import { ProjectGoalSection } from "@/components/ProjectGoalSection";
import { FundingProgressSection } from "@/components/FundingProgressSection";
import { TransparencySection } from "@/components/TransparencySection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StorySection />
        <ProjectGoalSection />
        <FundingProgressSection />
        <TransparencySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
