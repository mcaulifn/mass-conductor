import { copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const outfile = "dist/mass-conductor.js";
// The HA integration serves the card from this path so a single HACS
// (integration) repo ships both the backend and the frontend.
const integrationCopy =
  "custom_components/mass_conductor/frontend/mass-conductor.js";

const copyToIntegration = {
  name: "copy-to-integration",
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length) return;
      mkdirSync(dirname(integrationCopy), { recursive: true });
      copyFileSync(outfile, integrationCopy);
    });
  },
};

const options = {
  entryPoints: ["src/mass-conductor.ts"],
  bundle: true,
  format: "esm",
  target: "es2021",
  outfile,
  sourcemap: watch,
  minify: !watch,
  legalComments: "none",
  plugins: [copyToIntegration],
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("watching…");
} else {
  await esbuild.build(options);
  console.log(`built ${outfile} (+ ${integrationCopy})`);
}
