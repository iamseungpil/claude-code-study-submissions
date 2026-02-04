# Literature Review: Multi-modal Large Language Models

## 1. Introduction

Multi-modal Large Language Models (MLLMs) represent a paradigm shift in artificial intelligence, extending the remarkable capabilities of Large Language Models (LLMs) to process and reason over multiple data modalities -- primarily vision and language. By leveraging LLMs as a cognitive "brain" and integrating visual encoders as perceptual "eyes," MLLMs have demonstrated surprising emergent capabilities such as visual question answering, OCR-free reasoning, image-grounded dialogue, and complex visual reasoning [@yin2023survey; @caffagni2024revolution].

The field has evolved rapidly since 2023, with models like LLaVA [@liu2023llava], Qwen-VL [@bai2023qwenvl], and mPLUG-Owl2 [@ye2023mplugowl2] establishing foundational architectures, while subsequent work has addressed critical challenges including training data quality [@xu2024visionflan], computational efficiency [@jin2024efficient], multimodal hallucination [@bai2024hallucination], and advanced reasoning [@lin2025mind].

**Scope and Methodology.** This survey examines 14 representative papers published between 2023 and 2025, selected through systematic searches on arXiv and Google Scholar using queries related to "multimodal large language model," "vision language model," "visual instruction tuning," and "multimodal reasoning." Papers were selected based on relevance, impact, recency, and diversity of contribution types (architecture, training, evaluation, reasoning). We organize the literature into four thematic categories: (1) architecture and model design, (2) training methodologies and data, (3) evaluation and hallucination, and (4) multimodal reasoning.

## 2. Background

### 2.1 From LLMs to MLLMs

The success of instruction-tuned LLMs (e.g., GPT-4, LLaMA, Vicuna) in following complex textual instructions inspired researchers to extend these capabilities to visual inputs. The core idea is straightforward: connect a pre-trained visual encoder (typically CLIP-ViT) to an LLM through a learnable interface module, then train the system to follow multimodal instructions [@yin2023survey].

### 2.2 General Architecture

Most MLLMs share a three-component architecture [@caffagni2024revolution]:

1. **Visual Encoder**: Extracts visual features from input images. CLIP-based Vision Transformers (ViT-L, ViT-H, EVA-ViT-g) dominate due to their strong vision-language alignment from contrastive pre-training.
2. **Vision-Language Connector**: Bridges the visual and textual representation spaces. Designs range from simple linear projections and MLPs to more complex modules like Q-Former (cross-attention with learnable queries) and Perceiver Resamplers.
3. **Large Language Model**: Serves as the reasoning backbone. The LLaMA family is the most widely adopted due to open weights and multiple scale options.

### 2.3 Training Paradigm

The dominant training paradigm follows a two-stage approach [@caffagni2024revolution; @huang2023vit]:

- **Stage 1 -- Pre-training / Alignment**: Train the connector module on large-scale image-text pair data (e.g., CC3M, LAION) to align visual features with the LLM's embedding space. The visual encoder and LLM are typically frozen.
- **Stage 2 -- Instruction Tuning**: Fine-tune on curated instruction-following data to develop conversational and task-following capabilities. The LLM is unfrozen and trained alongside the connector.

## 3. Taxonomy of Approaches

We organize the surveyed papers into four categories reflecting the key research dimensions of the MLLM field.

### 3.1 Architecture and Model Design

Papers proposing novel model architectures, connector designs, and multi-modal integration strategies for building capable MLLMs.

### 3.2 Training Methodologies and Data

Papers focusing on training strategies, data curation, instruction tuning approaches, and novel supervision signals for improving MLLM capabilities.

### 3.3 Evaluation, Benchmarks, and Hallucination

Papers addressing how to evaluate MLLMs, proposing new benchmarks, and analyzing/mitigating the hallucination problem.

### 3.4 Multimodal Reasoning

Papers advancing the reasoning capabilities of MLLMs through chain-of-thought, active perception, and collaborative multimodal reasoning strategies.

## 4. Critical Analysis

### 4.1 Architecture and Model Design

#### LLaVA: Visual Instruction Tuning (Liu et al., 2023) [@liu2023llava]

