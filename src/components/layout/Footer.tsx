'use client';

import { motion } from 'framer-motion';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Formula', href: '#' },
            { label: 'Science', href: '#' },
            { label: 'Athletes', href: '#' },
        ],
        company: [
            { label: 'About', href: '#' },
            { label: 'Contact', href: '#' },
            { label: 'Press', href: '#' },
        ],
        legal: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
            { label: 'Cookies', href: '#' },
        ],
    };

    return (
        <footer className="bg-void border-t border-void-200">
            <div className="w-[85%] max-w-[1600px] mx-auto py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <motion.div
                            className="font-display text-xl tracking-[0.3em] text-void-950 mb-4"
                            whileHover={{ opacity: 0.7 }}
                        >
                            AETHER
                        </motion.div>
                        <p className="font-data text-void-500 text-xs leading-relaxed">
                            Ionic precision for<br />elite performance.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-data text-void-600 text-xs mb-4 uppercase">
                                {category}
                            </h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="font-data text-void-500 text-xs hover:text-void-950 transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-void-200 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="font-data text-void-500 text-xs">
                            © {currentYear} AETHER LABS. ALL RIGHTS RESERVED.
                        </p>
                        <p className="font-data text-void-400 text-xs">
                            BATCH: 001 • PRE-LAUNCH • Q4 2025
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
