import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LeadCaptureForm } from "./LeadCaptureForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("LeadCaptureForm", () => {
  beforeEach(() => {
    pushMock.mockReset();
    globalThis.fetch = vi.fn(
      async () => new Response('{"ok":true}', { status: 200 }),
    ) as unknown as typeof fetch;
  });

  it("renders email + phone fields, consent checkbox, and submit button", () => {
    render(<LeadCaptureForm />);
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /marketing emails/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get notified/i }),
    ).toBeInTheDocument();
  });

  it("shows a validation error when submitting an empty form", async () => {
    render(<LeadCaptureForm />);
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
  });

  it("shows an email validation error for an invalid email", async () => {
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "not-an-email");
    await userEvent.click(
      screen.getByRole("checkbox", { name: /marketing emails/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.some((a) => /valid email/i.test(a.textContent ?? ""))).toBe(
      true,
    );
  });

  it("blocks submit when consent is not checked, even with valid email", async () => {
    const fetchSpy = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("submits to /api/leads and navigates to /notify/success on a 2xx", async () => {
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.click(
      screen.getByRole("checkbox", { name: /marketing emails/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/notify/success"),
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/leads",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("respects the successHref override", async () => {
    render(<LeadCaptureForm successHref="/custom-success" />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.click(
      screen.getByRole("checkbox", { name: /marketing emails/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/custom-success"),
    );
  });

  it("does NOT navigate when the server responds with non-2xx; shows error message", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response('{"ok":false}', { status: 502 }),
    ) as unknown as typeof fetch;
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.click(
      screen.getByRole("checkbox", { name: /marketing emails/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("alert")
          .some((a) => /something went wrong/i.test(a.textContent ?? "")),
      ).toBe(true),
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("includes a honeypot input that is hidden from assistive tech", () => {
    render(<LeadCaptureForm />);
    const hp = document.querySelector('input[name="_hp"]');
    expect(hp).toBeInTheDocument();
    expect(hp).toHaveAttribute("aria-hidden", "true");
    expect(hp).toHaveAttribute("tabindex", "-1");
  });
});