LLaVA (Large Language and Vision Assistant) introduced the paradigm of visual instruction tuning, making the first attempt to use language-only GPT-4 to generate multimodal instruction-following data. The architecture is intentionally simple: a CLIP ViT-L/14 visual encoder connected to a Vicuna LLM via a single linear projection layer. The model is trained in two stages -- feature alignment on filtered CC3M data, followed by instruction tuning on 158K GPT-4-generated visual conversations. LLaVA demonstrated that even with this minimal architecture, the model could exhibit impressive multimodal chat abilities, achieving 85.1% relative score compared to GPT-4 on synthetic benchmarks and a new state-of-the-art of 92.53% on ScienceQA when combined with GPT-4. This work established the foundational blueprint that virtually all subsequent MLLMs have followed.

#### LLaVA-1.5: Improved Baselines (Liu et al., 2023) [@liu2023improved]

LLaVA-1.5 demonstrated that remarkably simple modifications to the original LLaVA could yield state-of-the-art results across 11 benchmarks. The key changes were: (1) replacing the single linear projection with a two-layer MLP connector, (2) using CLIP-ViT-L-336px for higher resolution, and (3) incorporating academic VQA datasets with explicit response format prompts. The most striking finding was that complex visual resamplers (like Q-Former) and massive pretraining datasets (100M+ image-text pairs) are unnecessary -- a simple MLP connector trained on merely 1.2M publicly available samples achieved superior results, completing full training in approximately one day on a single 8-A100 node. LLaVA-1.5 achieved 80.0 on VQAv2, 63.3 on GQA, 1531.3 on MME, and 36.1 on MM-Vet, outperforming far more complex models like InstructBLIP and Qwen-VL-Chat on most metrics. The paper also introduced LLaVA-1.5-HD, which handles arbitrary image resolutions through grid-based splitting.

#### Qwen-VL (Bai et al., 2023) [@bai2023qwenvl]

Qwen-VL took a different architectural approach by building on the Qwen-7B language model with a ViT-bigG visual encoder (1.9B parameters) and a position-aware cross-attention adapter that compresses visual features into 256 tokens while preserving spatial information through 2D absolute positional encodings. The model's three-stage training pipeline -- from 1.4B image-text pair pretraining to multi-task pretraining (seven tasks including grounding and OCR) to supervised fine-tuning -- enabled it to achieve state-of-the-art performance across image captioning, VQA, visual grounding, and text-reading tasks simultaneously. Notably, Qwen-VL achieved 89.36% on RefCOCO val (surpassing Shikra-13B), 63.8 on TextVQA, and 1487.58 on MME Perception, while natively supporting multi-image inputs, multilingual instructions, and bounding-box-based grounding -- capabilities largely absent in prior open-source LVLMs.

#### mPLUG-Owl2 (Ye et al., 2023) [@ye2023mplugowl2]

mPLUG-Owl2 introduced the concept of *modality collaboration*, demonstrating that visual and language modalities can synergistically enhance each other rather than merely coexisting. The model uses a modularized design where the language decoder acts as a universal interface, with shared functional modules enabling cross-modal collaboration and modality-adaptive modules preserving modality-specific features. This was the first MLLM to demonstrate that incorporating vision capabilities could simultaneously improve performance on pure-text tasks, challenging the prevailing assumption that multimodal training degrades text-only performance.

#### mPLUG-Owl3 (Ye et al., 2024) [@ye2024mplugowl3]

Extending the mPLUG-Owl series, mPLUG-Owl3 tackled the challenge of long image-sequence understanding -- a critical limitation of single-image-focused MLLMs. The model introduces novel hyper attention blocks that efficiently integrate vision and language into a common semantic space, enabling processing of interleaved image-text content, retrieved image-text knowledge, and lengthy videos. The proposed Distractor Resistance evaluation benchmark specifically tests the model's ability to maintain focus amid irrelevant visual distractions, revealing important robustness considerations for practical MLLM deployment.

### 4.2 Training Methodologies and Data

#### Vision-Flan (Xu et al., 2024) [@xu2024visionflan]

Vision-Flan addressed the fundamental data diversity problem in visual instruction tuning by constructing the most diverse publicly available dataset to date: 187 tasks and 1,664,261 instances sourced from academic datasets, each with expert-written instructions. The paper's most important finding was the two-stage training framework: first fine-tune on Vision-Flan's diverse human-labeled data, then apply only 1,000 GPT-4-synthesized instances for human-preference alignment. This approach significantly outperformed single-stage mixed-data training (MME: 1490.6 vs. 1317.9). The analysis revealed three critical insights: (1) GPT-4 synthesized data modulates response format rather than improving core capabilities; (2) a minimal quantity of GPT-4 data suffices for alignment; and (3) visual instruction tuning primarily helps LLMs understand visual features. The work also showed that task diversity matters more than data volume -- 187 tasks with 500 instances each dramatically outperformed 10 tasks with 10,000 instances each.

