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
      async () => new Response('{"success":true}', { status: 200 }),
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

  it("submits without consent (consent is optional)", async () => {
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/notify/success"),
    );
  });

  it("submits to Web3Forms and navigates to /notify/success on success", async () => {
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
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
      "https://api.web3forms.com/submit",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("respects the successHref override", async () => {
    render(<LeadCaptureForm successHref="/custom-success" />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
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

  it("does NOT navigate when Web3Forms responds with success:false; shows error message", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response('{"success":false}', { status: 200 }),
    ) as unknown as typeof fetch;
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
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

  describe("analytics events", () => {
    beforeEach(() => {
      window.dataLayer = [];
    });

    it("pushes form_start with first_field_name on first focus", async () => {
      render(<LeadCaptureForm />);
      await userEvent.click(screen.getByLabelText(/^phone$/i));
      const startEvent = window.dataLayer?.find(
        (e) => e.event === "form_start",
      );
      expect(startEvent).toMatchObject({
        event: "form_start",
        form_name: "notify_me_form",
        first_field_name: "phone",
      });
    });

    it("only fires form_start once even after multiple focus changes", async () => {
      render(<LeadCaptureForm />);
      await userEvent.click(screen.getByLabelText(/^email$/i));
      await userEvent.click(screen.getByLabelText(/^phone$/i));
      await userEvent.click(screen.getByLabelText(/^email$/i));
      const startEvents = window.dataLayer?.filter(
        (e) => e.event === "form_start",
      );
      expect(startEvents).toHaveLength(1);
      expect(startEvents?.[0]).toMatchObject({ first_field_name: "email" });
    });

    it("pushes form_submit with phone_filled / email_filled / marketing_consent", async () => {
      render(<LeadCaptureForm />);
      await userEvent.type(
        screen.getByLabelText(/^email$/i),
        "user@example.com",
      );
      await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
      await userEvent.click(
        screen.getByRole("checkbox", { name: /marketing emails/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /get notified/i }),
      );
      const submitEvent = window.dataLayer?.find(
        (e) => e.event === "form_submit",
      );
      expect(submitEvent).toMatchObject({
        event: "form_submit",
        form_name: "notify_me_form",
        phone_filled: true,
        email_filled: true,
        marketing_consent: true,
      });
    });

    it("does NOT push form_submit when client validation fails (empty phone)", async () => {
      render(<LeadCaptureForm />);
      // Email only, phone left empty (phone is required) → validation fails
      await userEvent.type(
        screen.getByLabelText(/^email$/i),
        "user@example.com",
      );
      await userEvent.click(
        screen.getByRole("button", { name: /get notified/i }),
      );
      const submitEvent = window.dataLayer?.find(
        (e) => e.event === "form_submit",
      );
      expect(submitEvent).toBeUndefined();
    });
  });
});
