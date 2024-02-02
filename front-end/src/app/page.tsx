import Form from "@/components/form";
import Header from "@/components/header";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="  mx-auto w-full h-full flex flex-1 items-center justify-center">
        <Form />
      </div>
    </main>
  );
}
