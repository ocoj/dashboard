/** @type {import('next').NextConfig} */
const pkg = require("./package.json");

// ---- version rule enforcement ----
// package.json "version" must follow upstream semver (x.y.z or x.y.z.N).
// The -zh suffix is appended automatically; do NOT put it in package.json.
// See VERSION.md for the full rule.
const VERSION_RE = /^\d+\.\d+\.\d+(\.\d+)?$/;
if (!VERSION_RE.test(pkg.version)) {
  throw new Error(
    `Invalid version "${pkg.version}" in package.json. ` +
      `Must match x.y.z (e.g. 2.90.4) or x.y.z.N (e.g. 2.90.4.1). ` +
      `Do NOT include the -zh suffix. See VERSION.md.`,
  );
}

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  env: {
    APP_ENV: process.env.APP_ENV || "production",
    NEXT_PUBLIC_DASHBOARD_VERSION:
      process.env.NEXT_PUBLIC_DASHBOARD_VERSION || pkg.version + "-zh",
  },
};

module.exports = nextConfig;
