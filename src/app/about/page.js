import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Team member data
const teamMembers = [
    {
        name: "Aditya Kamble",
        role: "Founder & CEO",
        bio: "Visionary leader with 10+ years of e-commerce experience, passionate about creating exceptional shopping experiences.",
        avatar: "AK",
    },
    {
        name: "Sarah Chen",
        role: "Head of Design",
        bio: "Creative mastermind behind our beautiful interfaces, ensuring every pixel delivers delight.",
        avatar: "SC",
    },
    {
        name: "Michael Rivera",
        role: "Tech Lead",
        bio: "Engineering wizard who builds robust systems that scale and perform flawlessly.",
        avatar: "MR",
    },
    {
        name: "Emily Johnson",
        role: "Customer Success",
        bio: "Dedicated to ensuring every customer has an amazing experience with our platform.",
        avatar: "EJ",
    },
];

// Stats data
const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Products Sold" },
    { value: "99%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" },
];

// Values data
const values = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: "Customer First",
        description: "Every decision we make is centered around delivering value and joy to our customers.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        title: "Quality Guaranteed",
        description: "We never compromise on quality. Every product meets our high standards before reaching you.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Fast Delivery",
        description: "Swift and reliable shipping to get your orders to you as quickly as possible.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        title: "Secure Shopping",
        description: "Your data and transactions are protected with industry-leading security measures.",
    },
];

// Team Member Card
function TeamMemberCard({ member }) {
    return (
        <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                    {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                </h3>
                <span className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-3">
                    {member.role}
                </span>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {member.bio}
                </p>
            </div>
        </div>
    );
}

// Value Card
function ValueCard({ value }) {
    return (
        <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 dark:from-violet-600/20 dark:to-indigo-600/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {value.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {value.description}
            </p>
        </div>
    );
}

// Stat Card
function StatCard({ stat }) {
    return (
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
            </div>
        </div>
    );
}

function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-16 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent dark:from-violet-600/10" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-medium mb-6">
                            About Us
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Welcome to{" "}
                            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                AK Shop
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Your premium destination for quality products and exceptional shopping experience.
                            We&apos;re passionate about bringing you the best in style, quality, and value.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <StatCard key={index} stat={stat} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4">
                                Our Story
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Building the Future of{" "}
                                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                    E-Commerce
                                </span>
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                <p>
                                    AK Shop was founded with a simple mission: to make premium shopping
                                    accessible to everyone. What started as a small online store has grown
                                    into a trusted destination for thousands of customers worldwide.
                                </p>
                                <p>
                                    We believe that shopping should be more than just a transaction—it should
                                    be an experience. That&apos;s why we curate every product with care, ensuring
                                    that what you receive exceeds your expectations.
                                </p>
                                <p>
                                    Our commitment to quality, customer satisfaction, and innovation drives
                                    everything we do. We&apos;re not just selling products; we&apos;re building
                                    relationships and creating memorable experiences.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-1">
                                <div className="w-full h-full rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-6">
                                            <svg
                                                className="w-12 h-12 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            AK Shop
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Est. 2024
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-violet-200 dark:bg-violet-900/50 rounded-full blur-3xl opacity-60" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200 dark:bg-indigo-900/50 rounded-full blur-3xl opacity-60" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 bg-white dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4">
                            Our Values
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            What We Stand For
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Our core values guide every decision we make and every interaction we have.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <ValueCard key={index} value={value} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4">
                            Our Team
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Meet the People Behind AK Shop
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            A dedicated team passionate about delivering the best shopping experience.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <TeamMemberCard key={index} member={member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-600 relative overflow-hidden">
                {/* Background pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        Discover our curated collection of premium products and experience
                        the AK Shop difference today.
                    </p>
                    <a
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105"
                    >
                        Browse Products
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default AboutPage;
