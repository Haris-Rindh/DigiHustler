import React from "react";
import Header from "@/components/ui/curved-menu";

const DemoOne: React.FC = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Header />
      <div className="text-white h-screen text-7xl font-light text-center flex justify-center items-center select-none">
        hello<span className="italic font-serif text-[#bde0fe]">!</span>
      </div>
    </div>
  );
};

export { DemoOne };
export default DemoOne;
