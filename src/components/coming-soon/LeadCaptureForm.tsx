"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { track } from "@/lib/analytics/tracker";
import { env } from "@/lib/config/env";
import { comingSoonContent } from "@/lib/MockData";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";

const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formSchema = z.object({
  email: z
    .string()
    .optional()
    .refine((v) => !v || v.trim() === "" || EMAIL_REGEX.test(v.trim()), {
      message: "Enter a valid email address.",
    }),
  phone: z
    .string()
    .min(1, { message: "Phone is required." })
    .refine((v) => PHONE_REGEX.test(v.trim()), {
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

  const formRef = useRef<HTMLFormElement>(null);
  const firedOpenRef = useRef(false);
  const firedStartRef = useRef(false);

  // Fire `form_open` the first time the form is at least 50% in view. Cheap
  // proxy for "user actually saw the form" — better than firing on mount,
  // which would over-count on tall layouts that scroll.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const target = formRef.current;
    if (!target || firedOpenRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !firedOpenRef.current) {
          firedOpenRef.current = true;
          track({ name: "form_open", form_name: "notify_me_form" });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleFirstFocus = (fieldName: "phone" | "email") => {
    if (firedStartRef.current) return;
    firedStartRef.current = true;
    track({
      name: "form_start",
      form_name: "notify_me_form",
      first_field_name: fieldName,
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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

    const phone = values.phone.trim();
    const email = values.email?.trim() ?? "";

    // Fire `form_submit` once validation passes — covers both success and
    // server-error outcomes per the analytics spec ("total submission
    // attempts — success + error combined").
    track({
      name: "form_submit",
      form_name: "notify_me_form",
      phone_filled: phone.length > 0,
      email_filled: email.length > 0,
      marketing_consent: !!values.consent,
    });

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
          email: email || "(not provided)",
          phone,
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
      ref={formRef}
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
        onFocus={() => {
          handleFirstFocus("phone");
          // Pre-fill the +91 prefix on first focus so users only type the
          // 10-digit local number. Only set when the field is empty so we
          // don't double-prefix on subsequent focus.
          if (!getValues("phone")) {
            setValue("phone", "+91 ", { shouldValidate: false });
          }
        }}
      />
      <Input
        label={notify.fields.email.label}
        type="email"
        autoComplete="email"
        placeholder={notify.fields.email.placeholder}
        error={errors.email?.message}
        labelBgClass={surfaceClass}
        {...register("email")}
        onFocus={() => handleFirstFocus("email")}
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

      <div className="my-2 flex justify-center md:my-0 md:justify-start">
        <Checkbox
          label={notify.fields.consent}
          error={errors.consent?.message}
          {...register("consent")}
        />
      </div>

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