#### ROSS: Reconstructive Visual Instruction Tuning (Wang et al., 2024) [@wang2024ross]

ROSS proposed a paradigm shift in how MLLMs are supervised. Instead of only supervising text outputs (as all prior methods do), ROSS adds a reconstructive objective on visual output tokens, forcing the model to preserve fine-grained image details. The key innovation is using a denoising diffusion objective rather than direct pixel regression, which effectively handles the heavy spatial redundancy of visual signals. With only a single SigLIP visual encoder, ROSS-7B outperformed Cambrian-1-8B (which uses multiple visual experts) on hallucination benchmarks (POPE: 88.3 vs. 87.4; HallusionBench: 57.1 vs. 48.7) and fine-grained understanding (MMVP: 56.7 vs. 51.3), with only approximately 10% training overhead and no additional inference cost.

### 4.3 Evaluation, Benchmarks, and Hallucination

#### A Survey on Multimodal Large Language Models (Yin et al., 2023) [@yin2023survey]

This comprehensive survey, among the earliest and most influential in the MLLM field, systematically traced the development of MLLMs from their conceptual foundations to advanced applications. It covered architecture formulations, training strategies, evaluation protocols, and extended topics including multimodal in-context learning (M-ICL), multimodal chain-of-thought (M-CoT), and LLM-aided visual reasoning (LAVR). The survey identified key challenges such as the need for more granular visual understanding, support for additional modalities beyond vision, and strategies for reducing hallucination.

#### A Survey on Benchmarks of Multimodal Large Language Models (Li et al., 2024) [@li2024benchmarks]

This paper presented a comprehensive review of 200 benchmarks and evaluations for MLLMs, organized across five dimensions: perception and understanding, cognition and reasoning, specific domains, key capabilities, and other modalities. The survey argued that evaluation should be treated as a crucial discipline in MLLM development, noting that the lack of standardized evaluation protocols has made it difficult to compare models fairly and identify genuine improvements.

#### Hallucination of Multimodal Large Language Models (Bai et al., 2024) [@bai2024hallucination]

This survey provided a thorough analysis of hallucination in MLLMs -- the phenomenon where models generate outputs inconsistent with visual content. The work reviewed recent advances in identifying, evaluating, and mitigating hallucinations, categorizing causes (data biases, architectural limitations, decoding strategies), evaluation benchmarks (POPE, CHAIR, HallusionBench), and mitigation strategies (improved training data, RLHF, contrastive decoding). The paper highlighted that hallucination remains one of the most significant obstacles to practical MLLM deployment, particularly in safety-critical domains like healthcare and autonomous driving.

#### Visual Instruction Tuning towards General-Purpose Multimodal Model: A Survey (Huang et al., 2023) [@huang2023vit]

This survey provided a systematic review of visual instruction tuning (VIT), covering network architectures, tuning frameworks and objectives, evaluation setups, and datasets. It categorized VIT methods according to both the studied vision task and the method design, highlighting a trajectory from task-specific models toward general-purpose multimodal models. The survey identified key challenges including the need for more diverse instruction data, better evaluation protocols, and more effective strategies for knowledge transfer across modalities.

### 4.4 Multimodal Reasoning

#### Efficient Multimodal Large Language Models: A Survey (Jin et al., 2024) [@jin2024efficient]

While primarily focused on efficiency, this survey provided critical insights into the computational bottlenecks of MLLMs and strategies for overcoming them. The paper organized efficiency approaches into six categories: architecture (compact designs with Phi-2, Gemma-2B, Mamba-2.8B as backbones), vision efficiency (pruning, distillation), LLM efficiency (attention optimization, MoE), training (PEFT, LoRA), data/benchmarks, and applications. Key findings included that models with approximately 3B parameters can approach the performance of 7-13B models on many benchmarks -- for example, Bunny (Phi-2, 2.7B) achieved 86.8 on POPE, competitive with LLaVA-1.5 (Vicuna-13B) at 85.9. The survey also showed that Mamba-based models achieve competitive performance with only 43% of the parameters of comparable Transformer-based models.

