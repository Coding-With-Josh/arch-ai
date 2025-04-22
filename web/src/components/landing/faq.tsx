import React, { useState } from "react";
import { Plus, Minus, ChevronUp, ChevronUpCircle, ChevronDownCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
    {
        question: "What is Arch?",
        answer: (
            <>
                Arch is an all-in-one developer infrastructure designed to simplify, accelerate,
                and scale application development across both Web2 & Web3 ecosystems.
            </>
        ),
    },
    {
        question: "What are the core features of Arch?",
        answer: (
            <>
                <ul className="list-disc pl-5">
                    <li>AI-Powered Smart Contract Studio</li>
                    <li>Blockchain-Connected Database</li>
                    <li>One-Click dApp Deployment</li>
                    <li>API Gateway for Web2/Web3</li>
                    <li>No-Code dApp Builder</li>
                    <li>Inbuilt Version Control (On-Chain Git)</li>
                    <li>Multi-Ecosystem Support</li>
                    <li>Role-Based Access Control (RBAC)</li>
                    <li>Workspace + Organizations</li>
                    <li>Developer Analytics</li>
                </ul>
            </>
        ),
    },
    {
        question: "Who is Arch for?",
        answer: (
            <>
                <p>
                    Arch is built for Web3 developers, Web2 teams transitioning into Web3, startups,
                    DAOs, no-code builders, and enterprises seeking secure and scalable decentralized systems.
                </p>
            </>
        ),
    },
    {
        question: "How does Arch support Web2 & Web3 integration?",
        answer: (
            <>
                <p>
                    By providing a unified DevOps platform that spans traditional app development as well
                    as smart contract deployment and blockchain interactions, Arch bridges the gap
                    between Web2 and Web3. Its integrated services streamline the development workflow
                    across both environments.
                </p>
            </>
        ),
    },
    {
        question: "How does Arch simplify dApp deployment?",
        answer: (
            <>
                <p>
                    With its one-click dApp deployment, Arch handles infrastructure, smart contract
                    deployment, hosting, and backend services without requiring manual configuration,
                    enabling you to focus on building great applications.
                </p>
            </>
        ),
    },
];

const Faq: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="bg-transparent z-20 relative w-full">
            <div className="mx-auto max-w-full px-8 py-24 sm:py-32 lg:px-10 lg:py-32 relative">
                <div
                    className="absolute left-0 top-44 h-56 w-[90%] opacity-10 overflow-x-hidden bg-[#9560EB] bg-opacity-40 blur-[337.4px]"
                    style={{ transform: "rotate(-30deg)" }}
                ></div>
                <div className="mx-auto max-w-4xl divide-y divide-zinc-900">
                    <p className="mt-8 max-w-2xl mx-auto font-geist text-center text-5xl font-normal tracking-tight text-gray-800 dark:text-gray-200">
                        Frequently Asked Questions
                    </p>
                    <p className="mt-3 max-w-xl mx-auto pt-4 text-center tracking-tight text-black/60 dark:text-gray-400">
                        Have a question? We have answers! If you have any other questions, feel free to reach out to us.
                    </p>
                    <dl className="mt-10 space-y-6 divide-y divide-white/10">
                        {faqItems.map((item, index) => (
                            <div key={index} className="pt-6">
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full flex items-center justify-between text-left text-black dark:text-white focus:outline-none"
                                >
                                    <span
                                        style={{ wordSpacing: "0.17em" }}
                                        className="text-base leading-7 font-display text-gray-900 dark:text-gray-200 font-thin"
                                    >
                                        {item.question}
                                    </span>
                                    <span className="ml-6 flex h-7 items-center text-zinc-900 dark:text-zinc-200">
                                        {activeIndex === index ? (
                                            <ChevronUpCircle className="h-6 w-6" />
                                        ) : (
                                            <ChevronDownCircle className="h-6 w-6" />
                                        )}
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {activeIndex === index && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-2 ml-4 text-gray-700 dark:text-gray-300 font-sans overflow-hidden"
                                        >
                                            {item.answer}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Faq;