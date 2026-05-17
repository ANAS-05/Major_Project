import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@journeyit.com",
    description: "We'll respond within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    description: "Mon-Fri from 9am to 6pm",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Bangalore, India",
    description: "HSR Layout, Sector 7",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "9:00 AM - 6:00 PM",
    description: "Monday to Friday",
  },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ───────────── CONTACT SECTION ───────────── */}
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            {/* ── LEFT: Get in Touch Info ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-8"
            >
              {/* Header */}
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="h-7 px-3 text-xs font-medium bg-primary/10 border border-primary/20 text-primary"
                >
                  Contact Us
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Get in touch
                </h1>
                <p className="text-lg text-muted-foreground">
                  Have a question or feedback? We'd love to hear from you.
                </p>
              </div>

              <div className="h-px bg-border" />

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Let's start a conversation
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Card className="border border-border bg-card shadow-sm h-full">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <item.icon className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">
                            {item.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── RIGHT: Contact Form ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="border border-border bg-card shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <CheckCircle2 className="size-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Message sent!</h3>
                      <p className="mt-2 text-muted-foreground">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-foreground">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-11 border-input focus:border-primary focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-11 border-input focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="h-11 border-input focus:border-primary focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-foreground">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={5}
                          className="border-input resize-none focus:border-primary focus:ring-primary"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                      >
                        <Send className="size-4 mr-2" />
                        Send Message
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        By submitting this form, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