#### The Revolution of Multimodal Large Language Models: A Survey (Caffagni et al., 2024) [@caffagni2024revolution]

This comprehensive survey analyzed architectural choices, multimodal alignment strategies, and training techniques across 30+ MLLMs. It covered visual understanding, visual grounding, image generation and editing, and domain-specific applications -- notably including visual grounding and image generation capabilities that prior surveys had neglected. Key architectural insights included: (1) CLIP-based ViT models dominate as visual encoders; (2) simple linear projections and MLPs remain highly effective despite more sophisticated alternatives; (3) the LLaMA family is the most commonly used LLM backbone; and (4) two-stage training (alignment followed by instruction tuning) is the dominant paradigm.

#### Mind with Eyes: From Language Reasoning to Multimodal Reasoning (Lin et al., 2025) [@lin2025mind]

This survey proposed a two-level taxonomy for multimodal reasoning: *language-centric* reasoning (where vision serves a supporting role) and *collaborative* reasoning (where vision actively participates through action generation and state updates). Language-centric approaches include one-pass visual perception (encoding images once) and active visual perception (multiple rounds of visual re-perception during reasoning). Collaborative approaches involve visual state updates and joint action-reasoning -- for example, generating auxiliary diagrams or visual annotations during problem-solving. The survey identified a critical bottleneck: current MLLMs remain fundamentally anchored to language priors, treating vision as auxiliary rather than as a co-equal reasoning modality, and visual generation capabilities lag far behind text generation.

## 5. Research Insights & Trends

### 5.1 Architectural Simplicity Wins

A consistent finding across the literature is that simpler architectures often outperform more complex designs. LLaVA-1.5 demonstrated that a two-layer MLP connector surpasses Q-Former-based resamplers [@liu2023improved], while ROSS showed that intrinsic supervision with a single visual encoder outperforms approaches aggregating multiple visual experts [@wang2024ross]. This suggests that the field may have over-invested in complex connector designs when the language model's representational capacity is the primary determinant of performance.

### 5.2 Data Quality Over Quantity

Multiple papers converge on the insight that data quality and diversity matter more than volume. Vision-Flan showed that 187 diverse tasks with 500 instances each dramatically outperform 10 tasks with 10,000 instances each [@xu2024visionflan]. LLaVA-1.5 achieved state-of-the-art results with only 1.2M training samples -- orders of magnitude less than InstructBLIP (129M) or Qwen-VL (1.4B) [@liu2023improved]. Furthermore, as few as 1,000 GPT-4 synthesized examples suffice for human-preference alignment [@xu2024visionflan].

### 5.3 The Hallucination Challenge

Hallucination remains a persistent and critical challenge for MLLMs [@bai2024hallucination]. ROSS's reconstructive approach offers a promising direction by forcing models to maintain fine-grained visual fidelity [@wang2024ross], while LLaVA-1.5 showed that higher resolution reduces hallucination more effectively than cleaner data [@liu2023improved]. However, no existing approach fully eliminates the problem, and hallucination poses particular risks in safety-critical applications.

### 5.4 From Perception to Reasoning

The evolution from perception-focused MLLMs to reasoning-capable systems represents the current frontier. Lin et al. [@lin2025mind] identified a progression from language-centric reasoning (vision as passive input) to collaborative reasoning (vision as active participant). The emergence of reinforcement learning-based approaches (inspired by DeepSeek-R1 and OpenAI o1) for multimodal reasoning represents a particularly promising direction, though significant challenges remain in enabling genuine vision-language co-reasoning.

### 5.5 Efficiency as an Enabler

The efficiency survey [@jin2024efficient] demonstrated that compact MLLMs with approximately 3B parameters can approach the performance of 7-13B models, enabled by advances in architecture (MoE, Mamba), vision token compression, and parameter-efficient fine-tuning. This trend toward efficiency is crucial for democratizing MLLM research and enabling deployment on edge devices.

## 6. Conclusion & Future Directions

This survey has examined the rapid development of Multimodal Large Language Models across architecture design, training methodologies, evaluation, and reasoning capabilities. Several key themes emerge:

**Established Findings:**
- The three-component architecture (visual encoder + connector + LLM) has proven remarkably effective and is likely to remain the dominant paradigm.
- Visual instruction tuning is essential for developing conversational and instruction-following capabilities.
- Simple architectures with high-quality, diverse training data consistently outperform complex architectures with massive but lower-quality data.

