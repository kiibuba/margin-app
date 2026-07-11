import Link from "next/link";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/SignOutButton";
import NavFrame from "@/components/NavFrame";
import { createClient } from "@/lib/supabase/server";

export const NAV_HEIGHT = 73;

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <NavFrame>
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5 text-[20px] font-bold font-serif text-cream tracking-tight group">
          <span className="transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
            <Logo size={32} />
          </span>
          Second Opinion
        </Link>
        <nav className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-[15px] text-mutedlight items-center">
            <Link href="/#how" className="hover:text-accent transition-colors">How it works</Link>
            <Link href="/#pricing" className="hover:text-accent transition-colors">Pricing</Link>
            {user && <Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>}
            {user && <SignOutButton />}
          </div>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <Link href="/login" className="btn btn-primary">Sign in</Link>
          )}
        </nav>
      </div>
    </NavFrame>
  );
}
