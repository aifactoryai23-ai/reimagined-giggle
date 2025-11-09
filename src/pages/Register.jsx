import React from "react";
import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div className="flex justify-center mt-20">
      <SignUp path="/register" routing="path" signInUrl="/login" />
    </div>
  );
}
