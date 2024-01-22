"use client";

import { BeatLoader } from "react-spinners";

import { CardWrapper } from "./card-wrapper.component";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification.action";
import { FormError } from "../form-error.component";
import { FormSuccess } from "../form-success.component";

export const NewVerificationForm = () => {
  const [status, setStatus] = useState<{
    status: "success" | "error";
    message: string;
  }>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setStatus({
        status: "error",
        message: "Missing token",
      });
      return;
    }

    try {
      const verification = await newVerification(token);
      setStatus(verification);
    } catch {
      setStatus({
        status: "error",
        message: "Something went wrong",
      });
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit, status]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!status && <BeatLoader />}

        {status?.status === "error" && <FormError message={status.message} />}

        {status?.status === "success" && (
          <FormSuccess message={status.message} />
        )}
      </div>
    </CardWrapper>
  );
};
