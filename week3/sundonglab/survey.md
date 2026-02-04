# AI Methods for Playing Othello: A Survey

## 1. Introduction

Othello (also known as Reversi) has served as a fertile testbed for artificial intelligence research since the earliest days of the field. Played on an 8×8 board where players place discs that flip opponent pieces when outflanked, the game presents a deceptively rich strategic landscape. With an estimated state-space complexity of approximately 10^28 positions and a game-tree complexity of roughly 10^58 [@takizawa2023othello], Othello occupies a unique position in the hierarchy of combinatorial games: complex enough to demand sophisticated algorithms, yet tractable enough to permit complete theoretical analysis.

The history of AI for Othello stretches from early heuristic programs like Iago and Bill in the 1980s to Buro's LOGISTELLO, which defeated the reigning human world champion Takeshi Murakami in 1997. More recently, deep learning and reinforcement learning have opened entirely new avenues for Othello AI, while the game has simultaneously become a prominent benchmark for mechanistic interpretability research through the Othello-GPT line of work. In 2023, Takizawa achieved the landmark result of weakly solving the standard 8×8 game, proving that perfect play from both sides results in a draw [@takizawa2023othello].

This survey provides a comprehensive review of AI methods applied to Othello, organized by methodological family. We cover classical search-based approaches, Monte Carlo tree search methods, neural network and deep learning architectures, reinforcement learning through self-play, neuroevolutionary strategies, and the rapidly growing body of work on emergent world models in transformer-based sequence models. Our scope encompasses 15 papers spanning from 2014 to 2026, focusing on methods that advance either the practical strength of Othello-playing agents or our theoretical understanding of how AI systems learn to play the game.

## 2. Background

### 2.1 Rules and Game Properties

Othello is a two-player, zero-sum, perfect-information game played on an 8×8 board. The game begins with four discs placed in the center in a diagonal pattern, two for each player. On each turn, a player places a disc of their color such that it outflanks one or more of the opponent's discs along a row, column, or diagonal; all outflanked opponent discs are then flipped. If a player has no legal moves, they pass. The game ends when neither player can move, and the winner is the player with the most discs.

Several properties make Othello particularly interesting for AI research. First, the evaluation of positions is non-trivial: disc count is a poor heuristic during midgame because the board state can change dramatically in the endgame, with large chains of discs being flipped. Second, mobility (the number of legal moves available) is often more strategically important than material advantage, creating tension between short-term and long-term planning. Third, corner and edge positions carry disproportionate strategic value because discs placed there cannot be flipped, providing permanent positional advantage.

### 2.2 Complexity and Solving

Othello's state-space complexity is approximately 10^28 legal positions, and its game-tree complexity is roughly 10^58 [@takizawa2023othello]. For context, these figures place Othello between checkers (which was solved by Schaeffer et al. in 2007) and chess (which remains far from being solved) in terms of combinatorial difficulty. The weak solution achieved by Takizawa demonstrates that the game-theoretic value is a draw, meaning neither player can force a win under optimal play from the standard starting position.

## 3. Classical Approaches and Game Solving

### 3.1 Search-Based Methods

The foundation of classical Othello AI is the minimax search algorithm enhanced with alpha-beta pruning. This framework evaluates game positions by recursively exploring the game tree, assuming both players play optimally. Alpha-beta pruning dramatically reduces the number of nodes explored by eliminating branches that provably cannot affect the final decision, typically reducing the effective branching factor from approximately 10 to a much smaller value.

The practical strength of search-based approaches depends critically on two components: the depth of search achievable within computational constraints, and the quality of the evaluation function used to assess positions at the search frontier. Early programs like LOGISTELLO combined deep alpha-beta search with pattern-based evaluation functions that scored positions according to weighted combinations of disc configurations, mobility metrics, and positional features such as corner and edge occupancy. These hand-crafted evaluation functions incorporated decades of human Othello knowledge and achieved superhuman performance by the late 1990s.

### 3.2 Solving Othello

