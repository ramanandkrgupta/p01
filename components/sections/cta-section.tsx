import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust Serve Ease for their service needs
        </p>
        <Button size="lg" variant="secondary">
          Book Now
        </Button>
      </div>
    </section>
  );
}