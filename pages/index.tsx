import HeroSection from "../components/sections/HeroSection";
import StatsSection from "../components/sections/StatsSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import FeaturedIdeasSection from "../components/sections/FeaturedIdeasSection";
import BlogPreviewSection from "../components/sections/BlogPreviewSection";
import TestimonialSection from "../components/sections/TestimonialSection";
import FaqSection from "../components/sections/FaqSection";
import NewsletterSection from "../components/sections/NewsletterSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="grow">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Core Platform Statistics */}
        <StatsSection />

        {/* Section 3: Platform Features / How it works */}
        <HowItWorksSection />

        {/* Section 4: Impact Categories */}
        <CategoriesSection />

        {/* Section 5: Top Innovations */}
        <FeaturedIdeasSection />

        {/* Section 6: Environmental Impact Blogs/Highlights */}
        <BlogPreviewSection />

        {/* Section 7: Testimonials */}
        <TestimonialSection />

        {/* Section 8: FAQ */}
        <FaqSection />

        {/* Section 9: Newsletter / Community updates */}
        <NewsletterSection />
      </main>
    </div>
  );
}
