import React from "react";
import logo from "@/assets/images/brand/arch_logo.jpg";
import Image from "next/image";

export default function CompanyPage() {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">About Our Company</h2>
      <p className="mb-4 text-sm">
        At Arch, our mission is to innovate and empower the world through modern, robust solutions. We strive to drive digital transformation by integrating cutting-edge technologies with user-centric designs.
      </p>
      <p className="mb-4 text-sm">
        Our dedicated team of professionals works tirelessly to deliver high-quality services that enable businesses and developers to thrive in a connected world.
      </p>
      <p className="mb-4 text-sm">
        With a focus on sustainability, innovation, and excellence, Arch continues to evolve and push the boundaries of what’s possible.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Meet the Founders</h2>
        <div className="flex flex-col md:flex-row md:items-center justify-center">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <Image
              src={logo}
              alt="Founders Portrait"
              width={100}
              height={100}
              className="rounded-full border-2 size-60 border-gray-300 mx-auto"
            />
          </div>
          <div className="md:w-2/3 md:pl-6">
            <p className="text-sm">
              <span className="font-bold text-lg"> Joshua Idele - Founder & CEO</span>
              <br />
              He is a Blockchain Developer obsessed with building tools to streamline developer workflows.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
