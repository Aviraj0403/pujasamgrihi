import React from "react";
import BannerSlider from "./BannerSlider";
import CategorySlider from "./CategorySlider";
import BestsellerSection from "./BestsellerSection";
import PromoBanner from "./PromoBanner";
import HomeNewArrivals from "../HomeNewArrivals";
import MobileCategorySection from "../category/MobileCategorySection";
import ComboSection from "./ComboSection";
import BeautyHighlightSection from "./BeautyHighlightSection";
import FloatingNewArrival from "./FloatingNewArrival";
import WhyChooseUs from "./WhyChooseUs";

function Home() {
  return (
    <div className="bg-brand-bg min-h-screen">
      <FloatingNewArrival />
      <MobileCategorySection />
      <BannerSlider />
      <CategorySlider />
      <ComboSection />
      <BestsellerSection />
      <HomeNewArrivals />
      <PromoBanner />
      <WhyChooseUs />
      <BeautyHighlightSection />
    </div>
  );
}

export default Home;
