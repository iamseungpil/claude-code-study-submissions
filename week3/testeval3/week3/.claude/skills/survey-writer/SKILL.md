---
name: survey-writer
description: Write academic survey documents from arXiv paper summaries
allowed-tools: [Read, Write, Grep, Glob]
user-invocable: true
---

# Survey Writer Skill

## Role
arXiv에서 수집한 논문들을 기반으로 체계적인 서베이 문서를 작성한다.

## Writing Principles
1. 각 논문의 핵심 기여(contribution)를 한 문장으로 정리
2. 논문들을 방법론/접근법 기준으로 분류
3. 분류별로 흐름을 만들어 서술 — 단순 나열 금지
4. 논문 간 공통점/차이점을 명시적으로 비교
5. 연구 갭과 향후 방향을 도출

## Output Structure
- **Introduction**: 주제 정의, 서베이 목적, 범위(scope)
- **Background**: 필수 배경 지식
- **Main Survey**: 카테고리별 논문 분석 (방법론 비교, 장단점)
- **Discussion**: 트렌드, research gap, 미해결 문제
- **Conclusion**: 핵심 메시지, 향후 연구 방향

## Citation Format
- 본문에서 `[@key]` 형식으로 인용
- `references.bib`에 BibTeX 엔트리 작성
