import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, PlayCircle, Percent, FileWarning, ImageOff, ShieldAlert, Link as LinkIcon, Cpu, ScanSearch, FileCheck, Brain, Eye, Scale, Award, FileText, BarChart2 } from "lucide-react";

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">

                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
                                <ShieldCheck size={16} />
                                <span>Trust in Every Transaction</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                                AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Compliance Monitoring</span> for E-Commerce
                            </h1>

                            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                                Detect fake listings, pricing fraud, and rule violations automatically. Protect your brand reputation with our advanced multi-modal AI engine.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link
                                    to="/dashboard"
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight size={20} />
                                </Link>
                                <Link
                                    to="/analyzer"
                                    className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl transition-all flex items-center gap-2"
                                >
                                    <PlayCircle size={20} />
                                    View Demo
                                </Link>
                            </div>
                        </div>

                        {/* Visual Content */}
                        <div className="flex-1 relative">
                            {/* Glow Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl -z-10"></div>

                            <img
                                src="/assets/hero.png"
                                alt="AI Compliance Shield"
                                className="w-full max-w-[600px] mx-auto drop-shadow-2xl animate-float"
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -z-10 opacity-30">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#0F62FE" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,60.5,29.8C50.8,41.1,42.7,51.4,32.3,60.1C21.9,68.8,9.2,75.9,-2.4,80.1C-14,84.2,-26.3,85.4,-37.6,79.5C-48.9,73.6,-59.2,60.6,-66.2,46.5C-73.2,32.4,-76.9,17.2,-77.2,1.8C-77.5,-13.6,-74.4,-29.2,-66,-42.1C-57.6,-55,-43.9,-65.2,-30.2,-72.6C-16.5,-80,-2.8,-84.6,9.8,-82.9L22.4,-81.2Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">The Hidden Dangers in E-Commerce</h2>
                        <p className="text-slate-600">
                            Millions of listings violate basic compliance rules every day, leading to legal risks and lost customer trust.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Card 1: Fake Discounts */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <Percent size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fake Discounts</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Artificially inflated MRPs designed to make standard prices look like massive deals, deceiving buyers.
                            </p>
                        </div>

                        {/* Card 2: Missing MRP */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <FileWarning size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Missing MRP</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Products listed without mandatory Maximum Retail Price declarations, violating consumer rights laws.
                            </p>
                        </div>

                        {/* Card 3: Misleading Images */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <ImageOff size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Misleading Images</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Low-quality, watermarked, or irrelevant images that don’t match the actual product description.
                            </p>
                        </div>

                        {/* Card 4: Consumer Fraud */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                                <ShieldAlert size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Consumer Fraud</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Counterfeit items and branding scams that put your customers and your platform's reputation at risk.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Flow Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
                            <span>Simple & Seamless</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600">
                            From raw listing to actionable compliance report in seconds.
                        </p>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-1 bg-slate-100 -z-10"></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-100 group-hover:scale-110 transition-all z-10">
                                <LinkIcon size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Upload or Link</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">
                                Simply paste the product URL or upload the listing data via API.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white border-4 border-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-purple-100 group-hover:scale-110 transition-all z-10">
                                <Cpu size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">2. AI Analysis</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">
                                Our engine scans text, prices, and images for anomalies simultaneously.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white border-4 border-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-orange-100 group-hover:scale-110 transition-all z-10">
                                <ScanSearch size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Violations Detected</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">
                                Instant alerts for fake discounts, IP infringement, or policy breaks.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-white border-4 border-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-green-100 group-hover:scale-110 transition-all z-10">
                                <FileCheck size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Report Generated</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">
                                Get a compliance score (0-100) and detailed evidence for every claim.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Comprehensive Compliance Suite</h2>
                        <p className="text-slate-400">
                            Everything you need to safeguard your e-commerce capabilities in one powerful platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <Brain size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI-Based Compliance</h3>
                            <p className="text-slate-400">Advanced machine learning models automatically detect policy violations that simple keyword filters miss.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                <Eye size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">NLP & Image Analysis</h3>
                            <p className="text-slate-400">Multi-modal analysis reads product descriptions and scans images for watermarks, text, or quality issues.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-orange-500 transition-colors group">
                            <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                <Scale size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Rule-Engine Verification</h3>
                            <p className="text-slate-400">Customizable heuristic rules ensure strict adherence to hard constraints like MRP and mandatory fields.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-500 transition-colors group">
                            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-all">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Compliance Score</h3>
                            <p className="text-slate-400">Instant 0-100 trust score for every product, helping you prioritize high-risk listings immediately.</p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-colors group">
                            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Report Generation</h3>
                            <p className="text-slate-400">Download detailed PDF/JSON reports with evidence trails for auditing and seller communication.</p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-pink-500 transition-colors group">
                            <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500 group-hover:text-white transition-all">
                                <BarChart2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Dashboard Analytics</h3>
                            <p className="text-slate-400">Visual insights into violation trends, category risks, and overall catalog health over time.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
