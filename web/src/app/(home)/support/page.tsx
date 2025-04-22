import React from "react";

export default function SupportPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-6">Support</h1>
      <p className="mb-4 text-lg">
        Need help? Our expert support team is here to assist you any time.
      </p>
      <p className="mb-4 text-lg">
        Contact us at <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a> or call <strong>(123) 456-7890</strong>.
      </p>
      <p className="mb-4 text-lg">
        Visit our community forum and knowledge base for FAQs and technical guides.
      </p>
      <div className="mt-8">
        <a 
          href="/help" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Visit Help Center
        </a>
      </div>
    </div>
  );
}
