import { Check } from "lucide-react";
import Particles from "@/components/landing/particles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PricingSection from "@/components/landing/pricing";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description:
      "Perfect for hobby projects or testing out Arch's core features.",
    popular: false,
    features: [
      "1 Organization",
      "Up to 3 Projects",
      "Basic Analytics",
      "Community Support",
      "500MB Database Storage",
      "10K Monthly Requests",
      "No Custom Domain",
    ],
  },
  {
    name: "Gold",
    price: "$20/month",
    description:
      "Ideal for solo developers or small teams building real-world applications with enhanced features.",
    popular: true,
    features: [
      "Up to 5 Organizations",
      "Unlimited Projects",
      "Advanced Analytics",
      "Priority Email Support",
      "10GB Database Storage",
      "1M Monthly Requests",
      "Custom Domain Support",
      "GitHub Integration",
    ],
  },
  {
    name: "Platinum",
    price: "$60/month",
    description: "Best for agencies/teams and large-scale applications.",
    popular: false,
    features: [
      "Unlimited Organizations",
      "Unlimited Projects",
      "Team Collaboration Tools",
      "Role-Based Access Control",
      "100GB Database Storage",
      "10M+ Monthly Requests",
      "Custom Domains & SSL",
      "99.9% Uptime SLA",
      "Dedicated Support Manager",
    ],
  },
];

// Compute a unique list of all features across the pricing plans.
const allFeatures = Array.from(
  new Set(pricingPlans.flatMap((plan) => plan.features))
).sort();

export default function PricingComparisonPage() {
  return (
    <section className="relative py-14">
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />
      <PricingSection/>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Pricing Comparison
        </h1>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left">
                  Features
                </TableHead>
                {pricingPlans.map((plan, index) => (
                  <TableHead key={index} className="px-4 py-3 text-center">
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-sm text-gray-500">{plan.price}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFeatures.map((feature, idx) => (
                <TableRow key={idx} className="">
                  <TableCell className="px-4 py-3 border-b">
                    {feature}
                  </TableCell>
                  {pricingPlans.map((plan, index) => (
                    <TableCell
                      key={index}
                      className="px-4 py-3 border-b text-center"
                    >
                      {plan.features.includes(feature) ? (
                        <Check className="w-5 h-5 text-green-500 inline-block" />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700">
            Compare features and choose the plan that fits your needs.
          </p>
        </div>
      </div>
    </section>
  );
}
