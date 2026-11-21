import { Star, Quote, CheckCircle2 } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  location: string;
  service: string;
  rating: number;
}

const row1: Testimonial[] = [
  {
    quote:
      "My Daikin inverter AC suddenly stopped cooling. The technician arrived at my Banani apartment on time, replaced the capacitor, checked gas pressure, and I only paid after feeling the ice-cold air. Zero upfront stress!",
    name: "Tanvir Ahmed",
    location: "Banani, Dhaka",
    service: "AC Deep Servicing & Gas Top-up",
    rating: 5,
  },
  {
    quote:
      "Dropped my iPhone 14 Pro and shattered the OLED panel. Rahim replaced it with an authentic display in 45 minutes at his workshop. Testing the touch response before paying via card made all the difference.",
    name: "Sabrina Rahman",
    location: "Gulshan-2, Dhaka",
    service: "Smartphone OLED Screen Replacement",
    rating: 5,
  },
  {
    quote:
      "My MacBook Pro wouldn't turn on after a coffee spill. Other shops asked for advance payment with no guarantee. FixMate technician cleaned the motherboard corrosion and got it booting with all my files safe. Highly recommended!",
    name: "Mahmudul Hasan",
    location: "Dhanmondi, Dhaka",
    service: "MacBook Motherboard & Liquid Recovery",
    rating: 5,
  },
  {
    quote:
      "Front-load washing machine was giving an E3 error and stopping mid-cycle. The technician diagnosed a clogged drain pump filter, cleared it, and ran a test spin. Very professional and polite.",
    name: "Farhana Kabir",
    location: "Uttara Sector 7, Dhaka",
    service: "Washing Machine Pump & Spin Diagnostic",
    rating: 5,
  },
  {
    quote:
      "Our 55-inch Sony TV had sound but no picture. Found a certified TV specialist here who repaired the LED backlight strips on the spot. Clear invoice and paid via Stripe card seamlessly.",
    name: "Imtiaz Hossain",
    location: "Mirpur DOHS, Dhaka",
    service: "Sony 55\" 4K LED Backlight Repair",
    rating: 5,
  },
];

const row2: Testimonial[] = [
  {
    quote:
      "Our double-door refrigerator was freezing vegetables in the fresh food compartment. The technician replaced the defrost thermostat and sealed the gasket. No advance taken—paid right after verification.",
    name: "Nabila Farhin",
    location: "Bashundhara R/A, Dhaka",
    service: "Refrigerator Defrost Thermostat Replacement",
    rating: 5,
  },
  {
    quote:
      "Dell XPS was overheating and thermal throttling during 3D renders. Had the dual fans replaced and Arctic MX-4 thermal paste applied. Temps dropped by 22°C. Excellent workmanship!",
    name: "Shakib Al Mahmud",
    location: "Mohakhali, Dhaka",
    service: "Laptop Thermal Overhaul & Fan Replacement",
    rating: 5,
  },
  {
    quote:
      "Booked a cassette AC deep chemical wash for my dental clinic. Two technicians showed up equipped with high-pressure washers and protective covers. Spotless work without any mess left behind.",
    name: "Dr. Ariful Islam",
    location: "Baridhara Diplomatic Zone, Dhaka",
    service: "Commercial Cassette AC Chemical Servicing",
    rating: 5,
  },
  {
    quote:
      "After a drop, my iPhone 13 lost Face ID. A micro-soldering technician re-aligned the dot projector prism under microscope. Face ID is working 100% like factory new. Remarkable expertise.",
    name: "Tasnim Zahan",
    location: "Lalmatia, Dhaka",
    service: "iPhone Face ID & TrueDepth Micro-Soldering",
    rating: 5,
  },
  {
    quote:
      "Heavy vibration during spin cycle on my LG washing machine was shaking the whole floor. Technician leveled the drum and replaced the shock absorber dampers. Runs silent now.",
    name: "Rafiqul Anam",
    location: "Shantinagar, Dhaka",
    service: "Washing Machine Damper & Drum Alignment",
    rating: 5,
  },
];