Takizawa's 2023 result that Othello is a draw under perfect play represents the culmination of the search-based paradigm [@takizawa2023othello]. The approach employed a large-scale alpha-beta search built upon the Edax engine, one of the strongest open-source Othello programs. Key technical components included highly optimized endgame solvers for the final 20-24 empty squares using bitboard representations, strong evaluation functions for move ordering that maximized pruning efficiency, and massive computational resources distributed across many processor cores. The search established progressively tighter upper and lower bounds on the game value until convergence, yielding a rigorous proof that the outcome is a draw.

This result is a weak solution: it determines the game-theoretic value from the standard initial position but does not provide a complete strategy for all possible board states. The engineering achievement is impressive given the enormous game-tree complexity, though the methodological contribution lies more in computational scale and optimization than in algorithmic novelty. The result also establishes a definitive benchmark against which all other Othello AI methods can be measured: no agent can do better than drawing against a theoretically perfect opponent.

## 4. N-tuple Networks and Temporal Difference Learning

A distinctive contribution to Othello AI comes from the n-tuple network framework, which provides a lightweight yet effective approach to position evaluation. Jaskowski demonstrated that systematically constructed n-tuple networks can achieve strong performance while requiring remarkably few parameters [@jaskowski2014systematic]. An n-tuple network evaluates board positions by examining patterns of cells (n-tuples) and combining their lookup-table-based evaluations into an overall position score.

The key insight is that the architecture of the n-tuple matters more than its length. Jaskowski showed that short, systematically generated n-tuples (capturing compact spatial patterns on the board) outperform randomly chosen long tuples. With only 288 parameters, these networks achieved results exceeding a 90% win rate in the Othello League benchmarks, demonstrating that compact, well-structured feature representations can rival more complex approaches.

The n-tuple framework gains additional power when combined with temporal difference (TD) learning, where the network learns to evaluate positions by playing games against itself and updating evaluations based on the discrepancy between consecutive predictions. Scheiermann and Konen extended this paradigm by combining n-tuple TD learning with AlphaZero-style Monte Carlo tree search planning, but applying MCTS only at test time rather than during training [@scheiermann2022alphazero]. This separation reduces the computational cost of training substantially while still benefiting from the improved decision quality that search provides during actual play. Their framework was demonstrated across multiple games including Othello, Connect Four, and Rubik's Cube, showing that the combination of learned evaluation functions with planning generalizes well across domains.

## 5. Monte Carlo Tree Search Methods

Monte Carlo tree search (MCTS) has become a central algorithm in modern game-playing AI, particularly following its success in Go through AlphaGo and AlphaZero. MCTS builds a search tree incrementally by repeatedly simulating games from the current position, using the Upper Confidence Bound (UCB) formula to balance exploration of under-visited nodes with exploitation of promising lines. Unlike alpha-beta search, MCTS does not require a handcrafted evaluation function: it estimates position values through the outcomes of random playouts or learned policy and value networks.

Frankston and Howard proposed RMCTS (Recursive MCTS), a breadth-first variant that replaces the standard sequential selection-expansion-simulation-backpropagation cycle with a recursive, breadth-first approach that computes optimized posterior policies at each node [@frankston2026accelerating]. Their method achieves up to a 40× speedup over standard MCTS-UCB on benchmarks including Othello, Connect Four, and Dots-and-Boxes. The acceleration comes from more efficient use of computational resources: rather than running many sequential simulations, RMCTS processes nodes in parallel and converges to stronger policies with fewer iterations. This represents a meaningful advance for resource-constrained settings where the computational budget for search is limited.

The interaction between MCTS and learned evaluation functions is a recurring theme across the Othello AI literature. As demonstrated by Scheiermann and Konen's work on using MCTS only at test time [@scheiermann2022alphazero], the computational overhead of integrating MCTS into the training loop (as AlphaZero does) may not always be necessary. This finding has practical implications for scaling game-playing AI to broader sets of games without the massive compute budgets that AlphaZero-style training demands.

## 6. Neural Network and Deep Learning Approaches

### 6.1 Convolutional Neural Networks for Move Prediction

Liskowski, Jaskowski, and Krawiec conducted the first systematic study of deep convolutional neural network (CNN) architectures for Othello move prediction [@liskowski2017learning]. Training on approximately 6.9 million expert game positions drawn from strong Othello programs, they explored various CNN depths and configurations, achieving approximately 63% top-1 move prediction accuracy. The networks learned to predict the moves of expert-level programs directly from raw board representations, bypassing the need for handcrafted evaluation features.

