"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!valid) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        setSubmitted(true);
    };

    return (
        <section className="bg-violet-600 dark:bg-violet-700">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
                <div className="flex flex-col items-center text-center gap-6 max-w-xl mx-auto">
                    <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                        <Mail size={22} className="text-white" aria-hidden="true" />
                    </div>

                    {submitted ? (
                        <div className="flex flex-col items-center gap-3">
                            <CheckCircle size={36} className="text-white" aria-hidden="true" />
                            <div>
                                <p className="text-xl font-bold text-white">You&apos;re in!</p>
                                <p className="text-white/80 text-sm mt-1">
                                    Thanks for subscribing. Expect great things in your inbox.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    Stay in the loop
                                </h2>
                                <p className="mt-2 text-white/80 text-sm sm:text-base">
                                    Get new arrivals, exclusive deals, and style tips delivered straight to your inbox.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="w-full flex flex-col sm:flex-row gap-3"
                            >
                                <div className="flex-1">
                                    <label htmlFor="newsletter-email" className="sr-only">
                                        Email address
                                    </label>
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                        placeholder="Enter your email"
                                        required
                                        aria-describedby={error ? "newsletter-error" : undefined}
                                        className="w-full rounded-full px-5 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 border-2 border-transparent focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                    {error && (
                                        <p
                                            id="newsletter-error"
                                            role="alert"
                                            className="mt-2 text-xs text-white/90 text-left px-2"
                                        >
                                            {error}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors shrink-0 whitespace-nowrap"
                                >
                                    Subscribe
                                    <ArrowRight size={15} aria-hidden="true" />
                                </button>
                            </form>

                            <p className="text-white/60 text-xs">
                                No spam, ever. Unsubscribe at any time.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
