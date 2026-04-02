import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you will receive an email with a tracking number. You can use this number on our website or the carrier\'s website to track your package in real-time.',
    category: 'Orders',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for all unworn items with original tags attached. Simply initiate a return through your account or contact our customer service team. Refunds are processed within 5-7 business days.',
    category: 'Returns',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee. International orders may take 10-15 business days depending on the destination.',
    category: 'Shipping',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes! We ship to over 30 countries worldwide. International shipping rates and delivery times vary by location. You can see the shipping cost at checkout before completing your order.',
    category: 'Shipping',
  },
  {
    question: 'How do I find my size?',
    answer:
      'Each product page has a detailed size guide. We recommend measuring your favorite garment and comparing it to our size chart. If you\'re between sizes, we suggest sizing up for a more comfortable fit.',
    category: 'Products',
  },
  {
    question: 'What materials do you use?',
    answer:
      'We use high-quality, sustainable materials including organic cotton, recycled polyester, and premium wool blends. Each product description includes detailed material information.',
    category: 'Products',
  },
  {
    question: 'How do I care for my COVE garments?',
    answer:
      'Care instructions are included on the label of each garment. Generally, we recommend washing in cold water, air drying when possible, and avoiding bleach to maintain the quality and longevity of your items.',
    category: 'Products',
  },
  {
    question: 'Can I modify or cancel my order?',
    answer:
      'Orders can be modified or cancelled within 1 hour of placement. After that, we begin processing immediately to ensure fast delivery. Please contact our customer service team as soon as possible.',
    category: 'Orders',
  },
  {
    question: 'Do you offer gift cards?',
    answer:
      'Yes! Digital gift cards are available in denominations from $25 to $500. They are delivered via email and never expire. Perfect for gifting the COVE experience to friends and family.',
    category: 'Orders',
  },
  {
    question: 'How do I contact customer service?',
    answer:
      'You can reach our customer service team via email at support@cove.com, by phone at +1 (555) 123-4567, or through the contact form on our website. We aim to respond within 24 hours.',
    category: 'General',
  },
];

const categories = ['All', ...Array.from(new Set(faqData.map((item) => item.category)))];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center px-4 py-12">
          <h1 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-4">
          {/* Search */}
          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-lg focus:border-[#00bfff] focus:outline-none transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#00bfff] text-black'
                    : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No questions found matching your search.
                </p>
                <p className="text-gray-500 mt-2">
                  Try different keywords or browse all categories.
                </p>
              </div>
            ) : (
              filteredFAQs.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#00bfff] text-xs uppercase font-medium px-2 py-1 bg-[#00bfff]/10 rounded">
                        {item.category}
                      </span>
                      <span className="text-white font-medium">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-400 leading-relaxed pl-[calc(1rem+4px)]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-[#00bfff]/20 to-purple-500/20 rounded-lg p-8">
            <h3 className="text-white text-xl font-bold mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <a
              href="/contact"
              className="inline-block bg-[#00bfff] text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
