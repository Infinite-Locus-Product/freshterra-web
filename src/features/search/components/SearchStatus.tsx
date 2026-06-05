import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

/** Shared centered scaffold for the SRP's full-page states. */
function CenteredState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-gray-100">
        {icon}
      </div>
      <Heading level={1} variant="h2" align="center">
        {title}
      </Heading>
      <p className="text-text-secondary mt-3 max-w-sm text-sm leading-relaxed">
        {body}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/** Zero-results state — matches the "No Results Found" design. */
export function SearchNoResults({ query }: { query: string }) {
  return (
    <CenteredState
      icon={<AlertIcon />}
      title="No Results Found"
      body={`We couldn’t find any results for “${query}”. Try a different search term.`}
      action={
        <Button asChild caps={false}>
          <Link href="/c/explore-catalog">Browse Categories</Link>
        </Button>
      }
    />
  );
}

/** Transport/upstream failure state with a retry affordance. */
export function SearchError({ onRetry }: { onRetry: () => void }) {
  return (
    <CenteredState
      icon={<AlertIcon />}
      title="Something went wrong"
      body="We couldn’t load search results right now. Please try again in a moment."
      action={
        <Button caps={false} onClick={onRetry}>
          Try Again
        </Button>
      }
    />
  );
}

/** Shown when /search is opened without a query. */
export function SearchPrompt() {
  return (
    <CenteredState
      icon={<SearchIcon />}
      title="Search FreshTerra"
      body="Use the search bar above to find fresh produce, groceries, and more."
    />
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={26}
      height={26}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-500"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={26}
      height={26}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-500"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}