The study revealed several important findings. Deeper networks consistently outperformed shallower ones, consistent with the hypothesis that Othello strategy involves multi-scale pattern recognition requiring several layers of abstraction. When the trained networks were deployed as evaluation functions within a search framework and tested against the Edax engine, they demonstrated competitive but not dominant performance, suggesting that supervised move prediction alone may not capture the full depth of strategic understanding that search provides. The work also compared CNN-based approaches against the n-tuple networks of Jaskowski, finding that CNNs offered superior generalization but at substantially higher computational cost.

### 6.2 AlphaZero-Style Architectures

The AlphaZero paradigm, which combines deep neural networks with MCTS through self-play reinforcement learning, has been adapted to Othello by several researchers. Norelli and Panconesi developed OLIVAW, which replicates the AlphaGo Zero methodology for Othello at minimal computational cost [@norelli2021olivaw]. Trained entirely on Google Colab (a free cloud computing platform), OLIVAW demonstrated that AlphaZero-style self-play can produce strong Othello agents without the massive computational budgets typically associated with this approach. The system was tested against the Edax engine and top human players, including a former world champion, achieving competitive results despite its modest training resources.

OLIVAW's contribution lies not in methodological novelty but in demonstrating accessibility: the AlphaZero framework, when applied to a game of Othello's complexity, can be trained effectively with consumer-grade hardware. This lowers the barrier to entry for researchers interested in self-play reinforcement learning for board games. However, the system's playing strength, while strong, did not definitively surpass the best handcrafted Othello programs, suggesting that the advantages of learned representations may be partially offset by the loss of human-engineered positional knowledge.

Fujita introduced AlphaViT, which replaces the convolutional residual blocks in AlphaZero with Vision Transformers (ViT), enabling a single network architecture to play Connect Four, Gomoku, and Othello simultaneously across variable board sizes [@fujita2024alphavit]. The key architectural insight is that ViT's patch-based tokenization naturally handles different board geometries without redesigning the network, whereas CNN-based approaches require architecture changes when the board size changes. On Othello specifically, AlphaViT achieved competitive performance with the standard AlphaZero CNN backbone while offering greater flexibility. The same author also explored dynamic difficulty adjustment in AlphaDDA, investigating strategies for modulating the playing strength of a fully trained AlphaZero system to serve as a suitable training partner for human players [@fujita2021alphadda]. This addresses a practical concern in human-AI interaction: opponents that are too strong provide no useful learning signal for humans, while opponents that play artificially weakly may exhibit unrealistic patterns.

### 6.3 Knowledge-Free Learning

Cohen-Solal investigated learning to play two-player perfect-information games, including Othello, without any domain knowledge beyond the game rules [@cohensolal2020learning]. The approach uses only game outcomes (win/loss/draw) as reinforcement signals, with no handcrafted features, no expert game databases, and no domain-specific heuristics. The study compared different scoring heuristics for evaluating terminal states and found that the choice of terminal state evaluation substantially affects learning dynamics and final playing strength. This work contributes to understanding the minimal requirements for learning strong game play, demonstrating that even fully knowledge-free agents can achieve reasonable performance on Othello through self-play, though they do not match the strength of approaches that leverage search or expert knowledge.

## 7. Emergent World Models in Transformers

### 7.1 The Othello-GPT Paradigm

Perhaps the most influential recent line of research involving Othello is not concerned with building the strongest possible player, but rather with understanding what neural networks learn internally. Li et al. trained a GPT-style transformer to predict legal Othello moves from game transcripts, treating the problem as pure next-token prediction on sequences of moves [@li2022emergent]. The model, dubbed Othello-GPT, was never given explicit information about the board state, the rules of Othello, or the concept of disc flipping. Despite this, the authors discovered that the network's internal representations encode a rich model of the board state.

Using nonlinear probes (small neural networks trained to decode internal activations), Li et al. demonstrated that the model's hidden layers contain information sufficient to reconstruct the full 8×8 board state at any point in the game with high accuracy. Moreover, intervention experiments, in which internal representations were modified to correspond to a different board state, caused the model's move predictions to shift consistently with the altered state. This provided causal evidence that the emergent board representations are not merely correlational artifacts but are functionally used by the model for its predictions. The finding that a sequence model trained purely on move sequences spontaneously develops an internal world model has profound implications for understanding how large language models might represent structured knowledge about the real world.

