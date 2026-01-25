"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { CardAccountSelection } from "@/components/account-selection/AccountSelectionItem";
import { OptionAccountSelection } from "@/config/accountTypeSelecction.config";
import { cn } from "@/lib/utils";

const OPTIONS: OptionAccountSelection[] = [
    {
        key: "professional",
        title: "Professional",
        description: "Build skills, complete challenges, and get discovered by companies.",
        route: "/onboarding/professional",
        bullets: [
            "Create your skill-based profile",
            "Complete real-world challenges",
            "Get AI-assisted feedback",
            "Connect with companies",
        ],

    },
    {
        key: "company",
        title: "Company",
        description: "Create challenges, analyze talent, and connect with skilled candidates.",
        route: "/onboarding/company",
        bullets: [
            "Post real-world challenges",
            "View detailed skill analytics",
            "Compare candidate performance",
            "Direct candidate contact",
        ],

    },
];

export const AccountSelection = () => {
    const router = useRouter();
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const handleSelect = (key: string) => {
        setSelectedKey(key);
    };

    const handleContinue = () => {
        if (!selectedKey) return;

        const chosen = OPTIONS.find((o) => o.key === selectedKey);

        if (chosen?.route) {
            router.push(chosen.route);
        } else {
            router.push(`/onboarding/selected?role=${selectedKey}`);
        }
    };
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <img src="/brand/kanux-logo.svg" alt="Kánux" className="mx-auto h-20" />
                <h2 className="text-2xl font-semibold mt-6 text-[#0B2A4A]">Choose your account type</h2>
                <p className="text-sm text-slate-500 mt-2">Select how you want to use Kánux</p>
            </div>
            {/* cards of account selection and detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {OPTIONS.map((opt) => (
                    <CardAccountSelection key={opt.key} opt={opt} selected={selectedKey === opt.key} onSelect={handleSelect} />
                ))}
            </div>
                {/* button continue */}
            <div className={cn("max-w-6xl mx-auto px-4 mt-6", selectedKey ? "block" : "hidden")}>
                <button
                    onClick={handleContinue}
                    disabled={!selectedKey}
                    className={
                        cn("w-full py-3 rounded-lg text-white font-medium transition-opacity duration-150",
                            selectedKey !== "professional"
                                ? "bg-[#0B79EA] hover:bg-[#0967c7]"
                                : "bg-[#1bcf0b] hover:bg-[#12a80d]"
                        )}
                >
                    Continue
                </button>
            </div>

        </div>
    );
};

export default AccountSelection;
