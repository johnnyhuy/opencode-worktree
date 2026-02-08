import { describe, expect, test } from "bun:test"

import {
	buildWarpLaunchConfig,
	encodeWarpPath,
	getShellExecLine,
	hashString,
	sanitizeFileName,
} from "../src/plugin/worktree/terminal"

describe("warp terminal helpers", () => {
	test("encodeWarpPath encodes segments and preserves absolute path", () => {
		const input = "/Users/johnny/Project Name/warp config.yaml"
		const output = encodeWarpPath(input)
		expect(output).toBe("/Users/johnny/Project%20Name/warp%20config.yaml")
	})

	test("buildWarpLaunchConfig includes commands when provided", () => {
		const config = buildWarpLaunchConfig({
			name: "OpenCode Worktree demo",
			title: "Worktree demo",
			cwd: "/Users/johnny/demo",
			command: "opencode --session abc",
		})

		const expected = [
			"---",
			"name: \"OpenCode Worktree demo\"",
			"windows:",
			"  - tabs:",
			"      - title: \"Worktree demo\"",
			"        layout:",
			"          cwd: \"/Users/johnny/demo\"",
			"          commands:",
			"            - exec: \"opencode --session abc\"",
			"",
		].join("\n")

		expect(config).toBe(expected)
	})

	test("buildWarpLaunchConfig omits commands when empty", () => {
		const config = buildWarpLaunchConfig({
			name: "OpenCode Worktree demo",
			title: "Worktree demo",
			cwd: "/Users/johnny/demo",
		})

		expect(config).not.toContain("commands:")
	})

	test("sanitizeFileName normalizes unsafe characters", () => {
		expect(sanitizeFileName("my branch@name")).toBe("my-branch-name")
	})

	test("hashString returns a short hex suffix", () => {
		expect(hashString("demo")).toMatch(/^[a-f0-9]{8}$/)
	})

	test("getShellExecLine uses user shell fallback", () => {
		expect(getShellExecLine()).toBe("exec \"${SHELL:-/bin/bash}\"")
	})
})
