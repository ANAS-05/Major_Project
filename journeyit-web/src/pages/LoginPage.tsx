import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Import local images from assets
import carousel1 from "@/assets/download.jfif";
import carousel2 from "@/assets/download (1).jfif";
import carousel3 from "@/assets/download (2).jfif";

const carouselImages = [
  { src: carousel1, alt: "Beautiful destination" },
  { src: carousel2, alt: "Travel adventure" },
  { src: carousel3, alt: "Explore the world" },
];

export default function LoginPage() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleGoogleLogin = () => {
    // Handle Google OAuth
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ── LEFT: Image Carousel ── */}
        <div className="relative hidden lg:block h-screen overflow-hidden">
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full h-full"
          >
            <CarouselContent className="h-full ml-0">
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="h-full pl-0">
                  <div className="relative h-full w-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Logo overlay */}
          <div className="absolute top-8 left-8 z-10">
            <Link to="/" className="flex items-center gap-2">
              <Plane className="size-6 text-primary" />
              <span className="text-xl font-bold text-primary-foreground drop-shadow-lg">
                Journey<span className="text-primary">It</span>
              </span>
            </Link>
          </div>

          {/* Carousel indicators */}
          <div className="absolute bottom-8 left-8 right-8 z-10 flex items-center justify-between">
            <div className="flex gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-8 bg-primary"
                      : "w-4 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <p className="text-sm text-primary-foreground/80 drop-shadow">
              {carouselImages[current]?.alt}
            </p>
          </div>
        </div>

        {/* ── RIGHT: Login Form ── */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <Plane className="size-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Journey<span className="text-primary">It</span>
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-foreground">
                    Welcome back
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to continue your journey
                  </p>
                </div>

                {/* Google Login Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleGoogleLogin}
                  className="w-full h-11 border-input hover:bg-muted"
                >
                  <svg className="size-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 pl-10 border-input focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                      </Label>
                      <Link
                        to="#"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 pl-10 pr-10 border-input focus:border-primary focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign in
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="#"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Back to home link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
