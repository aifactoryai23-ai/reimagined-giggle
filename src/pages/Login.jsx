import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex justify-center mt-20">
      <SignIn path="/login" routing="path" signUpUrl="/register" />
    </div>
  );
}
