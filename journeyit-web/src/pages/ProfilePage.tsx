import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plane,
  User,
  Mail,
  LogOut,
  ArrowLeft,
  Shield,
  MapPin,
  Heart,
  Settings,
  Bell,
  Globe,
  CreditCard,
  ChevronRight,
  Star,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } catch {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Please sign in
            </h2>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to view your profile
            </p>
            <Button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const joinDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const initials = (user.displayName || user.email || "?")[0].toUpperCase();
  const displayName = user.displayName || user.email?.split("@")[0] || "Traveler";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="size-5 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Journey<span className="text-primary">It</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border border-border bg-card overflow-hidden">
            {/* Cover */}
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary" />
            <CardContent className="p-6 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 sm:-mt-16">
                <Avatar className="size-24 sm:size-28 border-4 border-background shadow-lg bg-card">
                  <AvatarFallback className="bg-primary/10 text-3xl sm:text-4xl font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {displayName}
                      </h1>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          <Mail className="size-3 mr-1" />
                          {user.email}
                        </Badge>
                        <Badge className="bg-primary/10 text-primary border-0">
                          <Shield className="size-3 mr-1" />
                          Verified
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Member since {joinDate}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-border text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="size-4 mr-2" />
                      {isLoggingOut ? "Logging out..." : "Log out"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: MapPin,
              label: "Trips",
              value: "0",
              color: "bg-blue-100 text-blue-700",
            },
            {
              icon: Heart,
              label: "Saved",
              value: "0",
              color: "bg-rose-100 text-rose-700",
            },
            {
              icon: Star,
              label: "Reviews",
              value: "0",
              color: "bg-amber-100 text-amber-700",
            },
            {
              icon: Award,
              label: "Points",
              value: "0",
              color: "bg-emerald-100 text-emerald-700",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
            >
              <Card className="border border-border bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color}`}>
                      <stat.icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Account Settings
              </h2>
              <Card className="border border-border bg-card divide-y divide-border">
                <CardContent className="p-0">
                  {[
                    {
                      icon: User,
                      title: "Personal Information",
                      description: "Update your name and contact details",
                      action: "Edit",
                    },
                    {
                      icon: Mail,
                      title: "Email Address",
                      description: user.email || "",
                      action: "Verified",
                      isBadge: true,
                    },
                    {
                      icon: Bell,
                      title: "Notifications",
                      description: "Email, push, and SMS preferences",
                      action: "Manage",
                    },
                    {
                      icon: Shield,
                      title: "Security",
                      description: "Password and two-factor authentication",
                      action: "Update",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 sm:p-5 flex items-center justify-between group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <item.icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {item.isBadge ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">
                          {item.action}
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground group-hover:text-foreground"
                        >
                          {item.action}
                          <ChevronRight className="size-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Preferences
              </h2>
              <Card className="border border-border bg-card divide-y divide-border">
                <CardContent className="p-0">
                  {[
                    {
                      icon: Globe,
                      title: "Language & Region",
                      description: "English (US) · INR",
                      action: "Change",
                    },
                    {
                      icon: CreditCard,
                      title: "Payment Methods",
                      description: "Manage cards and billing",
                      action: "Manage",
                    },
                    {
                      icon: Settings,
                      title: "Accessibility",
                      description: "Display and accessibility options",
                      action: "Configure",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 sm:p-5 flex items-center justify-between group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                          <item.icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground group-hover:text-foreground"
                      >
                        {item.action}
                        <ChevronRight className="size-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Recent Activity
            </h2>
            <Card className="border border-border bg-card">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                    <Clock className="size-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  No activity yet
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Start booking your first trip to see your activity here
                </p>
                <Link to="/hotels">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Explore Hotels
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card mt-6">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Travel Tips
                </h3>
                <div className="space-y-3">
                  {[
                    "Book early for the best prices",
                    "Check cancellation policies",
                    "Read reviews before booking",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-xs text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
