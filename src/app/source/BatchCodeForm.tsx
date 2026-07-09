"use client";

import { useRef, useState } from "react";

import {
  FreshTerraApiError,
  type ApiErrorCode,
} from "@/lib/clients/freshterra-api";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { ProductSourceError } from "@/features/product-source/components/ProductSourceError";
import { ProductSourceResult } from "@/features/product-source/components/ProductSourceResult";
import {
  fetchProductSource,
  type ProductSource,
} from "@/features/product-source/product-source-service";

const BATCH_CODE_MIN = 2;
const BATCH_CODE_MAX = 20;

/**
 * Batch codes are 2–20 chars, alphanumeric plus hyphens (real codes look like
 * "SFM-500"). Strip anything else and cap length.
 */
function sanitizeBatchCode(raw: string): string {
  return raw.replaceAll(/[^A-Za-z0-9-]/g, "").slice(0, BATCH_CODE_MAX);
}

type ErrorContent = { title: string; description: string };

function errorContent(code: ApiErrorCode): ErrorContent {
  switch (code) {
    case "NOT_FOUND":
      return {
        title: "Product not found",
        description:
          "We couldn't find a product for that batch code. Please check the code on your pack and try again.",
      };
    case "NETWORK_ERROR":
      return {
        title: "Something went wrong!",
        description: "Check your connection and try again",
      };
    default:
      return { title: "Something went wrong!", description: "Please try again" };
  }
}

/**
 * "Know Your Product" batch-code lookup form.
 *
 * Users scan the QR on the pack (which deep-links here) or type the batch
 * code manually. On submit we fetch the product's traceability details from
 * the backend and render them inline below the form.
 */
export function BatchCodeForm() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [result, setResult] = useState<ProductSource | null>(null);
  const [error, setError] = useState<ErrorContent | null>(null);

  // Cancel an in-flight lookup if the user submits a new one.
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = code.trim();
  const isValid =
    trimmed.length >= BATCH_CODE_MIN && trimmed.length <= BATCH_CODE_MAX;
  const isLoading = status === "loading";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const source = await fetchProductSource(trimmed, {
        signal: controller.signal,
      });
      setResult(source);
    } catch (err) {
      if (err instanceof FreshTerraApiError && err.code === "ABORTED") return;
      const code =
        err instanceof FreshTerraApiError ? err.code : ("UNKNOWN" as const);
      setError(errorContent(code));
    } finally {
      if (abortRef.current === controller) {
        setStatus("idle");
        abortRef.current = null;
      }
    }
  };

  const handleClear = () => {
    setCode("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="border-gray-divider bg-beige-100/60 rounded-2xl border p-6 shadow-sm md:p-7">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col items-stretch gap-4 md:flex-row md:items-start"
        >
          <Input
            label="Batch Code"
            placeholder="Enter batch code from your pack"
            autoComplete="off"
            autoCapitalize="characters"
            inputMode="text"
            maxLength={BATCH_CODE_MAX}
            value={code}
            onChange={(e) => setCode(sanitizeBatchCode(e.target.value))}
            onClear={handleClear}
            labelBgClass="bg-beige-100"
            className="md:flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            caps={false}
            loading={isLoading}
            disabled={!isValid}
            className="disabled:text-text-secondary shrink-0 disabled:bg-gray-200 disabled:opacity-100 disabled:hover:bg-gray-200 disabled:active:bg-gray-200"
          >
            View Details
          </Button>
        </form>
      </div>

      {error ? (
        <ProductSourceError title={error.title} description={error.description} />
      ) : result ? (
        <ProductSourceResult source={result} />
      ) : null}
    </div>
  );
}
