---
title: AI Town
draft: true
date: 2024-07-12
authors: [mathew]
slug: ai-town
description: >
    斯坦福小镇(AI-Town)系统解读
categories:
  - 终身学习
  - LLM
  - Paper
---

# 斯坦福小镇(AI-Town)系统解读

## Terminology
### Believable
> Believable proxies of human behavior...agents act consistently with their past experiences and
react believably to their environments.

### (experiences -> memory -> reflections) => plan behavior
> To enable generative agents, we describe an architecture that extends a large language model to store a complete record of the agent’s experiences using natural language, synthesize those memories over time into higher-level reflections, and retrieve them dynamically to plan behavior.
observation, planning, and reflection
We demonstrate through ablation that the components of our agent architecture—observation, planning, and reflection—each contribute critically to the believability of agent behavior.

### retrieve(memory) -> reflect -> plans & reactions
> Success requires an approach that can retrieve relevant events and interactions over a long period, reflect on those memories to generalize and draw higher-level inferences, and apply that reasoning to create plans and reactions that make sense in the moment and in the longer-term arc of the agent’s behavior.
ensure long-term coherence
fully general agents that ensure long-term coherence would be better suited by architectures that manage constantly-growing memories as new interactions, conflicts, and events arise and fade over time while handling cascading social dynamics that unfold between multiple agents.

### inference -> daily plans -> react -> re-plan
>Generative agents draw a wide variety of inferences about themselves, other agents, and their environment; they create daily plans that reflect their characteristics and experiences, act out those plans, react, and re-plan when appropriate; they respond when the end user changes their environment or commands them in natural language. For instance, generative agents turn off the stove when they see that their breakfast is burning, wait outside the bathroom if it is occupied, and stop to chat when they meet another agent they want to talk to.
Ideas(UGC相关): 根据实际event进行re-plan

## Architecture
三大部分: memory, reflection, plan

### memory stream
>The first is the memory stream, a long-term memory module that records, in natural language, a comprehensive list of the agent’s experiences. A memory retrieval model combines relevance, recency, and importance to surface the records needed to inform the agent’s moment-to-moment behavior.

### reflection
>The second is reflection, which synthesizes memories into higherlevel inferences over time, enabling the agent to draw conclusions about itself and others to better guide its behavior.

### planning
> The third is planning, which translates those conclusions and the current environment into high-level action plans and then recursively into detailed behaviors for action and reaction. These reflections and plans are fed back into the memory stream to influence the agent’s future behavior.

## Evaluation

## 参考资料
Paper: Generative Agents: Interactive Simulacra of Human Behavior
Code: https://github.com/a16z-infra/ai-town
