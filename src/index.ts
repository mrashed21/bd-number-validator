/**
 * `bd-number-validator` — framework-independent entry point.
 *
 * Nothing exported from here imports React, so this module is safe to use in
 * Node, Deno, edge runtimes, workers and plain browser scripts.
 *
 * React bindings live in a separate entry:
 * `import { PhoneInputBd, useBdPhone } from "bd-number-validator/react";`
 */
export * from "./core";
