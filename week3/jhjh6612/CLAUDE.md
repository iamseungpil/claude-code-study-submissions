# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **literature review automation** project that uses Claude Code's MCP servers, subagents (Task tool), and custom skills to collect academic papers, analyze them in parallel, and produce a structured survey document.

## Key Commands

```bash
# MCP server setup (arXiv - recommended)
uv tool install arxiv-mcp-server
claude mcp add arxiv -- uv tool run arxiv-mcp-server

# Alternative: Semantic Scholar MCP
npx -y @smithery/cli@latest install @smithery-ai/semantic-scholar --client claude

# Verify MCP installation
claude mcp list
```

## Architecture

1. **MCP Server** — Connects to an academic paper API (arXiv or Semantic Scholar) to fetch real papers with arXiv IDs or DOIs. Configured in `.claude/settings.local.json`.
2. **Custom Skill** (`.claude/skills/survey/SKILL.md`) — A reusable skill with YAML frontmatter that automates the survey generation workflow.
3. **Subagents** — Use the Task tool to spawn parallel agents for analyzing 10+ papers concurrently.
4. **Output** — `survey.md` (structured literature review) and `references.bib` (BibTeX, 10+ real entries).

## Deliverables

| File | Description |
|------|-------------|
| `survey.md` | Introduction, critical analysis of 10+ papers, research insights, conclusion |
| `references.bib` | BibTeX format, 10+ entries with real arXiv IDs or DOIs |
| `.claude/skills/survey/SKILL.md` | Custom survey-writer skill with YAML frontmatter |
| `.claude/settings.local.json` | MCP server configuration (optional, bonus points) |

## Critical Constraint

Only real papers count. Every referenced paper must have a verifiable arXiv ID or DOI — hallucinated/fake papers receive 0 points.