const row3: Testimonial[] = [
  {
    quote:
      "A short circuit tripped the main sub-distribution board at our ancestral house in Old Dhaka. The certified electrician rewired the damaged lines and installed an ABB RCBO breaker within two hours.",
    name: "Mehedi Hasan",
    location: "Wari, Old Dhaka",
    service: "Emergency Main Board Breaker Rewiring",
    rating: 5,
  },
  {
    quote:
      "iPad Pro wouldn't charge unless bent at an awkward angle. Technician replaced the USB-C dock flex cable. Saved me from buying a whole new logic board. Transparent pricing from start to finish.",
    name: "Nusrat Jahan",
    location: "Banasree, Dhaka",
    service: "iPad Pro USB-C Charging Port Replacement",
    rating: 5,
  },
  {
    quote:
      "Refrigerator compressor relay was clicking on and off continuously. Technician tested starting amps, replaced the relay capacitor, and charged a fair base price. Highly dependable service.",
    name: "Abrar Zahin",
    location: "Niketan, Dhaka",
    service: "Refrigerator Compressor Relay & Start Kit",
    rating: 5,
  },
  {
    quote:
      "HP laptop display hinge broke and cracked the bezel. Repaired the magnesium chassis mounts and replaced the damaged display cable. Looks good as new with smooth hinge tension.",
    name: "Shaila Parveen",
    location: "Badda, Dhaka",
    service: "Laptop Hinge & Chassis Reconstruction",
    rating: 5,
  },
  {
    quote:
      "Samsung QLED TV power board was dead after a lightning power surge. Technician replaced the blown MOSFETs and diode bridge instead of charging for an entire new board. Genuine honest repairs.",
    name: "Kazi Muntasir",
    location: "Khilgaon, Dhaka",
    service: "QLED TV Power Supply Board Component Repair",
    rating: 5,
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-[320px] sm:w-[380px] shrink-0 rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-xs hover:shadow-md hover:border-[#18756B]/60 transition-all flex flex-col justify-between select-none">
      <div>
        {/* Rating and quote icon */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-[#F4B740]">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
          <Quote className="h-5 w-5 text-[#18756B]/20" />
        </div>

        <p className="text-xs text-[#152C2B] leading-relaxed italic line-clamp-4">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#DCE5DF]/70">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#152C2B]">{item.name}</h4>
            <p className="text-[10px] text-[#526564]">{item.location}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Sample Story
          </span>
        </div>
        <div className="mt-2 text-[10px] font-semibold text-[#18756B] bg-[#18756B]/5 px-2 py-0.5 rounded-md truncate">
          {item.service}
        </div>
      </div>
    </div>
  );
}

export default function HomeTestimonialsMarquee() {
  return (
    <section className="relative overflow-hidden py-6">
      <div className="text-center max-w-xl mx-auto mb-10 px-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#152C2B] sm:text-3xl">
          Customer Repair Experiences
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#526564]">
          Sample customer repair stories illustrating the on-demand booking journey and pay-after-completion protection model.
        </p>
      </div>

      {/* Marquee Wrapper with left and right gradient fade masks */}
      <div className="relative space-y-4 overflow-hidden">
        {/* Left and Right Fade Overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-linear-to-r from-[#F6F5EF] dark:from-[#081414] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-linear-to-l from-[#F6F5EF] dark:from-[#081414] to-transparent z-10" />

        {/* Row 1: Slide Left to Right */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-right flex gap-4">
            {[...row1, ...row1].map((item, idx) => (
              <TestimonialCard key={`r1-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Slide Right to Left */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-left flex gap-4">
            {[...row2, ...row2].map((item, idx) => (
              <TestimonialCard key={`r2-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 3: Slide Left to Right */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-right flex gap-4">
            {[...row3, ...row3].map((item, idx) => (
              <TestimonialCard key={`r3-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
