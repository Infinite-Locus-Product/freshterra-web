"use client";

import {
  forwardRef,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils/cn";

import { Button } from "@/components/ui/Button";

import {
  careerApplicationSchema,
  clampPhoneCursor,
  PHONE_PREFIX,
  sanitizeIndiaPhone,
  type CareerApplicationValues,
} from "./career-application-schema";

type CareerApplicationFormProps = Readonly<{
  jobTitle: string;
  /** Called after a successful (client-validated) submission. */
  onSubmitted?: () => void;
}>;

export function CareerApplicationForm({
  jobTitle,
  onSubmitted,
}: CareerApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CareerApplicationValues>({
    resolver: zodResolver(careerApplicationSchema),
    // resume is intentionally absent until the user attaches a file; the schema
    // surfaces the "attach your resume" error when it is still missing.
    defaultValues: {
      name: "",
      email: "",
      phone: PHONE_PREFIX,
    } as unknown as CareerApplicationValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const phoneRegister = register("phone");
  const resume = watch("resume");

  const onSubmit = (_values: CareerApplicationValues) => {
    // Phase 1: validate client-side only; wire to BFF/ATS when available.
    setSubmitted(true);
    onSubmitted?.();
  };

  if (submitted) {
    return (
      <p
        className="text-brand-500 font-sans text-[18px] leading-[1.4] font-medium"
        role="status"
      >
        Thank you — your application for {jobTitle} has been received. Our team
        will be in touch shortly.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      aria-label={`Application form for ${jobTitle}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <LabeledInput
        label="Name*"
        autoComplete="name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />

      <LabeledInput
        label="Email Address (optional)"
        type="email"
        autoComplete="email"
        placeholder="your.email@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <LabeledInput
        label="Phone Number*"
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

      <ResumeUpload
        file={resume instanceof File ? resume : null}
        error={errors.resume?.message}
        onSelect={(file) =>
          setValue("resume", file as CareerApplicationValues["resume"], {
            shouldValidate: true,
          })
        }
      />

      <Button
        type="submit"
        fullWidth
        caps={false}
        disabled={isSubmitting}
        className="mt-2 h-[56px] shrink-0 text-[18px] font-semibold tracking-[0]"
      >
        Submit Application
      </Button>
    </form>
  );
}

const formLabelClass =
  "text-text-tertiary font-sans text-[14px] font-normal leading-[1.2] tracking-[0.2px]";
const formControlClass = cn(
  "border-gray-200 text-text-primary h-12 w-full rounded-xxl border-[1.5px] bg-white px-3 text-[16px] leading-[1.3] lg:text-[18px]",
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
    <p id={id} role="alert" className="px-2 text-xs leading-tight text-red-600">
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

type ResumeUploadProps = Readonly<{
  file: File | null;
  error?: string;
  onSelect: (file: File | null) => void;
}>;

function ResumeUpload({ file, error, onSelect }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = "resume-error";

  return (
    <div className="shrink-0 space-y-1.5">
      <label htmlFor="resume" className={formLabelClass}>
        Resume/CV*
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "flex h-[111px] w-full flex-col items-center justify-center gap-1 rounded-[10px] border-2 border-dashed bg-gray-50 p-[34px] text-center transition-colors",
          "hover:border-brand-500 focus-visible:border-brand-500 focus-visible:ring-brand-500 focus-visible:ring-1 focus-visible:outline-none",
          error ? "border-red-600" : "border-gray-300",
        )}
      >
        {file ? (
          <>
            <span className="text-text-primary text-[16px] font-medium">
              {file.name}
            </span>
            <span className="text-text-tertiary text-sm">
              Click to choose a different file
            </span>
          </>
        ) : (
          <>
            <span className="text-text-primary text-[16px]">
              Click to upload resume
            </span>
            <span className="text-text-tertiary text-sm">
              PDF, DOC, DOCX (Max 5MB)
            </span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        id="resume"
        name="resume"
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        aria-invalid={error ? true : undefined}
        onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
      />
      {error ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}
