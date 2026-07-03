import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitContactUsForm } from "@/features/contact/contact-form-service";

import { ContactForm } from "./ContactForm";

vi.mock("@/features/contact/contact-form-service", () => ({
  submitContactUsForm: vi.fn(),
}));

const mockSubmitContactUsForm = vi.mocked(submitContactUsForm);

const defaultProps = {
  fields: {
    inquiryType: "Inquiry type*",
    name: "Name*",
    email: "Email Address*",
    phone: "Phone Number*",
    message: "Message (Minimum 10 words)",
  },
  inquiryOptions: ["General Query", "Support"] as const,
  ctaLabel: "Submit Application",
};

const validMessage = Array.from({ length: 10 }, (_, i) => `word${i + 1}`).join(
  " ",
);

describe("ContactForm", () => {
  beforeEach(() => {
    mockSubmitContactUsForm.mockReset();
    mockSubmitContactUsForm.mockResolvedValue(undefined);
  });

  it("shows validation errors for invalid name, email, and phone on submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);

    await user.selectOptions(screen.getByLabelText(/inquiry type/i), "General Query");
    await user.type(screen.getByLabelText(/^name/i), "A");
    await user.type(screen.getByLabelText(/email address/i), "bad-email");
    await user.clear(screen.getByLabelText(/phone number/i));
    await user.type(screen.getByLabelText(/phone number/i), "123");

    await user.click(screen.getByRole("button", { name: /submit application/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid 10-digit phone number/i)).toBeInTheDocument();
  });

  it("shows success message after a valid submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);

    await user.selectOptions(screen.getByLabelText(/inquiry type/i), "General Query");
    await user.type(screen.getByLabelText(/^name/i), "Rahul Sharma");
    await user.type(screen.getByLabelText(/email address/i), "rahul.sharma@email.com");
    await user.clear(screen.getByLabelText(/phone number/i));
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.type(screen.getByLabelText(/message/i), validMessage);

    await user.click(screen.getByRole("button", { name: /submit application/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/received your message/i);
    });
    expect(mockSubmitContactUsForm).toHaveBeenCalledWith({
      inquiryType: "General Query",
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 9876543210",
      message: validMessage,
    });
  });

  it("shows validation error when email is left empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);

    await user.selectOptions(screen.getByLabelText(/inquiry type/i), "General Query");
    await user.type(screen.getByLabelText(/^name/i), "Rahul Sharma");
    await user.clear(screen.getByLabelText(/phone number/i));
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.type(screen.getByLabelText(/message/i), validMessage);

    await user.click(screen.getByRole("button", { name: /submit application/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    expect(mockSubmitContactUsForm).not.toHaveBeenCalled();
  });
});
