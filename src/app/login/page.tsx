import { LoginForm } from "@/components/login-form";

type LoginPageProps = {
  searchParams?: {
    next?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <LoginForm
      nextPath={searchParams?.next}
      adminEmail={process.env.ADMIN_EMAIL}
      adminPassword={process.env.ADMIN_PASSWORD}
    />
  );
}
