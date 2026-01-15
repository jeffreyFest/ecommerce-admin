"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;

    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (result?.error) {
        setErr(result.error);
        console.log(result.error)
    } else {
      router.push("/dashboard");
    }
  };
  return (
    <>
      <p >{err}</p>
      <input
        value={email}
        placeholder="Enter your email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        value={password}
        placeholder="Enter your password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Submit</button>
    </>
  );
}
