# Large Language Models: Scaling, Alignment, and Emergent Capabilities

## 1. Introduction

Large Language Models (LLMs)는 자연어 처리 분야를 근본적으로 변화시켰다. Transformer 아키텍처의 등장 이후 [@vaswani2017attention], 모델 규모의 확장과 학습 방법론의 발전이 동시에 진행되면서 LLM은 범용 AI 시스템으로 진화하고 있다.

본 서베이의 목적은 LLM의 세 가지 핵심 축을 분석하는 것이다:
1. **스케일링**: 모델/데이터 규모와 성능의 관계
2. **정렬(Alignment)**: 인간의 의도에 맞게 모델을 조정하는 방법
3. **창발적 능력(Emergent Capabilities)**: 규모 확대에서 나타나는 새로운 능력

12편의 논문을 분석하며, 2017년 Transformer부터 2024년 최신 모델까지의 발전 흐름을 추적한다.

---

## 2. Architectural Foundations

### 2.1 Transformer Architecture

Vaswani et al. [@vaswani2017attention]은 self-attention 메커니즘 기반의 Transformer를 제안했다. 기존 RNN/LSTM 대비 병렬 처리가 가능하며, 긴 시퀀스에서도 의존성을 효과적으로 포착한다. 이 아키텍처는 이후 모든 LLM의 기반이 되었다.

### 2.2 Pre-training Paradigms

BERT [@devlin2019bert]는 양방향 마스크드 언어 모델링으로 사전 학습의 패러다임을 열었다. 반면 GPT 계열은 단방향 자기회귀 방식을 채택했다. T5 [@raffel2020t5]는 이 둘을 "text-to-text" 프레임워크로 통합하여, 모든 NLP 태스크를 동일한 형식으로 처리할 수 있음을 보였다.

**비교**: BERT는 이해(understanding) 태스크에 강하지만 생성에는 부적합하다. GPT/T5의 자기회귀 방식이 현재 LLM의 주류가 된 이유는 생성 능력이 범용성의 핵심이기 때문이다.

---

## 3. Scaling Laws and Compute-Optimal Training

### 3.1 Neural Scaling Laws

Kaplan et al. [@kaplan2020scaling]은 모델 크기, 데이터셋 크기, 컴퓨트 양이 성능과 멱법칙(power law) 관계를 따른다는 것을 발견했다. 이 연구는 "모델을 키우면 성능이 예측 가능하게 향상된다"는 스케일링 가설의 근거가 되었다.

### 3.2 Chinchilla의 도전

Hoffmann et al. [@hoffmann2022chinchilla]은 Kaplan의 결론에 중요한 수정을 가했다. 고정 컴퓨트 예산에서 **모델 크기와 데이터 양의 균형**이 중요하며, 기존 모델들이 상대적으로 under-trained 상태였음을 보였다. Chinchilla (70B)는 4배 큰 Gopher (280B)보다 뛰어난 성능을 기록했다.

**Research Gap**: 스케일링 법칙이 특정 태스크(수학, 코딩 등)에서도 동일하게 적용되는지는 아직 충분히 검증되지 않았다. 태스크별 스케일링 특성에 대한 추가 연구가 필요하다.

---

## 4. Large-Scale Models

### 4.1 GPT-3 and In-Context Learning

Brown et al. [@brown2020language]은 175B 파라미터 GPT-3가 few-shot 프롬프트만으로 다양한 태스크를 수행할 수 있음을 보였다. 이 **in-context learning** 능력은 fine-tuning 없이도 태스크 적응이 가능하다는 점에서 패러다임 전환이었다.

### 4.2 PaLM

Chowdhery et al. [@chowdhery2023palm]은 540B PaLM을 Pathways 시스템으로 학습했다. 특히 BIG-Bench에서 불연속적 성능 향상(breakthrough)이 관찰되어, 규모 확대가 양적 개선이 아닌 질적 변화를 가져올 수 있음을 시사했다.

### 4.3 오픈소스 모델의 등장

