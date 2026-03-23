#!/usr/bin/env bun
import { defineCommand, runMain } from "citty"
import packageJson from "../package.json"
import convert from "./commands/convert"
import install from "./commands/install"
import listCommand from "./commands/list"
import sync from "./commands/sync"

export const CLI_NAME = "codex-compound"

export const main = defineCommand({
  meta: {
    name: CLI_NAME,
    version: packageJson.version,
    description: "Convert Claude Code plugins into other agent formats",
  },
  subCommands: {
    convert: () => convert,
    install: () => install,
    list: () => listCommand,
    sync: () => sync,
  },
})

if (import.meta.main) {
  runMain(main)
}
