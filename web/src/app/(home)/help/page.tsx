import React from "react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I get started?",
      answer: "Sign up to our platform and follow our onboarding process. Detailed guides are available in our documentation.",
    },
    {
      question: "Where can I find documentation?",
      answer: "Our comprehensive docs page provides detailed guides, tutorials, and API references.",
    },
    {
      question: "Who can I contact for support?",
      answer: "Our dedicated support team is available 24/7 at support@example.com or via our help desk.",
    },
  ];

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-6">Help & FAQ</h1>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold">{faq.question}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <p className="text-sm text-muted-foreground">
          Still have questions? Reach out to us at{" "}
          <a href="mailto:support@example.com" className="text-primary hover:underline">
            support@example.com
          </a>.
        </p>
      </div>
    </div>
  );
}