### 7.2 Linearity of World Representations

Nanda, Lee, and Wattenberg significantly refined the Othello-GPT findings by demonstrating that the emergent board representations are not just nonlinearly recoverable but are in fact linearly encoded in the model's residual stream [@nanda2023emergent]. Simple linear probes (logistic regression classifiers) achieved 96-99% accuracy in recovering board state from intermediate layers, matching the performance of the nonlinear probes used by Li et al. This is a stronger and more parsimonious result: if the world model is linearly encoded, it is fundamentally more interpretable and amenable to manipulation.

The authors also discovered that the model uses a player-relative encoding, representing cells as "mine," "yours," or "empty" rather than "black," "white," or "empty." This perspective-dependent representation naturally captures the alternating nature of gameplay, where each player's strategic considerations mirror the opponent's. Causal interventions along the linearly identified directions successfully modified the model's behavior in over 80% of cases, establishing that these linear representations are causally involved in the model's computations.

Hazineh, Zhang, and Chiu further investigated the relationship between model depth and the emergence of linear world models [@hazineh2023linear]. They showed that even shallow one-layer transformers trained on Othello develop linearly recoverable board representations, though the quality of these representations improves with depth. Their analysis traced the causal relationship between the linear world representations and the model's decision-making, demonstrating that the representations in deeper models are more complete and more tightly coupled to output behavior.

### 7.3 Scaling and Generalization

Yuan and Sogaard broadened the investigation by evaluating seven different language model architectures on Othello, including GPT-2, T5, BART, Flan-T5, Mistral, LLaMA-2, and Qwen2.5 [@yuan2025revisiting]. All tested models achieved up to 99% accuracy in unsupervised grounding of board state, providing substantially stronger evidence for the world model hypothesis than the original single-architecture study. The universality of this finding across diverse architectures, including both encoder-decoder and decoder-only models, suggests that the emergence of world models is a fundamental property of sequence modeling rather than an artifact of a particular architecture.

Chen et al. extended the Othello-GPT paradigm in a different direction by introducing multimodal training [@chen2025multimodal]. Their work investigates what happens when Othello-playing language models are given visual input (board images) in addition to move sequences. The multimodal models demonstrated improved sample efficiency and greater robustness compared to text-only models, suggesting that visual grounding provides complementary information that accelerates the formation of internal world models. This is the first study to compare mono-modal and multimodal learning curves on the Othello task, offering insights into how different input modalities contribute to emergent representations.

### 7.4 Mechanistic Interpretability

Du et al. used Othello-GPT as the primary testbed for studying how GPT models construct internal representations layer by layer during training [@du2025gpt]. By comparing Sparse Autoencoders (SAEs) against linear probes, the study traced how the world model develops across both the depth dimension (from input layer to output layer) and the training time dimension (from early to late training steps). The work contributes to the broader mechanistic interpretability program by providing a detailed developmental account of world model formation in a controlled setting where ground truth is fully available.

## 8. Benchmarks and Evaluation

Evaluating Othello AI systems presents several challenges. The space of possible opponents is large, and relative strength depends on the specific matchup. Historical benchmarks include performance against the Edax engine (a strong open-source alpha-beta searcher), tournament results in computer Othello leagues, and win rates against other published systems.

The n-tuple network community has used the Othello League as a primary benchmark, where systems are evaluated based on win rate against a field of opponents at various strength levels [@jaskowski2014systematic]. Liskowski et al. used head-to-head matches against Edax at various search depths as their primary evaluation metric [@liskowski2017learning], providing a more controlled but less comprehensive assessment. OLIVAW was notably tested against a former human world champion, providing a rare human-calibrated data point [@norelli2021olivaw].

For the Othello-GPT line of work, evaluation metrics differ fundamentally because the goal is not playing strength but representational quality. The standard metrics are probe accuracy (the percentage of board cells correctly decoded from internal activations) and intervention success rate (the percentage of cases where modifying internal representations produces the expected change in output behavior) [@li2022emergent; @nanda2023emergent]. Legal move prediction accuracy serves as a secondary metric, with the best models achieving above 93% accuracy on held-out games.

