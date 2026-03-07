import { Clock, DollarSign, ShieldCheck, Wrench } from "lucide-react";

const GUARANTEES = [
  { icon: Wrench, text: "Fixed Right the First Time" },
  { icon: DollarSign, text: "Upfront Pricing, No Surprises" },
  { icon: Clock, text: "On Time or We Call Ahead" },
  { icon: ShieldCheck, text: "Written Warranty on Every Job" },
];

export function GuaranteeBar() {
  const items = [...GUARANTEES, ...GUARANTEES];

  return (
    <section className="bg-[#111827] flex flex-col justify-center h-[261px] overflow-hidden w-full">
      <h2 className="text-center text-[32px] font-bold leading-[1.2] text-[#FFFFFF] mb-6">
        Our Guarantee
      </h2>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-20 bg-gradient-to-r from-[#111827] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-20 bg-gradient-to-l from-[#111827] to-transparent z-10" />
        <div className="flex items-center gap-12 md:gap-16 w-max animate-[marquee-scroll_60s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:w-full motion-reduce:gap-x-12 motion-reduce:gap-y-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            const hideOnReducedMotion = index >= GUARANTEES.length ? "motion-reduce:hidden" : "";

            return (
              <div
                className={`flex items-center gap-3 shrink-0 whitespace-nowrap ${hideOnReducedMotion}`}
                key={`${item.text}-${index}`}
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-[#3B82F6] shrink-0" style={{ width: 24, height: 24 }} />
                <span className="text-[#FFFFFF] text-[20px] font-semibold">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
