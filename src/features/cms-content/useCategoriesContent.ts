"use client";

import {
  categoriesContentDataSchema,
  type CategoriesContent,
} from "./categories-content-types";
import { useSingleContent } from "./useSingleContent";

export interface UseCategoriesContentArgs {
  locale?: string;
  enabled?: boolean;
}

export function useCategoriesContent(args: UseCategoriesContentArgs = {}) {
  const { locale, enabled = true } = args;

  const result = useSingleContent<CategoriesContent>({
    contentType: "categories",
    locale,
    enabled,
    schema: categoriesContentDataSchema,
  });

  return {
    entry: result.content,
    loading: result.loading,
    error: result.error,
    notFound: result.notFound,
    reload: result.reload,
  };
}
