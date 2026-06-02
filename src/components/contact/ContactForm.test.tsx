import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ContactForm } from "./ContactForm";

const defaultProps = {
  fields: {
    inquiryType: "Inquiry type*",
    name: "Name*",
    email: "Email Address (optional)",
    phone: "Phone Number*",
    message: "Message (Minimum 20 words)",
  },
  inquiryOptions: ["General Query", "Support"] as const,
  ctaLabel: "Submit Application",
};

describe("ContactForm", () => {
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

    await user.click(screen.getByRole("button", { name: /submit application/i }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/received your message/i);
    });
  });
});