LLaMA [@touvron2023llama]는 7B~65B 규모에서 공개 데이터만으로 학습하여 GPT-3에 필적하는 성능을 보였다. Mistral 7B [@jiang2023mistral]는 더 작은 규모에서 Grouped-Query Attention과 Sliding Window Attention으로 효율성을 극대화했다. 이들은 **오픈소스 LLM 생태계**의 폭발적 성장을 이끌었다.

**비교**: 상용 모델(GPT-3, PaLM)은 규모와 인프라에서 우위지만, 오픈소스 모델(LLaMA, Mistral)은 접근성과 커스터마이징에서 강점을 갖는다. Chinchilla의 교훈대로, 작은 모델도 충분한 데이터로 학습하면 큰 모델에 근접할 수 있다.

---

## 5. Alignment and Instruction Following

### 5.1 RLHF

Ouyang et al. [@ouyang2022training]은 InstructGPT를 통해 Reinforcement Learning from Human Feedback (RLHF) 파이프라인을 확립했다: (1) Supervised Fine-Tuning → (2) Reward Model 학습 → (3) PPO 강화학습. 1.3B InstructGPT가 175B GPT-3보다 사용자 선호도에서 우위를 보인 것은 정렬의 중요성을 입증했다.

### 5.2 Constitutional AI

Anthropic의 Claude [@anthropic2024claude]는 RLHF를 넘어 Constitutional AI 접근법을 사용한다. AI가 스스로 원칙에 따라 응답을 개선하는 방식으로, 인간 라벨러 의존도를 줄이면서도 안전성을 높인다.

**Research Gap**: 정렬 방법론이 다국어 환경에서 동일하게 작동하는지, 문화적 차이를 어떻게 반영할 수 있는지에 대한 연구가 부족하다.

---

## 6. Emergent Capabilities

### 6.1 Chain-of-Thought Reasoning

Wei et al. [@wei2022chain]은 "Let's think step by step" 같은 프롬프트가 LLM의 추론 능력을 크게 향상시킴을 보였다. 이 chain-of-thought (CoT) 프롬프팅은 수학, 논리, 상식 추론에서 특히 효과적이며, 모델 규모가 클수록 그 효과가 두드러진다.

**핵심 인사이트**: CoT가 작동하는 이유는 모델이 중간 추론 단계를 명시적으로 생성함으로써 복잡한 문제를 하위 문제로 분해하기 때문이다. 이는 System 2 사고 방식의 근사로 볼 수 있다.

---

## 7. Discussion: Trends and Future Directions

### 주요 트렌드
1. **효율성 추구**: 단순히 크기를 키우는 것에서 Chinchilla, Mistral처럼 "같은 성능을 더 적은 자원으로" 달성하는 방향으로 전환
2. **오픈소스 가속화**: LLaMA 공개 이후 오픈소스 모델의 폭발적 성장, 연구 민주화
3. **정렬의 중요성**: 모델 규모보다 정렬(alignment) 품질이 실용적 가치를 결정

### 미해결 문제
- **Hallucination**: 사실과 다른 내용을 자신감 있게 생성하는 문제. 스케일링만으로는 해결 불가
- **평가 기준 부재**: LLM의 능력을 종합적으로 평가할 표준 벤치마크가 아직 정립되지 않음
- **환경 비용**: 대규모 학습의 탄소 발자국. 효율적 학습과 추론 기법 연구 필요

---

## 8. Conclusion

본 서베이를 통해 LLM 발전의 세 축이 분명해진다:

1. **스케일링은 강력하지만 만능이 아니다** — Chinchilla가 보인 것처럼 데이터-모델 균형이 핵심이며, 특정 능력(추론, 안전성)은 스케일링만으로 달성되지 않는다.
2. **정렬이 실용적 가치의 열쇠다** — InstructGPT의 사례처럼, 작은 정렬 모델이 큰 비정렬 모델을 능가한다.
3. **오픈소스가 연구의 미래다** — LLaMA, Mistral의 등장으로 소수 기업 독점에서 벗어나 누구나 LLM 연구에 참여 가능해졌다.

향후 연구는 hallucination 해결, 다국어 정렬, 효율적 추론, 그리고 LLM 평가 표준화에 집중될 것으로 전망한다.

---

## References

See `references.bib` for full bibliography.
