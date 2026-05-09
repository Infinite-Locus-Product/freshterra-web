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

const PHONE_PREFIX = "+91 ";
const MAX_LOCAL_DIGITS = 10;
const PHONE_REGEX = /^\+91\s\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizePhone(raw: string): string {
  if (raw.startsWith(PHONE_PREFIX)) {
    const local = raw.slice(PHONE_PREFIX.length).replaceAll(/\D/g, "");
    return PHONE_PREFIX + local.slice(0, MAX_LOCAL_DIGITS);
  }
  const digits = raw.replaceAll(/\D/g, "");
  const local =
    digits.length > MAX_LOCAL_DIGITS && digits.startsWith("91")
      ? digits.slice(2)
      : digits;
  return PHONE_PREFIX + local.slice(0, MAX_LOCAL_DIGITS);
}

function clampPhoneCursor(input: HTMLInputElement): void {
  const min = PHONE_PREFIX.length;
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;
  const newStart = Math.max(start, min);
  const newEnd = Math.max(end, min);
  if (newStart !== start || newEnd !== end) {
    input.setSelectionRange(newStart, newEnd);
  }
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .refine((v) => EMAIL_REGEX.test(v.trim()), {
      message: "Enter a valid email address.",
    }),
  phone: z
    .string()
    .min(1, { message: "Phone is required." })
    .refine((v) => PHONE_REGEX.test(v.trim()), {
      message: "Enter a valid phone number.",
    }),
  consent: z.boolean().optional(),
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", phone: "", consent: false, _hp: "" },
    mode: "onSubmit",
  });


  const phoneValue = watch("phone") ?? "";
  const emailValue = watch("email") ?? "";
  const phoneLocalDigitCount = phoneValue.startsWith(PHONE_PREFIX)
    ? phoneValue.slice(PHONE_PREFIX.length).replaceAll(/\D/g, "").length
    : phoneValue.replaceAll(/\D/g, "").length;
  const isFormValid =
    phoneLocalDigitCount === MAX_LOCAL_DIGITS && emailValue.trim().length > 0;

  // Pre-bind register so we can chain a sanitizing onChange on the phone
  // input without losing the ref / name / onBlur that RHF needs.
  const phoneRegister = register("phone");

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    if (values._hp && values._hp.length > 0) return;

    const accessKey = env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setServerError(notify.errorBody);
      return;
    }

    const phone = values.phone.trim();
    const email = values.email.trim();

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
          email,
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
        inputMode="numeric"
        autoComplete="tel"
        // "+91 " (4 chars) + 10 digits = 14
        maxLength={PHONE_PREFIX.length + MAX_LOCAL_DIGITS}
        placeholder={notify.fields.phone.placeholder}
        error={errors.phone?.message}
        labelBgClass={surfaceClass}
        {...phoneRegister}
        onChange={(e) => {
          // Force "+91 " prefix and digits-only / 10-digit cap on every
          // keystroke or paste. Mutating e.target.value before forwarding
          // keeps the DOM (uncontrolled input) and RHF state in sync.
          const sanitized = sanitizePhone(e.target.value);
          if (e.target.value !== sanitized) {
            e.target.value = sanitized;
          }
          phoneRegister.onChange(e);
        }}
        onKeyDown={(e) => {
          const input = e.currentTarget;
          const start = input.selectionStart ?? 0;
          const end = input.selectionEnd ?? 0;

          if (!e.shiftKey) {
            const homeIntoPrefix = e.key === "Home";
            const leftIntoPrefix =
              e.key === "ArrowLeft" && start <= PHONE_PREFIX.length;
            if (homeIntoPrefix || leftIntoPrefix) {
              e.preventDefault();
              input.setSelectionRange(PHONE_PREFIX.length, PHONE_PREFIX.length);
              return;
            }
          }

          if (start !== end) return;
          const wouldEatPrefix =
            (e.key === "Backspace" && start <= PHONE_PREFIX.length) ||
            (e.key === "Delete" && start < PHONE_PREFIX.length);
          if (wouldEatPrefix) {
            e.preventDefault();
            input.setSelectionRange(PHONE_PREFIX.length, PHONE_PREFIX.length);
          }
        }}
        onClick={(e) => clampPhoneCursor(e.currentTarget)}
        onFocus={(e) => {
          handleFirstFocus("phone");
          const input = e.currentTarget;
          // Pre-fill the +91 prefix on first focus so users only type the
          // 10-digit local number. Only set when the field is empty so we
          // don't double-prefix on subsequent focus.
          if (!getValues("phone")) {
            setValue("phone", PHONE_PREFIX, { shouldValidate: false });
            // RHF mutates input.value synchronously via the registered ref,
            // so the caret can be parked immediately after the prefix.
            input.setSelectionRange(PHONE_PREFIX.length, PHONE_PREFIX.length);
          } else {
            // Field already has the prefix — don't trap the user at the end
            // of an in-progress number, but never let the caret sit inside
            // "+91 ".
            clampPhoneCursor(input);
          }
          // Some browsers (notably mobile Safari) re-set the selection after
          // our focus handler runs, so re-clamp on the next animation frame.
          requestAnimationFrame(() => clampPhoneCursor(input));
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

      {/*
        Figma mWeb consent row: 12px above the "I agree" text and 24px below.
        The form is `flex flex-col gap-4` (16px between every pair of
        siblings), and the next sibling (Button) carries `mt-2` (8px). So
        the visible gaps compose as:
          above = gap-4 (16) + wrapper-mt = 12  =>  wrapper-mt = -4px (-mt-1)
          below = gap-4 (16) + wrapper-mb + button-mt-2 (8) = 24  =>  wrapper-mb = 0
        The negative top margin is intentional and is a well-defined pull
        against the parent `gap` in flexbox. `md:my-0` already cancels both
        sides on desktop, so the desktop layout is unchanged.
      */}
      <div className="-mt-1 flex justify-center md:my-0 md:justify-start">
        {/*
          mWeb: the "I agree" label must be horizontally centered. Centering
          via the parent wrapper alone doesn't work because Checkbox's own
          outer div is `w-full` and absorbs the wrapper's `justify-center`.
          Forwarding `text-center` to that w-full div centers the
          `inline-flex` label inside it (inline-flex aligns like inline-block
          for `text-align`). `md:text-left` reverts to the desktop layout.
        */}
        <Checkbox
          label={notify.fields.consent}
          error={errors.consent?.message}
          className="text-center md:text-left"
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
        disabled={!isFormValid}
        className="disabled:text-text-secondary mt-2 self-center disabled:bg-gray-200 disabled:opacity-100 disabled:hover:bg-gray-200 disabled:active:bg-gray-200 md:w-full"
      >
        {notify.cta}
      </Button>
    </form>
  );
}
