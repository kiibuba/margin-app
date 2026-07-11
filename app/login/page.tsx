import { Suspense } from "react";
import Nav from "@/components/Nav";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main>
      <Nav />
      <div className="bg-darkbg min-h-screen pt-[73px] flex items-center justify-center px-6 py-16">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