**Open Challenges:**
1. **Multimodal Hallucination**: Despite progress, hallucination remains the most significant barrier to real-world MLLM deployment. Novel supervision signals like reconstructive objectives [@wang2024ross] offer promising directions.
2. **Multi-image and Video Understanding**: Most current MLLMs are optimized for single-image inputs. Extending to multi-image understanding, long video comprehension, and interleaved image-text content remains an active research area [@ye2024mplugowl3].
3. **Genuine Multimodal Reasoning**: Current reasoning approaches remain language-dominated. Achieving true vision-language collaborative reasoning -- where both modalities contribute equally to the reasoning process -- is a fundamental open problem [@lin2025mind].
4. **Efficiency and Accessibility**: While significant progress has been made in model compression, deploying capable MLLMs on edge devices with real-time performance remains challenging [@jin2024efficient].
5. **Omni-modal Extension**: Extending beyond vision-language to incorporate audio, video, 3D, and other modalities in a unified framework represents the next frontier toward artificial general intelligence.
6. **Evaluation Standards**: The proliferation of benchmarks without standardization makes fair comparison difficult [@li2024benchmarks]. The community would benefit from agreed-upon evaluation protocols and more challenging benchmarks that test deeper understanding.

The field of multimodal large language models is evolving at an extraordinary pace. The transition from simple visual question answering to complex multimodal reasoning, combined with advances in efficiency and training methodology, suggests that MLLMs will play an increasingly central role in AI systems that interact with the real world.

## References

[@liu2023llava]: Liu, H., Li, C., Wu, Q., & Lee, Y. J. (2023). Visual Instruction Tuning. *NeurIPS 2023*. arXiv:2304.08485

[@liu2023improved]: Liu, H., Li, C., Li, Y., & Lee, Y. J. (2023). Improved Baselines with Visual Instruction Tuning. *NeurIPS 2023*. arXiv:2310.03744

[@bai2023qwenvl]: Bai, J., Bai, S., Yang, S., et al. (2023). Qwen-VL: A Versatile Vision-Language Model for Understanding, Localization, Text Reading, and Beyond. arXiv:2308.12966

[@ye2023mplugowl2]: Ye, Q., Xu, H., Ye, J., et al. (2023). mPLUG-Owl2: Revolutionizing Multi-modal Large Language Model with Modality Collaboration. arXiv:2311.04257

[@ye2024mplugowl3]: Ye, J., Xu, H., Liu, H., et al. (2024). mPLUG-Owl3: Towards Long Image-Sequence Understanding in Multi-Modal Large Language Models. arXiv:2408.04840

[@xu2024visionflan]: Xu, Z., Feng, C., Shao, R., et al. (2024). Vision-Flan: Scaling Human-Labeled Tasks in Visual Instruction Tuning. arXiv:2402.11690

[@wang2024ross]: Wang, H., Zheng, A., Zhao, Y., et al. (2024). Reconstructive Visual Instruction Tuning. arXiv:2410.09575

[@yin2023survey]: Yin, S., Fu, C., Zhao, S., et al. (2023). A Survey on Multimodal Large Language Models. arXiv:2306.13549

[@li2024benchmarks]: Li, J., Lu, W., Fei, H., et al. (2024). A Survey on Benchmarks of Multimodal Large Language Models. arXiv:2408.08632

[@bai2024hallucination]: Bai, Z., Wang, P., Xiao, T., et al. (2024). Hallucination of Multimodal Large Language Models: A Survey. arXiv:2404.18930

[@huang2023vit]: Huang, J., Zhang, J., Jiang, K., et al. (2023). Visual Instruction Tuning towards General-Purpose Multimodal Model: A Survey. arXiv:2312.16602

[@jin2024efficient]: Jin, Y., Li, J., Liu, Y., et al. (2024). Efficient Multimodal Large Language Models: A Survey. arXiv:2405.10739

[@caffagni2024revolution]: Caffagni, D., Cocchi, F., Barsellotti, L., et al. (2024). The Revolution of Multimodal Large Language Models: A Survey. arXiv:2402.12451

[@lin2025mind]: Lin, Z., Gao, Y., Zhao, X., et al. (2025). Mind with Eyes: from Language Reasoning to Multimodal Reasoning. arXiv:2503.18071
