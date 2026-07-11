import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import StatusPill from "@/components/StatusPill";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main>
      <Nav />
      <div className="max-w-[760px] mx-auto px-6 pt-[calc(73px+4rem)] pb-16">
        <div className="flex items-center justify-between mb-9 flex-wrap gap-4">
          <div>
            <h1 className="font-serif font-bold text-3xl mb-1">Your requests</h1>
            <p className="text-inksoft text-[15px]">{user?.email}</p>
          </div>
          <Link href="/submit" className="btn btn-primary">New request</Link>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="card p-9 text-center text-inksoft">
            Nothing here yet. <Link href="/submit" className="text-accenthover font-semibold underline">Submit your first thing</Link>.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link href={`/order/${o.id}`} key={o.id} className="card p-5 flex items-center justify-between block hover:border-accent transition-colors">
                <div>
                  <div className="font-semibold">{o.subject}</div>
                  <div className="text-sm text-inksoft capitalize">{o.tier} · {new Date(o.created_at).toLocaleDateString()}</div>
                </div>
                <StatusPill status={o.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
