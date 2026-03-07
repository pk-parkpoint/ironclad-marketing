'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { HOME_FAQ_ITEMS } from '@/content/home-faqs';

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Hover: dark bg + white text. Expanded: dark bg + blue question text.
  const isDark = isHovered || isOpen;

  return (
    <div
      style={{
        backgroundColor: isDark ? '#222326' : '#F4F5F8',
        border: '1px solid #222326',
        borderRadius: 2,
        transition: 'background-color 200ms ease',
      }}
    >
      <button
        aria-expanded={isOpen}
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
        type="button"
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: isOpen ? '#2563EB' : isDark ? '#FFFFFF' : '#1a1a1a',
            transition: 'color 200ms ease',
          }}
        >
          {faq.question}
        </span>
        {isOpen ? (
          <Minus
            className="h-5 w-5 shrink-0 ml-4"
            style={{ color: isDark ? '#FFFFFF' : '#1a1a1a', transition: 'color 200ms ease' }}
          />
        ) : (
          <Plus
            className="h-5 w-5 shrink-0 ml-4"
            style={{ color: isDark ? '#FFFFFF' : '#1a1a1a', transition: 'color 200ms ease' }}
          />
        )}
      </button>

      {/* Answer — dark bg matching section, white text */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? 500 : 0,
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 300ms ease, opacity 200ms ease',
        }}
      >
        <div
          style={{
            padding: '4px 16px 16px 16px',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1.7,
          }}
        >
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    const nextOpen = openIndex !== index;

    if (openIndex >= 0 && openIndex !== index && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ironclad:faq-toggle", {
          detail: {
            question: HOME_FAQ_ITEMS[openIndex]?.question ?? "",
            open: false,
          },
        }),
      );
    }

    setOpenIndex(nextOpen ? index : -1);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ironclad:faq-toggle", {
          detail: {
            question: HOME_FAQ_ITEMS[index]?.question ?? "",
            open: nextOpen,
          },
        }),
      );
    }
  };

  return (
    <section style={{ backgroundColor: '#1E293B', padding: '96px 0 112px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        {/* Eyebrow */}
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#E2E8F0',
            color: '#1E293B',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 20px',
            borderRadius: 999,
            marginBottom: 20,
          }}
        >
          Got Questions? We&apos;ve Got Answers!
        </span>

        {/* Header */}
        <h2
          style={{
            color: '#FFFFFF',
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Ironclad Plumbing FAQ
        </h2>

        {/* Decorative line */}
        <div
          style={{
            width: 48,
            height: 3,
            backgroundColor: '#3B82F6',
            borderRadius: 2,
            margin: '0 auto 48px auto',
          }}
        />

        {/* Accordion — items spaced apart */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HOME_FAQ_ITEMS.map((faq, index) => (
            <FAQItem
              faq={faq}
              isOpen={openIndex === index}
              key={index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
