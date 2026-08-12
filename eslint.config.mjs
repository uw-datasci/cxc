import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "migrations/**",
    "components/ui/**",
  ]),
  {
    files: [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "contexts/**/*.{ts,tsx}",
      "hooks/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "providers/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/config/db",
              importNames: ["adminSql"],
              message:
                "adminSql bypasses RLS and every grant. Go through a domain service, or a SECURITY DEFINER function (see grant_user_role) for privileged writes.",
            },
            {
              name: "@/config/db",
              importNames: ["sql"],
              message:
                "Query through a domain service (server/<domain>/<domain>.service.ts) so app.user_id is set — a bare sql query returns no rows under RLS.",
            },
          ],
          patterns: [
            {
              // server/README.md: repositories are internal to their domain,
              // and the app layer depends on services. This also keeps
              // server/shared/base.repository out of reach, since calling its
              // helpers directly would skip the domain boundary entirely.
              group: ["@/server/*/*.repository"],
              message:
                "Repositories are internal to their domain. Import that domain's service instead (see server/README.md).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
