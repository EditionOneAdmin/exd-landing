'use client';

import '../globals.css';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Sparkles, Zap, Building2, ChevronDown } from 'lucide-react';

const tiers = [
  {
    name: 'Explorer',
    price: 'Free',
    subtitle: 'For individuals getting started',
    features: [
      '5 Datasets',
      'Basic Visualizations',
      'Community Access',
    ],
    cta: 'Get Started',
    href: '#',
    icon: Sparkles,
    gradient: 'from-cyan-500 to-indigo-500',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    subtitle: 'For professionals and teams',
    features: [
      'Unlimited Datasets',
      'AI Copilot',
      'Custom Dashboards',
      'API Access',
      'Priority Support',
    ],
    cta: 'Start Free Trial',
    href: '#',
    icon: Zap,
    gradient: 'from-indigo-500 to-purple-500',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    subtitle: 'For organizations at scale',
    features: [
      'Everything in Pro',
      'White-label Solution',
      'SSO & SAML',
      'Dedicated Support',
      'Custom Integrations',
    ],
    cta: 'Contact Sales',
    href: '#',
    icon: Building2,
    gradient: 'from-purple-500 to-pink-500',
    popular: false,
  },
];

const faqs = [
  {
    q: 'Can I try Pro features before committing?',
    a: 'Absolutely! Every Pro plan starts with a 14-day free trial. No credit card required. Explore all features and decide if it\'s right for you.',
  },
  {
    q: 'What happens when I exceed the free tier limits?',
    a: 'You\'ll receive a notification when approaching your 5-dataset limit. You can upgrade to Pro anytime to unlock unlimited datasets and advanced features.',
  },
  {
    q: 'Can I cancel or downgrade my plan at any time?',
    a: 'Yes. You can cancel or downgrade at any time from your account settings. Your current plan remains active until the end of the billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, and wire transfers for Enterprise plans. All payments are securely processed via Stripe.',
  },
  {
    q: 'Is there a discount for annual billing?',
    a: 'Yes! Annual billing saves you 20% — that\'s $39/mo instead of $49/mo on the Pro plan. Enterprise pricing is negotiated individually.',
  },
  {
    q: 'What kind of support is included?',
    a: 'Explorer users get community forum access. Pro users enjoy priority email support with 24h response times. Enterprise customers receive a dedicated account manager and SLA-backed support.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]"
      initial={false}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-sm sm:text-base text-white font-medium pr-4">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050507] pt-28 pb-20 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-gray-400 mb-6">
            Simple, transparent pricing
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Plans for every{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              stage of growth
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Start free, upgrade when you need more power. No hidden fees, no surprises.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative group rounded-2xl p-[1px] ${
                tier.popular
                  ? 'bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent'
                  : 'bg-white/[0.06]'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
                    Most Popular
                  </span>
                </div>
              )}
              <div
                className={`h-full rounded-2xl p-6 sm:p-8 flex flex-col backdrop-blur-xl ${
                  tier.popular
                    ? 'bg-[#0a0a12]/90'
                    : 'bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.gradient} p-[1px]`}>
                    <div className="w-full h-full rounded-[11px] bg-[#050507] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                </div>

                <div className="mb-1">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-gray-500 text-base ml-1">{tier.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-6">{tier.subtitle}</p>

                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={tier.href}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                    tier.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                      : 'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {tier.cta}
                </motion.a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm">
            Everything you need to know about our plans.
          </p>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {faqs.map((faq) => (
            <motion.div key={faq.q} variants={cardVariants}>
              <FAQItem q={faq.q} a={faq.a} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
