"use client";

import { useState } from "react";
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
} from "aws-amplify/auth";

export default function CustomAuth({
  onAuthSuccess,
}: {
  onAuthSuccess: () => void;
}) {
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "SIGN_UP" | "CONFIRM">(
    "SIGN_IN",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      setAuthMode("CONFIRM");
      setSuccessMsg("Check your email for the verification code.");
    } catch (err: any) {
      setError(err.message || "Error signing up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      // After confirming, switch back to login so they can authenticate
      setAuthMode("SIGN_IN");
      setSuccessMsg("Account verified! You can now sign in.");
      setCode(""); // clear the code
    } catch (err: any) {
      setError(err.message || "Error confirming code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccessMsg("");
    try {
      await resendSignUpCode({ username: email });
      setSuccessMsg("A new verification code has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        onAuthSuccess(); // Tell the parent component we are logged in!
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        // CATCH: User tried to log in but never verified their email
        setAuthMode("CONFIRM");
        setError("Your account is not verified yet. Please enter your code.");
      }
    } catch (err: any) {
      // Fallback catch for older Amplify versions or specific Cognito configurations
      if (err.name === "UserNotConfirmedException") {
        setAuthMode("CONFIRM");
        setError("Your account is not verified yet. Please enter your code.");
      } else {
        setError(err.message || "Error signing in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="mb-6 text-2xl font-bold text-center text-black dark:text-white">
          {authMode === "SIGN_IN" && "Sign In to Global Vaccinator"}
          {authMode === "SIGN_UP" && "Create an Account"}
          {authMode === "CONFIRM" && "Verify Your Email"}
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-800">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={
            authMode === "SIGN_IN"
              ? handleSignIn
              : authMode === "SIGN_UP"
                ? handleSignUp
                : handleConfirm
          }
          className="flex flex-col gap-4"
        >
          {/* Email & Password are required for Sign In and Sign Up */}
          {(authMode === "SIGN_IN" || authMode === "SIGN_UP") && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            </>
          )}

          {/* Verification Code input for the Confirm step */}
          {authMode === "CONFIRM" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Verification Code
              </label>
              <p className="text-xs text-zinc-500 mb-2">
                Check the email ({email}) you registered with.
              </p>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />

              <button
                type="button"
                onClick={handleResendCode}
                className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Didn't get a code? Resend it.
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isLoading
              ? "Processing..."
              : authMode === "SIGN_IN"
                ? "Sign In"
                : authMode === "SIGN_UP"
                  ? "Sign Up"
                  : "Confirm"}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        {authMode !== "CONFIRM" && (
          <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {authMode === "SIGN_IN"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "SIGN_IN" ? "SIGN_UP" : "SIGN_IN");
                setError("");
                setSuccessMsg("");
              }}
              className="font-bold text-black hover:underline dark:text-white"
            >
              {authMode === "SIGN_IN" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
