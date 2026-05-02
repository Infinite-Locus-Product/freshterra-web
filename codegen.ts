import type { CodegenConfig } from "@graphql-codegen/cli";

const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;

if (!SALEOR_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_SALEOR_API_URL must be set before running codegen.",
  );
}

const config: CodegenConfig = {
  overwrite: true,
  schema: SALEOR_API_URL,
  documents: [
    "src/features/**/*.graphql",
    "src/lib/clients/saleor/**/*.graphql",
  ],
  generates: {
    "src/types/saleor.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        scalars: {
          Date: "string",
          DateTime: "string",
          JSON: "Record<string, unknown>",
          PositiveDecimal: "number",
          Decimal: "number",
        },
      },
    },
  },
};

export default config;
