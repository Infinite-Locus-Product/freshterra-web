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

  it("keeps submit disabled on an empty form (no validation alerts until submit is possible)", () => {
    render(<LeadCaptureForm />);
    const submit = screen.getByRole("button", { name: /get notified/i });
    expect(submit).toBeDisabled();
    expect(submit.className).toContain("disabled:bg-gray-200");
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("locks the consent row to Figma's mWeb spacing (12px above, 24px below) and reverts on desktop", () => {
    render(<LeadCaptureForm />);
    const checkbox = screen.getByRole("checkbox", {
      name: /marketing emails/i,
    });
    const wrapper = checkbox.closest("div.flex");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("-mt-1");
    expect(wrapper?.className).not.toContain("my-2");
    expect(wrapper?.className).not.toContain("mb-2");
    // Desktop reverts to my-0 so the desktop layout is preserved.
    expect(wrapper?.className).toContain("md:my-0");
  });

  it("centers the 'I agree' label on mWeb and left-aligns it on desktop", () => {
    render(<LeadCaptureForm />);
    const checkbox = screen.getByRole("checkbox", {
      name: /marketing emails/i,
    });
    // Checkbox's own outer wrapper is the closest `div.w-full`. Forwarding
    // `text-center` onto that div centers the inline-flex label inside it.
    const checkboxOuter = checkbox.closest("div.w-full");
    expect(checkboxOuter).not.toBeNull();
    expect(checkboxOuter?.className).toContain("text-center");
    expect(checkboxOuter?.className).toContain("md:text-left");
  });

  it("shows an email validation error for an invalid email when phone is valid", async () => {
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
    await userEvent.type(screen.getByLabelText(/^email$/i), "not-an-email");
    await userEvent.click(
      screen.getByRole("button", { name: /get notified/i }),
    );
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.some((a) => /valid email/i.test(a.textContent ?? ""))).toBe(
      true,
    );
  });

  it("disables the submit button until phone has 10 digits AND email is filled (consent stays optional)", async () => {
    render(<LeadCaptureForm />);
    const submit = screen.getByRole("button", { name: /get notified/i });

    expect(submit).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/^phone$/i), "987654321");
    expect(submit).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/^phone$/i), "0");
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    expect(submit).toBeEnabled();

    await userEvent.click(
      screen.getByRole("checkbox", { name: /marketing emails/i }),
    );
    expect(submit).toBeEnabled();
  });

  it("keeps the submit button disabled when only email is filled (phone still required)", async () => {
    render(<LeadCaptureForm />);
    const submit = screen.getByRole("button", { name: /get notified/i });

    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    expect(submit).toBeDisabled();
  });

  it("strips non-digits from the phone input and locks the +91 prefix", async () => {
    render(<LeadCaptureForm />);
    const phone = screen.getByLabelText(/^phone$/i) as HTMLInputElement;

    // Letters/symbols are stripped; only digits remain after the prefix.
    await userEvent.type(phone, "abc987-654 3210!!");
    expect(phone.value).toBe("+91 9876543210");
  });

  it("caps the phone input at 10 local digits (extra digits ignored)", async () => {
    render(<LeadCaptureForm />);
    const phone = screen.getByLabelText(/^phone$/i) as HTMLInputElement;

    await userEvent.type(phone, "98765432109999");
    expect(phone.value).toBe("+91 9876543210");
  });

  it("parks the caret after '+91 ' on first focus and blocks navigation back into the prefix", async () => {
    render(<LeadCaptureForm />);
    const phone = screen.getByLabelText(/^phone$/i) as HTMLInputElement;

    // First focus pre-fills the prefix and parks the caret right after it.
    await userEvent.click(phone);
    expect(phone.value).toBe("+91 ");
    expect(phone.selectionStart).toBe(4);
    expect(phone.selectionEnd).toBe(4);

    // Type some digits — caret advances normally.
    await userEvent.type(phone, "98");
    expect(phone.value).toBe("+91 98");
    expect(phone.selectionStart).toBe(6);

    // ArrowLeft into the prefix is blocked — caret stops at boundary.
    phone.setSelectionRange(5, 5);
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}");
    expect(phone.selectionStart).toBe(4);

    // Home jumps to the boundary, not to position 0.
    phone.setSelectionRange(6, 6);
    await userEvent.keyboard("{Home}");
    expect(phone.selectionStart).toBe(4);

    // Clicking inside the prefix region (caret at position 1) is rebounded
    // to the boundary by the onClick clamp.
    phone.setSelectionRange(1, 1);
    phone.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(phone.selectionStart).toBe(4);
  });

  it("submits to Web3Forms and navigates to /notify/success on success", async () => {
    render(<LeadCaptureForm />);
    await userEvent.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
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

    it("pushes form_submit with marketing_consent false when consent is unchecked", async () => {
      render(<LeadCaptureForm />);
      await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
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
      expect(submitEvent).toMatchObject({
        event: "form_submit",
        form_name: "notify_me_form",
        phone_filled: true,
        email_filled: true,
        marketing_consent: false,
      });
    });

    it("does NOT push form_submit when submit is blocked (phone incomplete)", async () => {
      render(<LeadCaptureForm />);
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

    it("does NOT push form_submit when submit is blocked (email empty)", async () => {
      render(<LeadCaptureForm />);
      await userEvent.type(screen.getByLabelText(/^phone$/i), "9876543210");
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