The diversity of evaluation metrics across these research communities reflects the fact that Othello AI research serves multiple goals: building strong players, understanding learning algorithms, and probing the internal mechanics of neural networks. A unified evaluation framework that captures all three dimensions remains an open challenge.

## 9. Discussion and Research Insights

### 9.1 Comparative Analysis

The following table summarizes the key methods surveyed, organized by approach category:

| Approach | Representative Work | Key Technique | Strengths | Limitations |
|----------|-------------------|---------------|-----------|-------------|
| Game Solving | Takizawa (2023) | Alpha-beta search | Provably optimal result | Enormous compute cost; weak solution only |
| N-tuple Networks | Jaskowski (2014) | Systematic n-tuples + TD | Compact, efficient, interpretable | Limited representational capacity |
| MCTS | Frankston & Howard (2026) | Recursive breadth-first MCTS | 40× speedup over standard MCTS | Requires careful policy optimization |
| CNN | Liskowski et al. (2017) | Deep supervised learning | Strong move prediction | Does not replace search entirely |
| AlphaZero-style | Norelli & Panconesi (2021) | Self-play + MCTS + NN | No human knowledge needed | Computationally intensive |
| ViT-based | Fujita (2024) | Vision Transformer + MCTS | Multi-game, variable board size | Higher parameter count |
| World Models | Li et al. (2022) | Sequence prediction + probing | Reveals emergent representations | Not designed for playing strength |

### 9.2 Cross-Cutting Themes

Several themes emerge from this survey. First, there is a productive tension between **search and learning**. Classical approaches rely on deep search with evaluation functions, while modern approaches increasingly use learned representations to guide or replace search. The n-tuple TD learning work [@jaskowski2014systematic; @scheiermann2022alphazero] and AlphaZero-style systems [@norelli2021olivaw; @fujita2024alphavit] represent different points along this spectrum, and the optimal balance between search depth and evaluation quality remains domain-dependent.

Second, Othello has emerged as a **canonical benchmark for mechanistic interpretability**. The Othello-GPT line of work [@li2022emergent; @nanda2023emergent; @hazineh2023linear; @yuan2025revisiting; @chen2025multimodal; @du2025gpt] has transformed the game from a subject of study for game-playing AI into a tool for understanding how neural networks represent structured knowledge. The controlled nature of Othello, with its fully observable state and simple rules, makes it ideal for studying emergent phenomena that may be difficult to analyze in more complex domains like natural language.

Third, the question of **computational accessibility** is increasingly important. OLIVAW demonstrated that AlphaZero-quality results can be achieved on free computing platforms [@norelli2021olivaw], and RMCTS offers dramatic speedups for tree search [@frankston2026accelerating]. These advances democratize access to strong game AI research, which historically required substantial computational resources.

### 9.3 Open Problems and Future Directions

Several open problems merit further investigation. The gap between the theoretical solution (draw) and the practical playing strength of the best AI systems remains: while the game is solved from the initial position, no practical system can play perfectly from arbitrary positions. Bridging this gap would require either a strong solution (perfect play from every position) or an agent that can verify whether a given position falls on the solved path.

The Othello-GPT research direction raises fundamental questions about the nature of world models in language models. If a simple sequence predictor can develop a linear world model of Othello, what kinds of world models might larger language models develop for more complex domains? The multimodal extension by Chen et al. [@chen2025multimodal] points toward studying how different input modalities interact in forming world representations, which has direct implications for multimodal AI systems.

The application of evolutionary and neuroevolutionary methods to Othello remains relatively underexplored in the arXiv literature compared to search and learning approaches, despite the game's suitability for evolutionary optimization due to its well-defined fitness landscape. Similarly, the integration of large language models' general reasoning capabilities with specialized game-playing modules represents a largely untapped research direction.

## 10. Conclusion

This survey has reviewed the landscape of AI methods for playing Othello, spanning from classical search algorithms to cutting-edge interpretability research. The field has reached a remarkable milestone with the complete solving of the game [@takizawa2023othello], establishing that perfect play results in a draw. Yet rather than closing the book on Othello AI, this result has coincided with a surge of interest in using the game as a lens for understanding neural network internals.

