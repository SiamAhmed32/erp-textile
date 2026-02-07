import React from "react";
import { OTPForm } from "./otp-form";

type Props = {};

const ResetPassword = (props: Props) => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OTPForm />
      </div>
    </div>
  );
};

export default ResetPassword;
