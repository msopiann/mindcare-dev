import React from "react";

export default function TailwindIndicator() {
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="pointer-events-none fixed bottom-5 left-5 z-50 rounded-full bg-gray-800 p-2 font-mono text-xs text-white shadow-lg">
          <div className="block sm:hidden">xs</div>
          <div className="hidden sm:block md:hidden">sm</div>
          <div className="hidden md:block lg:hidden">md</div>
          <div className="hidden lg:block xl:hidden">lg</div>
          <div className="hidden xl:block 2xl:hidden">xl</div>
          <div className="hidden 2xl:block">2xl</div>
        </div>
      )}
    </>
  );
}
