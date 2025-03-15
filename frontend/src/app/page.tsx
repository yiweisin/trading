import AuthForm from "@/components/auth-form";

export default function Home() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Financial Portfolio Manager
      </h1>
      <AuthForm />
    </div>
  );
}
