"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notify } from "@/lib/notifications";
import {
  useForgotPasswordMutation,
  useVerifyResetOTPMutation,
  useResetPasswordMutation,
} from "@/store/services/authApi";
import { Eye, EyeOff } from "lucide-react";

type Step = "EMAIL" | "OTP" | "RESET";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordModal = ({
  open,
  onOpenChange,
}: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [forgotPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] =
    useVerifyResetOTPMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      notify.success("Password reset code sent to your email");
      setStep("OTP");
    } catch (error: any) {
      notify.error(error?.data?.message || "Failed to send reset code");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP({ email, code: otp }).unwrap();
      notify.success("OTP verified successfully");
      setStep("RESET");
    } catch (error: any) {
      notify.error(error?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ email, newPassword }).unwrap();
      notify.success("Password reset successfully. You can now login.");
      onOpenChange(false);
      resetState();
    } catch (error: any) {
      notify.error(error?.data?.message || "Failed to reset password");
    }
  };

  const resetState = () => {
    setStep("EMAIL");
    setEmail("");
    setOtp("");
    setNewPassword("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) resetState();
      }}
    >
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {step === "EMAIL" && "Forgot Password"}
            {step === "OTP" && "Verify OTP"}
            {step === "RESET" && "Reset Password"}
          </DialogTitle>
          <DialogDescription>
            {step === "EMAIL" &&
              "Enter your email to receive a password reset code."}
            {step === "OTP" && `We've sent a 6-digit code to ${email}.`}
            {step === "RESET" && "Enter your new password below."}
          </DialogDescription>
        </DialogHeader>

        {step === "EMAIL" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 pt-4">
            <Input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSendingEmail}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90"
              isLoading={isSendingEmail}
            >
              Send Reset Code
            </Button>
          </form>
        )}

        {step === "OTP" && (
          <form onSubmit={handleOTPSubmit} className="space-y-4 pt-4">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              disabled={isVerifyingOTP}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90"
              isLoading={isVerifyingOTP}
            >
              Verify OTP
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full text-xs"
              onClick={() => setStep("EMAIL")}
            >
              Change Email
            </Button>
          </form>
        )}

        {step === "RESET" && (
          <form onSubmit={handleResetSubmit} className="space-y-4 pt-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isResettingPassword}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                disabled={isResettingPassword}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90"
              isLoading={isResettingPassword}
            >
              Reset Password
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
