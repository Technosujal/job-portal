import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProfileDialog } from "./ProfileDialog";
import { motion } from "framer-motion";

export function Navbar() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";
  const isSeeker = user?.role === "job_seeker";

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={`text-sm font-semibold tracking-tight transition-all hover:text-primary relative group ${location === href ? "text-primary" : "text-muted-foreground"}`}>
      {children}
      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location === href ? "w-full" : ""}`} />
    </Link>
  );

  const MobileLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} onClick={() => setOpen(false)} className={`text-lg font-bold py-2 px-4 rounded-xl transition-all ${location === href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
      {children}
    </Link>
  );

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-background/80 backdrop-blur-xl py-2 shadow-sm border-primary/10" : "bg-transparent py-4 border-transparent"}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl group">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Briefcase className="h-6 w-6" />
            </motion.div>
            <span className="font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">CareerPort</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-10">
            <NavLink href="/jobs">Browse Jobs</NavLink>
            {isRecruiter && <NavLink href="/recruiter/jobs">Manage Jobs</NavLink>}
            {isSeeker && <NavLink href="/seeker/applications">My Applications</NavLink>}
            {isAdmin && <NavLink href="/admin/dashboard">Dashboard</NavLink>}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <UserIcon className="h-4 w-4" />
                <span>{user.username}</span>
              </div>
              <ProfileDialog
                user={user}
                trigger={
                  <Button variant="ghost" size="icon">
                    <UserIcon className="h-4 w-4" />
                  </Button>
                }
              />
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-4 pt-10">
            <MobileLink href="/">Home</MobileLink>
            <MobileLink href="/jobs">Browse Jobs</MobileLink>
            {isRecruiter && <MobileLink href="/recruiter/jobs">Manage Jobs</MobileLink>}
            {isSeeker && <MobileLink href="/seeker/applications">My Applications</MobileLink>}
            {isAdmin && <MobileLink href="/admin/dashboard">Dashboard</MobileLink>}
            
            <div className="mt-auto border-t pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.username}</span>
                  </div>
                  <ProfileDialog
                    user={user}
                    trigger={
                      <Button variant="outline" className="w-full justify-start">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    }
                  />
                  <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
