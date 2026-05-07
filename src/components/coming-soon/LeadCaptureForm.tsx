"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { env } from "@/lib/config/env";
import { comingSoonContent } from "@/lib/MockData";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";

const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Enter a valid email address." }),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v.trim() === "" || PHONE_REGEX.test(v.trim()), {
      message: "Enter a valid phone number.",
    }),
  consent: z.boolean(),
  _hp: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type LeadCaptureFormProps = {
  /** Background color of the surface the inputs sit on (for floating label punch-through). */
  surfaceClass?: string;
  className?: string;
  /** Where to navigate after a successful submission. Defaults to /notify/success. */
  successHref?: string;
};

export function LeadCaptureForm({
  surfaceClass = "bg-gray-6",
  className,
  successHref = "/notify/success",
}: LeadCaptureFormProps) {
  const { notify } = comingSoonContent;
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", phone: "", consent: false, _hp: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    if (values._hp && values._hp.length > 0) return;

    const accessKey = env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setServerError(notify.errorBody);
      return;
    }

    const phone = values.phone?.trim() ?? "";
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      env.NEXT_PUBLIC_WEB3FORMS_TIMEOUT_MS,
    );

    try {
      const res = await fetch(env.NEXT_PUBLIC_WEB3FORMS_SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "FreshTerra — New launch notification signup",
          from_name: "FreshTerra Coming Soon",
          email: values.email,
          phone: phone || "(not provided)",
          consent: values.consent
            ? "Yes — agreed to receive marketing emails"
            : "No — did not opt in",
          source: typeof window !== "undefined" ? window.location.href : "",
        }),
        signal: controller.signal,
      });

      const result = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!res.ok || !result?.success) {
        setServerError(result?.message?.trim() || notify.errorBody);
        return;
      }

      router.push(successHref);
    } catch {
      setServerError(notify.errorBody);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}
    >
      <Input
        label={notify.fields.phone.label}
        type="tel"
        autoComplete="tel"
        placeholder={notify.fields.phone.placeholder}
        error={errors.phone?.message}
        labelBgClass={surfaceClass}
        {...register("phone")}
      />
      <Input
        label={notify.fields.email.label}
        type="email"
        autoComplete="email"
        placeholder={notify.fields.email.placeholder}
        error={errors.email?.message}
        labelBgClass={surfaceClass}
        {...register("email")}
      />

      {/* Honeypot — bots fill this, humans don't see it */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("_hp")}
      />

      <Checkbox
        label={notify.fields.consent}
        error={errors.consent?.message}
        {...register("consent")}
      />

      {serverError ? (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="mt-2 self-center md:w-full"
      >
        {notify.cta}
      </Button>
    </form>
  );
}
