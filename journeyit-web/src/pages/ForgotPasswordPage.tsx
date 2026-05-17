import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSent(true);
    } catch {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="size-5 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Journey<span className="text-primary">It</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {isSent ? (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="size-8" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Check your email
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    We&apos;ve sent a password reset link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSent(false);
                      setEmail("");
                    }}
                  >
                    Send to a different email
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground">
                      Forgot password?
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enter your email and we&apos;ll send you a reset link
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isLoading ? "Sending..." : "Send reset link"}
                    </Button>
                  </form>
                </>
              )}

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="size-4" />
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
