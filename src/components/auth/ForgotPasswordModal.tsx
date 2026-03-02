"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  useForgotPasswordMutation,
  useVerifyResetOTPMutation,
  useResetPasswordMutation,
} from "@/store/services/authApi";
import { notify } from "@/lib/notifications";
import { Loader2, KeyRound, Mail, ShieldCheck, Lock } from "lucide-react";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Stage = "EMAIL" | "OTP" | "RESET";

export default function ForgotPasswordModal({
  open,
  onOpenChange,
}: ForgotPasswordModalProps) {
  const [stage, setStage] = useState<Stage>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [forgotPassword, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [verifyOTP, { isLoading: isVerifyLoading }] =
    useVerifyResetOTPMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      notify.success("Verification code sent to your email");
      setStage("OTP");
    } catch (err: any) {
      notify.error(
        err?.data?.message ||
          err?.data?.error?.message ||
          "Failed to send verification code. Please try again.",
      );
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP({ email, code: otp }).unwrap();
      notify.success("Verification successful");
      setStage("RESET");
    } catch (err: any) {
      notify.error(
        err?.data?.message ||
          err?.data?.error?.message ||
          "Invalid or expired verification code.",
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      notify.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      notify.error("Password must be at least 6 characters long");
      return;
    }
    try {
      await resetPassword({ email, password, code: otp }).unwrap();
      notify.success(
        "Password reset successful. You can now login with your new password.",
      );
      resetAndClose();
    } catch (err: any) {
      notify.error(
        err?.data?.message ||
          err?.data?.error?.message ||
          "Failed to reset password. Please try again.",
      );
    }
  };

  const resetAndClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStage("EMAIL");
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    }, 300);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetAndClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-[400px] rounded-xl">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-2">
            {stage === "EMAIL" && <Mail className="h-6 w-6 text-black" />}
            {stage === "OTP" && <ShieldCheck className="h-6 w-6 text-black" />}
            {stage === "RESET" && <KeyRound className="h-6 w-6 text-black" />}
          </div>
          <DialogTitle className="text-xl font-bold">
            {stage === "EMAIL" && "Forgot Password"}
            {stage === "OTP" && "Verify OTP"}
            {stage === "RESET" && "Set New Password"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {stage === "EMAIL" &&
              "Enter your email address and we'll send you a code to reset your password."}
            {stage === "OTP" &&
              `We've sent a 6-digit verification code to ${email}`}
            {stage === "RESET" &&
              "Create a new strong password for your account."}
          </DialogDescription>
        </DialogHeader>

        {stage === "EMAIL" && (
          <form onSubmit={handleSendOTP} className="space-y-4 pt-2">
            <FieldGroup>
              <Field>
                <FieldLabel>Account Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />
              </Field>
              <Button
                type="submit"
                className="w-full h-11 bg-black text-white hover:bg-black/90 rounded-lg font-bold"
                disabled={isForgotLoading}
              >
                {isForgotLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </FieldGroup>
          </form>
        )}

        {stage === "OTP" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 pt-2">
            <FieldGroup>
              <Field>
                <FieldLabel>Verification Code</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-11 text-center tracking-widest text-lg font-bold"
                  maxLength={6}
                  required
                />
              </Field>
              <Button
                type="submit"
                className="w-full h-11 bg-black text-white hover:bg-black/90 rounded-lg font-bold"
                disabled={isVerifyLoading}
              >
                {isVerifyLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-black transition-colors"
                onClick={() => setStage("EMAIL")}
              >
                Back to email entry
              </button>
            </FieldGroup>
          </form>
        )}

        {stage === "RESET" && (
          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <FieldGroup>
              <Field>
                <FieldLabel>New Password</FieldLabel>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </Field>
              <Field>
                <FieldLabel>Confirm New Password</FieldLabel>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 pl-10"
                    required
                  />
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </Field>
              <Button
                type="submit"
                className="w-full h-11 bg-black text-white hover:bg-black/90 rounded-lg font-bold"
                disabled={isResetLoading}
              >
                {isResetLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Set New Password"
                )}
              </Button>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
