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
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";
  const isSeeker = user?.role === "job_seeker";

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={`text-sm font-medium transition-colors hover:text-primary ${location === href ? "text-primary" : "text-muted-foreground"}`}>
      {children}
    </Link>
  );

  const MobileLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} onClick={() => setOpen(false)} className={`text-lg font-medium py-2 ${location === href ? "text-primary" : "text-foreground"}`}>
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-display tracking-tight">JobPortal</span>
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
