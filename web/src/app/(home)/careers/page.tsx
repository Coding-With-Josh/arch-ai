import React from "react";

export default function CareersPage() {
  const jobs = [
    { title: "Frontend Developer", location: "Remote", description: "Work on state-of-the-art UI components and bring beautiful, responsive designs to life." },
    { title: "Backend Developer", location: "New York, NY", description: "Design and build robust APIs with scalability in mind using modern frameworks." },
    { title: "Product Manager", location: "San Francisco, CA", description: "Drive our product vision and coordinate cross-functional teams to deliver excellence." },
  ];

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-6">Careers at Arch</h1>
      <p className="mb-8 text-lg">
        Join our team and help build the future of technology. We value creativity, collaboration, and excellence. Explore exciting opportunities below!
      </p>
      <div className="space-y-6">
        {jobs.map((job, idx) => (
          <div 
            key={idx} 
            className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold">{job.title}</h2>
            <p className="text-sm text-muted-foreground">{job.location}</p>
            <p className="mt-2 text-lg">{job.description}</p>
            <div className="mt-4">
              <a
                href="/apply"
                className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Apply Now →
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <p className="text-muted-foreground text-sm">
          For more information or custom inquiries, please email{" "}
          <a href="mailto:hr@arch.com" className="text-primary hover:underline">
            hr@arch.com
          </a>.
        </p>
      </div>
    </div>
  );
}
