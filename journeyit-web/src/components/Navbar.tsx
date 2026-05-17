import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Plane, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "AI Chat", href: "/chat" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Plane className="size-5 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Journey<span className="text-primary">It</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-card px-1.5 py-1 pr-3 transition-colors hover:bg-muted">
                  <Avatar className="size-8 border border-border">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {(user.displayName || user.email || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[100px] truncate text-sm font-medium text-foreground lg:inline">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="hidden size-3.5 text-muted-foreground lg:inline" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 border-border">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="cursor-pointer text-muted-foreground focus:text-foreground"
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-2 size-4 text-muted-foreground" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-border p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 border-b border-border p-6">
                  <Plane className="size-5 text-primary" />
                  <span className="text-xl font-bold text-foreground">
                    Journey<span className="text-primary">It</span>
                  </span>
                </div>
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "text-foreground bg-muted"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </nav>
                <div className="border-t border-border p-4 space-y-2">
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground"
                        onClick={() => {
                          navigate("/profile");
                          setMobileOpen(false);
                        }}
                      >
                        <User className="mr-2 size-4" />
                        Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 size-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full border-border"
                        onClick={() => {
                          navigate("/login");
                          setMobileOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => {
                          navigate("/register");
                          setMobileOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
