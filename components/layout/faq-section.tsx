import { HOME_FAQ_ITEMS } from "@/content/home-faqs";

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="faq-item__icon faq-item__icon--plus" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg aria-hidden="true" className="faq-item__icon faq-item__icon--minus" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export function FAQSection() {
  return (
    <section className="faq-home" style={{ contentVisibility: "auto", containIntrinsicSize: "980px" }}>
      <div className="faq-home__inner">
        <span className="faq-home__eyebrow">Got Questions? We&apos;ve Got Answers!</span>
        <h2 className="faq-home__title">Ironclad Plumbing FAQ</h2>
        <div className="faq-home__divider" />

        <div className="faq-home__items">
          {HOME_FAQ_ITEMS.map((faq, index) => (
            <details className="faq-item" key={faq.question} open={index === 0}>
              <summary className="faq-item__summary">
                <span>{faq.question}</span>
                <span className="faq-item__icon-wrap">
                  <PlusIcon />
                  <MinusIcon />
                </span>
              </summary>
              <div className="faq-item__answer">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
