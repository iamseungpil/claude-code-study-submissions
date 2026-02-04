---
name: survey-writer
description: |
  This skill orchestrates end-to-end academic survey writing. It uses
  MCP-based paper retrieval (arxiv-mcp-server), parallel subagent
  analysis via Task tool, and iterative writing to produce survey.md
  and references.bib. TRIGGERS: "write survey", "survey document",
  "generate survey", "literature survey"
---

# Survey Writer Skill

Orchestrate end-to-end academic survey writing with MCP-based paper retrieval, parallel subagent analysis, and iterative synthesis.

## Workflow

```
[Input: Topic / Research Question]
      ↓
[Phase 1] Topic Scoping
      ↓
[Phase 2] Paper Discovery (ArXiv MCP)
      ↓
[Phase 3] Parallel Analysis (Task Subagents)
      ↓
[Phase 4] Survey Writing (Iterative)
      ↓
[Phase 5] Verification & Cross-check
      ↓
[Output: survey.md + references.bib]
```

## Phase 1: Topic Scoping

Accept the survey topic from the user and define the scope:

1. **Define the topic** clearly (e.g., "AI Methods for Playing Othello")
2. **Identify subtopics** to cover (e.g., classical methods, MCTS, deep learning, RL)
3. **Generate search queries** — create 6-10 diverse queries covering:
   - Core topic terms
   - Alternate names or synonyms
   - Specific method families (RL, MCTS, neural networks, evolutionary)
   - Broader related domains
4. **Set inclusion criteria** — arXiv papers, conference papers, relevance threshold

## Phase 2: Paper Discovery

Use `mcp__arxiv-mcp-server__search_papers` to find candidate papers:

```
For each search query:
  → mcp__arxiv-mcp-server__search_papers(query, max_results=10)
  → Collect paper IDs, titles, abstracts
  → Deduplicate across queries
  → Filter to 10-15 most relevant papers
```

**Search strategy:**
- Run multiple queries to maximize coverage across subtopics
- Prioritize papers that directly address the survey topic
- Include foundational papers and recent advances
- Ensure diversity of methods (classical, learning-based, hybrid)

## Phase 3: Parallel Analysis with Task Subagents

Spawn **Task tool subagents** in parallel batches of 3-4 papers each.

Each subagent performs:
1. **Download** paper via `mcp__arxiv-mcp-server__download_paper(paper_id)`
2. **Read** content via `mcp__arxiv-mcp-server__read_paper(paper_id)`
3. **Extract** structured information:
   - Title, authors, year, arXiv ID
   - Research question / motivation
   - Method summary
   - Key results and metrics
   - Strengths and limitations
   - Relevance to survey topic
4. **Generate BibTeX** entry with real metadata from the paper

**Subagent prompt template:**
```
Download and analyze arXiv paper {paper_id}.
Use mcp__arxiv-mcp-server__download_paper to download, then
mcp__arxiv-mcp-server__read_paper to read the full text.
Extract: title, authors, year, research question, method,
results, strengths, limitations. Generate a BibTeX entry.
Return all as structured text.
```

**Batching strategy:**
- Batch 1: Papers 1-4 (launch in parallel)
- Batch 2: Papers 5-8 (launch in parallel)
- Batch 3: Papers 9-12 (launch in parallel)
- Collect all results before proceeding to Phase 4

## Phase 4: Survey Writing

Synthesize all paper analyses into a structured `survey.md`:

**Document structure:**
1. **Introduction** — domain motivation, scope, contributions
2. **Background** — foundational concepts, problem formulation
3. **Thematic sections** (3-5) — grouped by methodology family
4. **Discussion** — cross-cutting themes, comparative analysis, open problems
5. **Conclusion** — summary of findings, future directions
6. **References** — cite all analyzed papers

**Writing principles:**
- **Topic-first paragraphs**: Lead with the main point, then support
- **Prose format**: No bullet points in the body; write flowing paragraphs
- **Inline citations**: Use `[@citekey]` format throughout
- **Critical analysis**: Don't just describe — compare, contrast, evaluate
- **Comparative tables**: Include method comparison tables where appropriate
- **Concrete numbers**: Quote specific results with sources
- **Logical flow**: Each section builds on the previous one

**Iterative improvement:**
- Write first draft focusing on completeness
- Review for logical flow and coherence
- Ensure every cited paper has a matching BibTeX entry
- Verify no hallucinated claims or papers

## Phase 5: Verification

Run final quality checks before delivering:

- [ ] `references.bib` has 10+ entries with real arXiv IDs
- [ ] Every `[@citekey]` in `survey.md` has a matching `references.bib` entry
- [ ] `survey.md` has introduction, organized body sections, and conclusion
- [ ] Each paper receives critical analysis (not just description)
- [ ] No hallucinated papers — all fetched via MCP tools
- [ ] Comparative table or summary comparing methods
- [ ] Research gaps and future directions discussed

**If any check fails:** Fix the issue and re-verify before delivering.

## Output Files

| File | Description |
|------|-------------|
| `survey.md` | Full survey document in Markdown |
| `references.bib` | BibTeX file with all cited references |

## MCP Tools Used

| Tool | Purpose |
|------|---------|
| `mcp__arxiv-mcp-server__search_papers` | Search arXiv for papers by query |
| `mcp__arxiv-mcp-server__download_paper` | Download a paper by arXiv ID |
| `mcp__arxiv-mcp-server__read_paper` | Read downloaded paper as markdown |

## Quality Standards

- All papers must be real, verifiable arXiv publications
- Survey must demonstrate synthesis, not just paper-by-paper summaries
- Critical analysis should identify strengths, limitations, and research gaps
- Writing should be accessible to researchers familiar with AI but not necessarily the specific subfield
