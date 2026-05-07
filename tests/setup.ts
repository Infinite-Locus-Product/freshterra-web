import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??= "test-web3forms-key";

afterEach(() => {
  cleanup();
});
