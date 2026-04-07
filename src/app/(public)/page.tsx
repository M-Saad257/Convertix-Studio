import React from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import WhyChooseUs from "@/components/WhyChooseUs";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0 select-none">
      <Hero />
      <Services />
      <Portfolio />
      <WhyChooseUs />
      <Pricing />
      <Testimonials />
      <BlogPreview />
      <ContactForm />
    </div>
  );
}
