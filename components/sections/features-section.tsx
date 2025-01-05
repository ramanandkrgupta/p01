import { ShieldCheck, Clock, DollarSign, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Verified Professionals",
    description: "All service providers are thoroughly vetted",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Easy Booking",
    description: "Book services in just a few clicks",
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Transparent Pricing",
    description: "No hidden charges, pay only for what you need",
  },
  {
    icon: <HeadphonesIcon className="h-6 w-6" />,
    title: "24/7 Support",
    description: "Round-the-clock customer assistance",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 flex justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}