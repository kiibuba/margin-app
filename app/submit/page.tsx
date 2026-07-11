import { Suspense } from "react";
import Nav from "@/components/Nav";
import SubmitForm from "./SubmitForm";

export default function SubmitPage() {
  return (
    <main>
      <Nav />
      <Suspense fallback={null}>
        <SubmitForm />
      </Suspense>
    </main>
  );
}
