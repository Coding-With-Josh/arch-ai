import { Check } from "lucide-react";
import Link from "next/link";
import Particles from "./particles";

const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      popular: false,
      features: [
        "Curabitur faucibus",
        "massa ut pretium maximus",
        "Sed posuere nisi",
        "Pellentesque eu nibh et neque",
        "Suspendisse a leo",
        "Praesent quis venenatis ipsum",
        "Duis non diam vel tortor"
      ]
    },
    {
      name: "Gold",
      price: "$20",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      popular: true,
      features: [
        "Curabitur faucibus",
        "massa ut pretium maximus",
        "Sed posuere nisi",
        "Pellentesque eu nibh et neque",
        "Suspendisse a leo",
        "Praesent quis venenatis ipsum",
        "Duis non diam vel tortor"
      ]
    },
    {
      name: "Platinum",
      price: "$60",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      popular: false,
      features: [
        "Curabitur faucibus",
        "massa ut pretium maximus",
        "Sed posuere nisi",
        "Pellentesque eu nibh et neque",
        "Suspendisse a leo",
        "Praesent quis venenatis ipsum",
        "Duis non diam vel tortor"
      ],
      specialGradient: true
    }
  ];

  return (
    <section className="py-14 relative">
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      /> 
      <div className="absolute top-0 z-[0] h-screen w-screen bg-transparent"></div>
      
      <div className="relative max-w-screen-xl mx-auto px-4 text-gray-900 dark:text-gray-200 md:px-8 min-h-screen">
        <div className="relative max-w-xl mx-auto sm:text-center">
          <h3 className="text-gray-700 dark:text-gray-300 font-geist tracking-tighter text-3xl font-semibold sm:text-5xl">
            Pricing for all sizes
          </h3>
          <div className="mt-3 max-w-xl text-black/60 dark:text-white/40 font-geist font-normal">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur consequat nunc.</p>
          </div>
        </div>

        <div className="mt-16 justify-center gap-6 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ plan }: { plan: any }) => {
  return (
    <div className="relative flex-1 flex items-stretch flex-col rounded-xl border-2 mt-6 sm:mt-0 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]">
      {plan.popular && (
        <span className="w-32 absolute -top-5 left-0 right-0 mx-auto px-3 py-2 rounded-full border shadow-md bg-neutral-950/50 text-white/90 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(214,207,203,0.3),rgba(255,255,255,0))] animate-background-shine text-center text-gray-700 text-sm font-semibold">
          Most popular
        </span>
      )}
      
      <div className={`animate-background-shine p-8 space-y-4 border-b ${plan.specialGradient ? "dark:bg-[linear-gradient(110deg,transparent,45%,#d6cfcb,55%,transparent)] bg-[length:200%_100%] transition-colors rounded-t-2xl" : ""}`}>
        <span className="text-neutral-600 font-normal font-geist tracking-tight">{plan.name}</span>
        <div className="text-gray-400 dark:text-gray-200 text-3xl font-semibold">
          {plan.price} <span className="text-xl text-gray-900 dark:text-gray-200 font-normal">/mo</span>
        </div>
        <p>{plan.description}</p>
        <button className="w-full font-geist tracking-tighter text-center rounded-md text-md bg-gradient-to-br from-neutral-400 to-neutral-700 px-4 py-2 text-lg text-zinc-50 ring-2 ring-neutral-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-neutral-500/70 flex items-center justify-center gap-2">
          {plan.name === "Free" ? "Get Started" : "Buy Now"}
        </button>
      </div>

      <ul className="p-8 space-y-3">
        <li className="pb-2 text-gray-200 font-medium">
          <p>Features</p>
        </li>
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center gap-5">
            <Check className="h-5 w-5 text-neutral-600" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingSection;