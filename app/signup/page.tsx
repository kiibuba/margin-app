import Nav from "@/components/Nav";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <main>
      <Nav />
      <div className="bg-darkbg min-h-[100dvh] pt-[73px] flex items-center justify-center px-6 py-16">
        <SignupForm />
      </div>
    </main>
  );
}