The most active current research direction uses Othello not as a game to be won but as a controlled environment for studying emergent representations in transformers. The Othello-GPT paradigm [@li2022emergent] and its extensions [@nanda2023emergent; @hazineh2023linear; @yuan2025revisiting; @chen2025multimodal; @du2025gpt] have demonstrated that sequence models trained purely on move prediction develop linearly decodable internal world models, a finding with implications far beyond game playing.

On the practical side, advances in AlphaZero-style training [@norelli2021olivaw; @fujita2024alphavit], MCTS acceleration [@frankston2026accelerating], and efficient evaluation functions [@jaskowski2014systematic; @scheiermann2022alphazero] continue to push the boundaries of what is achievable with limited computational resources. The game remains a valuable testbed for developing and comparing AI methods that can later be applied to more complex domains.

Othello's unique position, complex enough to be interesting, simple enough to be tractable, and now fully solved, ensures its continued relevance as a benchmark for AI research. The convergence of game-playing AI, deep learning, and mechanistic interpretability in this domain exemplifies how a well-chosen problem can serve as a catalyst for advances across multiple subfields of artificial intelligence.

## References

[@takizawa2023othello]: Takizawa, H. (2023). Othello is Solved. arXiv:2310.19387.

[@li2022emergent]: Li, K., Hopkins, A. K., Bau, D., Viégas, F., Pfister, H., & Wattenberg, M. (2022). Emergent World Representations: Exploring a Sequence Model Trained on a Synthetic Task. arXiv:2210.13382.

[@nanda2023emergent]: Nanda, N., Lee, A., & Wattenberg, M. (2023). Emergent Linear Representations in World Models of Self-Supervised Sequence Models. arXiv:2309.00941.

[@hazineh2023linear]: Hazineh, D. S., Zhang, Z., & Chiu, J. (2023). Linear Latent World Models in Simple Transformers: A Case Study on Othello-GPT. arXiv:2310.07582.

[@yuan2025revisiting]: Yuan, Y. & Søgaard, A. (2025). Revisiting the Othello World Model Hypothesis. arXiv:2503.04421.

[@liskowski2017learning]: Liskowski, P., Jaśkowski, W., & Krawiec, K. (2017). Learning to Play Othello with Deep Neural Networks. arXiv:1711.06583.

[@norelli2021olivaw]: Norelli, A. & Panconesi, A. (2021). OLIVAW: Mastering Othello without Human Knowledge, nor a Fortune. arXiv:2103.17228.

[@fujita2024alphavit]: Fujita, K. (2024). AlphaViT: A Flexible Game-Playing AI for Multiple Games and Variable Board Sizes. arXiv:2408.13871.

[@frankston2026accelerating]: Frankston, K. & Howard, B. (2026). Accelerating Monte-Carlo Tree Search with Optimized Posterior Policies. arXiv:2601.01301.

[@fujita2021alphadda]: Fujita, K. (2021). AlphaDDA: Strategies for Adjusting the Playing Strength of a Fully Trained AlphaZero System. arXiv:2111.06266.

[@scheiermann2022alphazero]: Scheiermann, J. & Konen, W. (2022). AlphaZero-Inspired Game Learning: Faster Training by Using MCTS Only at Test Time. arXiv:2204.13307.

[@jaskowski2014systematic]: Jaśkowski, W. (2014). Systematic N-tuple Networks for Position Evaluation: Exceeding 90% in the Othello League. arXiv:1406.1509.

[@cohensolal2020learning]: Cohen-Solal, Q. (2020). Learning to Play Two-Player Perfect-Information Games without Knowledge. arXiv:2008.01188.

[@du2025gpt]: Du, J., Hong, K., Imran, A., Jahanparast, E., Khfifi, M., & Qiao, K. (2025). How GPT Learns Layer by Layer. arXiv:2501.07108.

[@chen2025multimodal]: Chen, X., Yuan, Y., Li, J., Belongie, S., de Rijke, M., & Søgaard, A. (2025). What if Othello-Playing Language Models Could See? arXiv:2507.14520.
