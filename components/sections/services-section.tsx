import { Card, CardContent } from "@/components/ui/card";
import { Home, Paintbrush, Wrench, Scissors } from "lucide-react";

const services = [
  {
    icon: <Home className="h-8 w-8" />,
    title: "Home Cleaning",
    description: "Professional house cleaning services",
  },
  {
    icon: <Paintbrush className="h-8 w-8" />,
    title: "Painting",
    description: "Interior and exterior painting services",
  },
  {
    icon: <Wrench className="h-8 w-8" />,
    title: "Plumbing",
    description: "Expert plumbing repair and installation",
  },
  {
    icon: <Scissors className="h-8 w-8" />,
    title: "Beauty & Spa",
    description: "Professional beauty services at home",
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center text-primary">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}