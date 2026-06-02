"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils/cn";

import { Button } from "@/components/ui/Button";

import {
  clampPhoneCursor,
  contactFormSchema,
  PHONE_PREFIX,
  sanitizeIndiaPhone,
  type ContactFormValues,
} from "./contact-form-schema";

type ContactFormProps = Readonly<{
  fields: {
    inquiryType: string;
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  inquiryOptions: readonly string[];
  ctaLabel: string;
}>;

export function ContactForm({ fields, inquiryOptions, ctaLabel }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType: "",
      name: "",
      email: "",
      phone: PHONE_PREFIX,
      message: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const phoneRegister = register("phone");

  const onSubmit = (_values: ContactFormValues) => {
    // Phase 1: validate client-side only; wire to BFF/CRM when available.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p
        className="text-brand-500 font-sans text-[18px] leading-[1.4] font-medium"
        role="status"
      >
        Thank you — we&apos;ve received your message and will get back to you shortly.
      </p>
    );
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-[18px]"
      aria-label="Contact form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <LabeledSelect
        label={fields.inquiryType}
        options={inquiryOptions}
        error={errors.inquiryType?.message}
        {...register("inquiryType")}
      />

      <LabeledInput
        label={fields.name}
        autoComplete="name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />

      <LabeledInput
        label={fields.email}
        type="email"
        autoComplete="email"
        placeholder="your.email@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <LabeledInput
        label={fields.phone}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+91 87937873393"
        error={errors.phone?.message}
        value={watch("phone") ?? PHONE_PREFIX}
        onFocus={(event) => {
          if (!event.currentTarget.value.startsWith(PHONE_PREFIX)) {
            setValue("phone", PHONE_PREFIX, { shouldValidate: true });
          }
          clampPhoneCursor(event.currentTarget);
        }}
        onChange={(event) => {
          const sanitized = sanitizeIndiaPhone(event.target.value);
          setValue("phone", sanitized, { shouldValidate: true });
          clampPhoneCursor(event.currentTarget);
        }}
        onBlur={phoneRegister.onBlur}
        name={phoneRegister.name}
        ref={phoneRegister.ref}
      />

      <LabeledTextarea
        label={fields.message}
        rows={4}
        placeholder="Tell us more..."
        error={errors.message?.message}
        className="min-h-[96px] flex-1 resize-none lg:max-h-[120px]"
        {...register("message")}
      />

      <Button
        type="submit"
        fullWidth
        caps={false}
        disabled={isSubmitting}
        className="mt-auto h-[56px] shrink-0 text-[18px] font-semibold tracking-[0] lg:h-[64px]"
      >
        {ctaLabel}
      </Button>
    </form>
  );
}

const formLabelClass = "text-text-tertiary font-sans text-[16px] leading-[1.3]";
const formControlClass = cn(
  "border-gray-200 text-text-primary h-[52px] w-full rounded-full border bg-white px-5 text-[16px] leading-[1.3] lg:text-[18px]",
  "placeholder:text-text-tertiary",
  "focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none",
);

function controlErrorClass(hasError: boolean | undefined): string | undefined {
  return hasError
    ? "border-red-600 focus:border-red-600 focus:ring-red-600"
    : undefined;
}

function FieldError({ id, message }: Readonly<{ id: string; message: string }>) {
  return (
    <p id={id} role="alert" className="truncate px-2 text-xs leading-tight text-red-600">
      {message}
    </p>
  );
}

const LabeledInput = forwardRef<
  HTMLInputElement,
  Readonly<
    {
      label: string;
      error?: string;
      className?: string;
    } & InputHTMLAttributes<HTMLInputElement>
  >
>(function LabeledInput({ label, error, className, id, name, ...rest }, ref) {
  const fieldId = id ?? name ?? "field";
  const errorId = `${fieldId}-error`;

  return (
    <div className="shrink-0 space-y-1.5">
      <label htmlFor={fieldId} className={formLabelClass}>
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(formControlClass, controlErrorClass(!!error), className)}
        {...rest}
      />
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
});

function LabeledSelect({
  label,
  options,
  error,
  name,
  id,
  ...rest
}: Readonly<
  {
    label: string;
    options: readonly string[];
    error?: string;
  } & SelectHTMLAttributes<HTMLSelectElement>
>) {
  const fieldId = id ?? name ?? "inquiryType";
  const errorId = `${fieldId}-error`;

  return (
    <div className="shrink-0 space-y-1.5">
      <label htmlFor={fieldId} className={formLabelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            formControlClass,
            "appearance-none pr-12",
            controlErrorClass(!!error),
          )}
          {...rest}
        >
          <option value="" disabled>
            Select…
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="text-text-tertiary pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-base"
        >
          ▾
        </span>
      </div>
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}

function LabeledTextarea({
  label,
  error,
  className,
  id,
  name,
  ...rest
}: Readonly<
  {
    label: string;
    error?: string;
    className?: string;
  } & TextareaHTMLAttributes<HTMLTextAreaElement>
>) {
  const fieldId = id ?? name ?? "message";
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-1.5">
      <label htmlFor={fieldId} className="text-text-primary shrink-0 font-sans text-[18px] leading-[1.3]">
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "border-gray-200 text-text-primary w-full flex-1 rounded-[16px] border bg-white px-5 py-3 text-[16px] leading-[1.4] lg:text-[18px]",
          "placeholder:text-text-tertiary",
          "focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none",
          controlErrorClass(!!error),
          className,
        )}
        {...rest}
      />
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}
