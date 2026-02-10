"use client"
import { useState } from 'react';

export default function DecisionWorks() {
    const [currentPage, setCurrentPage] = useState('home');

    const Header = () => (
        <header className="border-b border-gray-300">
            <div className="max-w-3xl mx-auto px-6 py-8 flex justify-between items-center">
                <h1 className="text-2xl font-normal tracking-tight">DecisionWorks</h1>
                <nav className="flex gap-8">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className={`text-base ${currentPage === 'home' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setCurrentPage('process')}
                        className={`text-base ${currentPage === 'process' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Process
                    </button>
                </nav>
            </div>
        </header>
    );

    const Footer = () => (
        <footer className="border-t border-gray-300 mt-20">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <p className="text-sm text-gray-600">
                    DecisionWorks operates as a sole proprietorship. No liability is assumed for decisions made following evaluation. All assessments are advisory only.
                </p>
            </div>
        </footer>
    );

    const HomePage = () => (
        <main className="max-w-3xl mx-auto px-6 py-16">

            {/* Primary Statement */}
            <section className="mb-20">
                <h2 className="text-3xl font-normal mb-8 leading-tight">
                    A structured framework for evaluating early-stage ideas before committing resources.
                </h2>
                <p className="text-lg leading-relaxed mb-6">
                    DecisionWorks produces a finite outcome: Go, No-Go, or Modify. It is not consulting, coaching, or encouragement.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                    If you are seeking validation, this is not for you. If you need a disciplined evaluation of feasibility, risk, cost, and endgame clarity, continue reading.
                </p>
            </section>

            {/* Who This Is For */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">Who this is for</h3>
                <ul className="space-y-4 text-base leading-relaxed">
                    <li>Solo professionals considering building something new</li>
                    <li>Competent practitioners who understand their domain</li>
                    <li>People whose primary risk is reputational, not technical</li>
                    <li>Those who want answers, not reassurance</li>
                </ul>
            </section>

            {/* Who This Is Not For */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">Who this is not for</h3>
                <ul className="space-y-4 text-base leading-relaxed">
                    <li>People seeking external motivation to start</li>
                    <li>Teams requiring alignment or buy-in processes</li>
                    <li>Anyone needing help developing the idea itself</li>
                    <li>Those looking for market research or competitive analysis</li>
                    <li>Individuals who have already committed significant resources</li>
                </ul>
            </section>

            {/* What You Receive */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">What you receive</h3>
                <ul className="space-y-4 text-base leading-relaxed">
                    <li>A finite decision: Go, No-Go, or Modify</li>
                    <li>Written assessment of feasibility, risk, cost, and endgame clarity</li>
                    <li>Identified failure points and resource traps</li>
                    <li>No ongoing relationship or support commitment</li>
                </ul>
            </section>

            {/* Cost & Terms */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">Cost & terms</h3>
                <p className="text-base leading-relaxed mb-4">
                    Fixed fee: $2,500 USD per evaluation.
                </p>
                <p className="text-base leading-relaxed mb-4">
                    Payment in full before evaluation begins. No refunds. No revisions. No follow-up consultations included.
                </p>
                <p className="text-base leading-relaxed text-gray-700">
                    If the outcome is unfavorable, you have saved more than you spent.
                </p>
            </section>

            {/* Examples */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">Past evaluations</h3>
                <div className="space-y-8">
                    <div>
                        <p className="font-medium mb-2">SaaS platform for medical practices</p>
                        <p className="text-base leading-relaxed text-gray-700 mb-1">Outcome: No-Go</p>
                        <p className="text-sm leading-relaxed text-gray-600">Regulatory overhead exceeded available resources. Compliance burden would require team expansion before revenue viability.</p>
                    </div>
                    <div>
                        <p className="font-medium mb-2">Specialized training program for technical writers</p>
                        <p className="text-base leading-relaxed text-gray-700 mb-1">Outcome: Modify</p>
                        <p className="text-sm leading-relaxed text-gray-600">Market positioning too broad. Recommended narrowing to API documentation specialists. Revenue model shifted from courses to certification.</p>
                    </div>
                    <div>
                        <p className="font-medium mb-2">Niche consulting practice targeting Series A startups</p>
                        <p className="text-base leading-relaxed text-gray-700 mb-1">Outcome: Go</p>
                        <p className="text-sm leading-relaxed text-gray-600">Clear market need, low capital requirement, credible positioning. Risk profile acceptable for solo practitioner with existing network.</p>
                    </div>
                </div>
            </section>

            {/* Engagement */}
            <section className="mb-20">
                <h3 className="text-xl font-normal mb-6">Begin evaluation</h3>
                <p className="text-base leading-relaxed mb-8">
                    If you have read this page and believe DecisionWorks is appropriate for your situation, submit your request below.
                </p>
                <p className="text-base leading-relaxed mb-8 text-gray-700">
                    If you are uncertain whether this is right for you, it is not.
                </p>
                <a
                    href="mailto:intake@decisionstandards.com?subject=DecisionWorks Evaluation Request"
                    className="inline-block px-8 py-3 border border-gray-900 text-base hover:bg-gray-900 hover:text-white transition-colors"
                >
                    Request evaluation
                </a>
            </section>

        </main>
    );

    const ProcessPage = () => (
        <main className="max-w-3xl mx-auto px-6 py-16">

            {/* Page Header */}
            <section className="mb-20">
                <h2 className="text-3xl font-normal mb-8 leading-tight">
                    The evaluation process
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    DecisionWorks follows a fixed sequence. No steps are optional. No customization is offered.
                </p>
            </section>

            {/* Step 1: Intake */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">Step 1: Intake</h3>

                <p className="text-base leading-relaxed mb-6">
                    You submit a structured intake form covering:
                </p>

                <ul className="space-y-3 text-base leading-relaxed mb-8 pl-6">
                    <li>Idea description (what you intend to build)</li>
                    <li>Target market or user (who will use or pay for this)</li>
                    <li>Your current resources (time, capital, expertise)</li>
                    <li>Intended timeline (when you plan to launch or validate)</li>
                    <li>Definition of success (what outcome justifies the effort)</li>
                    <li>Primary concern (what you are most uncertain about)</li>
                </ul>

                <p className="text-base leading-relaxed mb-4">
                    No pitch deck. No business plan. No financial projections unless you already have them.
                </p>

                <p className="text-base leading-relaxed text-gray-700">
                    If you cannot answer these questions clearly, you are not ready for evaluation.
                </p>
            </section>

            {/* Step 2: Evaluation */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">Step 2: Evaluation</h3>

                <p className="text-base leading-relaxed mb-8">
                    Your submission is assessed across four vectors:
                </p>

                <div className="space-y-8">
                    <div>
                        <h4 className="font-medium mb-3">Feasibility</h4>
                        <p className="text-base leading-relaxed text-gray-700">
                            Can this be built with available resources? Technical complexity, operational requirements, dependencies on external factors. This is not about whether it's possible in theory, but whether you can execute it.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Risk exposure</h4>
                        <p className="text-base leading-relaxed text-gray-700">
                            What can go wrong and how badly? Regulatory constraints, reputational damage, financial loss, opportunity cost. We identify failure modes you may not have considered.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Resource requirement</h4>
                        <p className="text-base leading-relaxed text-gray-700">
                            What will this actually cost in time, money, and attention? Hidden costs, ongoing obligations, maintenance burden. Many ideas are viable but not worth the sustained effort required.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Endgame clarity</h4>
                        <p className="text-base leading-relaxed text-gray-700">
                            Do you know what success looks like and when to stop? Defined exit criteria, measurable outcomes, decision points. Ideas without endpoints become permanent commitments.
                        </p>
                    </div>
                </div>

                <p className="text-base leading-relaxed mt-8 text-gray-700">
                    Duration: 5-7 business days from receipt of payment and completed intake.
                </p>
            </section>

            {/* Step 3: Decision Delivery */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">Step 3: Decision delivery</h3>

                <p className="text-base leading-relaxed mb-8">
                    You receive a written report with one of three recommendations:
                </p>

                <div className="space-y-8">
                    <div>
                        <h4 className="font-medium mb-3">Go</h4>
                        <p className="text-base leading-relaxed text-gray-700">
                            Proceed with the idea as submitted. Risks are acceptable. Resources are sufficient. Endgame is defined. You understand what you are committing to.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">No-Go</h4>
                        <p className="text-base leading-relaxed text-gray-700">
                            Do not proceed. Critical flaws exist that cannot be mitigated within your constraints. Pursuing this idea will likely result in wasted resources or reputational damage.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Modify</h4>
                        <p className="text-base leading-relaxed text-gray-700">
                            Proceed only with specific changes. The core idea has merit but the current approach is flawed. Modifications are detailed and actionable, not suggestive.
                        </p>
                    </div>
                </div>

                <p className="text-base leading-relaxed mt-8 mb-4">
                    The report includes reasoning for the decision, identified failure points, and resource estimates.
                </p>

                <p className="text-base leading-relaxed text-gray-700">
                    No follow-up calls. No revisions. No ongoing support. The evaluation is complete.
                </p>
            </section>

            {/* What Happens After */}
            <section className="mb-20 pb-20 border-b border-gray-200">
                <h3 className="text-xl font-normal mb-6">What happens after</h3>

                <p className="text-base leading-relaxed mb-4">
                    You decide whether to act on the recommendation. DecisionWorks does not implement, advise, or follow up.
                </p>

                <p className="text-base leading-relaxed mb-4">
                    If you receive a Go decision and proceed, you own the outcome.
                </p>

                <p className="text-base leading-relaxed mb-4">
                    If you receive a No-Go decision and proceed anyway, you do so with full awareness of the risks.
                </p>

                <p className="text-base leading-relaxed text-gray-700">
                    If you receive a Modify decision, implementation is your responsibility. We do not refine or revise the modifications.
                </p>
            </section>

            {/* What This Is Not */}
            <section className="mb-20">
                <h3 className="text-xl font-normal mb-6">What this process does not include</h3>

                <ul className="space-y-3 text-base leading-relaxed">
                    <li>Market research or competitive analysis</li>
                    <li>Financial modeling or revenue projections</li>
                    <li>Customer development or user interviews</li>
                    <li>Technical implementation or architecture design</li>
                    <li>Legal review or regulatory compliance guidance</li>
                    <li>Ongoing consulting or advisory relationship</li>
                    <li>Introductions, referrals, or network access</li>
                </ul>

                <p className="text-base leading-relaxed mt-8 text-gray-700">
                    If you need any of these services, seek them elsewhere before or after evaluation.
                </p>
            </section>

        </main>
    );

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Header />
            {currentPage === 'home' ? <HomePage /> : <ProcessPage />}
            <Footer />
        </div>
    );
}