---
name: survey
description: >
  Automated literature survey generator. Triggers when user requests a survey,
  literature review, or paper analysis on a research topic. Uses MCP-connected
  academic APIs and parallel subagents to collect, analyze, and synthesize
  10+ real papers into a structured survey document with BibTeX references.
user-invocable: true
---

# Survey Writer Skill

## Available MCP Tools

- `mcp__arxiv__search_papers` — Search arXiv for papers by query, category, and date range
- `mcp__arxiv__download_paper` — Download a paper by arXiv ID for local reading
- `mcp__arxiv__read_paper` — Read the full content of a downloaded paper
- `mcp__arxiv__list_papers` — List all previously downloaded papers
- `mcp__google-scholar-mcp__search_google_scholar` — Search Google Scholar with author/year filters

## Workflow

### Phase 1: Search

Run **parallel searches** across multiple sources to maximize coverage:

1. **arXiv searches** (3+ queries with different keyword combinations):
   - Use `mcp__arxiv__search_papers` with relevant `categories` filter
   - Target 10-15 results per query
   - Use both broad and specific queries to capture the field

2. **Google Scholar search** (1-2 queries):
   - Use `mcp__google-scholar-mcp__search_google_scholar`
   - Filter by recent years (startYear/endYear)

### Phase 2: Collect

1. Merge all search results (~30-40 papers)
2. Deduplicate by title and arXiv ID
3. Select 12-15 papers based on:
   - Relevance to the topic
   - Recency (prefer recent work)
   - Citation impact (from Google Scholar results)
   - Diversity of approaches
4. Download selected papers: `mcp__arxiv__download_paper(paper_id=...)`

### Phase 3: Analyze (Parallel Subagents)

Use the **`paper-analyzer`** custom agent (defined in `.claude/agents/paper-analyzer.md`) to analyze each paper.

For each paper, spawn a **Task tool subagent** (type: `paper-analyzer`) with:

```
Analyze arXiv paper {paper_id}. Download and read the paper, then provide
a full structured analysis including title, authors, method, contributions,
results, limitations, category, and BibTeX entry.
```

The `paper-analyzer` agent will automatically:
- Download and read the paper via arXiv MCP tools
- Fall back to WebFetch if MCP download fails
- Return a structured analysis with all 11 fields including BibTeX

Run subagents **in parallel** (multiple Task calls in one message) for efficiency.

### Phase 4: Synthesize

Combine all subagent analyses into final outputs:

**survey.md structure:**
```markdown
# Literature Review: {Topic}

## 1. Introduction
- Research motivation and scope
- Survey methodology
- Paper selection criteria

## 2. Background
- Key concepts and definitions
- Historical context

## 3. Taxonomy of Approaches
- Category 1: ...
- Category 2: ...
- Category 3: ...
(Organize papers into 3-4 thematic categories)

## 4. Critical Analysis
### 4.1 Category 1
(For each paper: summary, contributions, analysis)
### 4.2 Category 2
...

## 5. Research Insights & Trends
- Common patterns across papers
- Evolution of approaches
- Open challenges

## 6. Conclusion & Future Directions
- Summary of findings
- Promising research directions

## References
(Cite all papers using [@key] format)
```

**references.bib format:**
```bibtex
@article{key2024,
  title={...},
  author={...},
  journal={arXiv preprint arXiv:XXXX.XXXXX},
  year={2024},
  url={https://arxiv.org/abs/XXXX.XXXXX},
  eprint={XXXX.XXXXX},
  archivePrefix={arXiv}
}
```

## Constraints

- **Only real papers**: Every entry must have a verifiable arXiv ID or DOI
- **Minimum 10 papers**: Survey must reference at least 10 distinct papers
- **Cross-reference**: Every citation in survey.md must have a matching references.bib entry
