# SITUATION
You need a quick literature review for a new research topic. Use MCP to connect to academic paper APIs, Subagents to analyze papers in parallel, and create a Custom Skill to automate survey writing.

WHAT TO DO
1 Set Up MCP Server
Install and configure an academic paper MCP server (choose one):

Option A: arXiv MCP (Recommended)
uv tool install arxiv-mcp-server
claude mcp add arxiv -- uv tool run arxiv-mcp-server

Option B: Semantic Scholar MCP
npx -y @smithery/cli@latest install @smithery-ai/semantic-scholar --client claude
💡 Verify installation: claude mcp list

2 Create Survey Writing Skill
Create a custom Skill in .claude/skills/survey/SKILL.md to automate survey generation.

3 Collect and Analyze Papers with Subagents
Use Task tool to spawn subagents for parallel paper analysis. Collect 10+ papers.

4 Write Survey Document
Use your Skill to write a structured survey with introduction, critical analysis, and research insights.


DELIVERABLES 📄

survey.md (Required)
• Introduction & scope
• Critical analysis (10+ papers)
• Research insights & trends
• Conclusion & future directions

📚 references.bib (Required)
• BibTeX format, 10+ entries
• Real papers only (arXiv ID or DOI)
⚡
.claude/skills/*/SKILL.md (Required)
• Custom survey-writer skill
• YAML frontmatter + instructions
🔌
.claude/settings.local.json (Optional)
• MCP server config (if used)
• Bonus points for proper setup

SCORING RUBRIC
Category	Points
A. Tool Setup
Custom Skill (10) + MCP config (5) + Subagent usage (5) 20
B. Writing Structure
Introduction, organization, references, conclusion 35
C. Research Insight
Summaries, critical analysis, synthesis 35
⏱️ Time Bonus +10
Total	100

⚠️ Note: Fake/hallucinated papers will result in 0 points for that paper. Use MCP to fetch real papers with arXiv ID or DOI.