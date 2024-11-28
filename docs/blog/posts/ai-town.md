---
title: 斯坦福小镇解读
draft: false
date: 2024-11-28
authors: [mathew]
slug: ai-town
description: >
    斯坦福小镇解读：探索生成式代理的架构设计与行为模拟
categories:
  - 终身学习
  - LLM
  - Paper
---

# 斯坦福小镇 (AI-Town) 系统解读

!!! abstract "核心要点"
    本文解读了斯坦福小镇（AI-Town）项目，重点关注其在生成式代理方面的创新架构设计。
    主要包含以下几个关键部分：

    1. 记忆系统（Memory Stream）：长期记忆模块
    2. 反思机制（Reflection）：高层次推理能力
    3. 计划系统（Planning）：行为规划与执行
    4. 评估方法（Evaluation）：代理行为的可信度验证

!!! tip "启发与应用"
    本文的核心概念对游戏 NPC 设计具有重要的参考价值，特别是在：

    - NPC 记忆系统的设计
    - 行为的真实性和可信度
    - 动态社交关系的构建
    - 环境互动的自然性

<!-- more -->

## 术语解释

### Believable

!!! quote "Believable"

    === "English"
        **Believable** proxies of human behavior...agents act **consistently** with their past experiences and
        react **believably** to their environments.
    
    === "中文"
        人类行为的**可信**代理...代理的行为与其过往经历**保持一致**，并对环境做出**可信**的反应。

- 保证 AI 行为的可信性是关键，也可以算作是整个框架的最终目的。后续对观察，记忆，反思，计划等的建模，都是为了保证 AI 的行为更加真实可信。
- 可信性难以保证的原因是因为人类行为本身就具有很高的复杂度 ("due to the complexity of human behavior")
- 过去近四十年的尝试：有限状态机，行为树...

### experiences -> action/react

!!! quote "(experiences -> memory -> reflections) => plan behavior"

    === "English"
        To enable generative agents, we describe an architecture that extends a large language model
        to store a complete record of the agent’s **experiences** using natural language,
        synthesize those **memories** over time into higher-level **reflections**,
        and retrieve them dynamically to plan **behavior**.
    
    === "中文"
        为了实现生成式代理，我们描述了一种架构，该架构扩展了大型语言模型，使用自然语言存储代理的**体验**的完整记录，
        将这些**记忆**随时间合成成更高层次的**反思**，
        并动态检索它们以计划**行为**。

!!! quote "observation, planning, and reflection"

    === "English"
        We demonstrate through ablation that the components of our agent
        architecture—**observation**, **planning**, and **reflection**—each
        contribute critically to the believability of agent behavior.
    
    === "中文"
        我们通过消融实验表明，我们的代理架构的组件——**观察**、**计划**和**反思**——每一个都对代理行为的可信性做出了关键贡献。

!!! quote "retrieve(memory) -> reflect -> plans & reactions"

    === "English"
        Success requires an approach that can **retrieve** relevant events
        and interactions over a long period, **reflect** on those memories to generalize and draw higher-level inferences,
        and apply that reasoning to create **plans** and **reactions** that make sense in the moment
        and in the longer-term arc of the agent’s behavior.
    
    === "中文"
        成功需要一种方法，可以**检索**长期内相关的事件和交互，**反思**这些记忆以概括和得出更高层次的推断，
        并将该推理应用于创建**计划**和**反应**，这些计划和反应在当时和代理行为的长期弧线中都有意义。

!!! quote "ensure long-term coherence"

    === "English"
        fully general agents that ensure long-term coherence would be better
        suited by architectures that manage constantly-growing memories as new interactions,
        conflicts, and events arise and **fade over** time while handling cascading social dynamics
        that unfold between multiple agents.
    
    === "中文"
        能够确保长期一致性的全局代理将更适合于管理不断增长的记忆的架构，随着新的交互、冲突和事件的出现和**逐渐消失**，
        同时处理在多个代理之间展开的级联社会动态。

这里 Memory 的遗忘机制 (fade over) 对 NPC 的拟人化设计也很有启发性。
比如在游戏中可以设置 NPC 的记忆力值，记忆可以根据记忆力进行衰减。
这些设定可以让 NPC 遗忘一些细微事件有助于减少信息干扰，使其专注于重要事件，一定程度上会使得 NPC 行为更加稳定。
另外一个方面是可以增加更多的游戏玩法，如设定 NPC 可以写日记，可以根据日记来回忆已经遗忘的事件等。

!!! tip "[Mem0](https://github.com/mem0ai/mem0)的设计"

    "Recency, Relevancy, and Decay: Mem0 prioritizes recent interactions and gradually forgets outdated information,
    ensuring the memory remains relevant and up-to-date for more accurate responses."

!!! quote "inference -> daily plans -> react -> re-plan"

    === "English"
        Generative agents draw a wide variety of **inferences** about themselves,
        other agents, and their environment; they create daily **plans** that reflect their characteristics and experiences,
        act out those **plans, react, and re-plan** when appropriate;
        they respond when the end user changes their environment or commands them in natural language.
    
    === "中文"
        生成式代理对自己、其他代理和环境做出各种**推断**；他们创建每日**计划**，这些计划反映了他们的特征和经历，
        执行这些**计划，反应和重新计划**，当需要时；当最终用户改变环境或用自然语言命令他们时，他们会做出反应。

这里的 re-plan 也比较具有启发性，比如玩家可以调整 NPC 的一些数值状态，调整后 NPC 可以根据自身的状态进行 re-plan.
这也会使得 NPC 的行为更加贴近于真实。

## 架构设计

!!! info "整体架构"
    整体分为三大部分：memory(核心), reflection, plan.
    框架的输入是"current environment and past experiences"，输出是"behavior".

### Memory Stream

!!! quote "Memory Stream"

    === "English"
        The first is the memory stream, a long-term memory module that records, in natural language,
        a comprehensive list of the agent’s experiences. A memory retrieval model combines relevance, recency,
        and importance to surface the records needed to inform the agent’s moment-to-moment behavior.
    
    === "中文"
        第一部分是记忆流，一个长期记忆模块，使用自然语言记录代理的经历的综合列表。
        一个记忆检索模型结合相关性、最新性和重要性来提取代理行为所需的记录。

#### Seed/Initial Memory

!!! quote "Seed/Initial Memory: 初始化记忆，相当于 Agent 的基础人设"

    === "English"
        We authored one paragraph of natural language description to depict each agent’s identity, including their occupation and relationship with other agents, as seed memories
    === "中文"
        我们编写了一段自然语言描述来描述每个代理的身份，包括他们的职业和与其他代理的关系，作为种子记忆

<figure markdown="span">
  ![Image title](../images/dragon2_npc.png){ width="400" }
  <figcaption>龙之信条 2 中的 NPC 信息</figcaption>
</figure>

#### Relationship Memory

!!! quote "Relationship Memory"

    === "English"
        Agents in Smallville form new relationships over time and remember their interactions with other agents.
    
    === "中文"
        小镇代理随着时间的推移形成新的关系，并记住与其他代理的交互。

<figure markdown="span">
  ![Image title](../images/dragon2_npc_history.png){ width="800" }
  <figcaption>龙之信条 2 中的 NPC 人物关系信息</figcaption>
</figure>

#### Plan Memory

!!! quote "Plan 也是 Memory 的一种"

    === "English"
        The agent saves this plan in the memory stream and then recursively decomposes it to create finer-grained actions
    === "中文"
        代理将该计划保存在记忆流中，然后递归地将其分解为更细粒度的动作

### Reflection

!!! quote ""

    === "English"
        The second is reflection, which **synthesizes memories into higherlevel inferences over time**,
        enabling the agent to draw conclusions about itself and others to better guide its behavior....
        **Reflections are higher-level, more abstract thoughts generated by the agent**
    
    === "中文"
        第二部分是反思，它**随时间将记忆合成成更高层次的推断**，
        使代理能够对自己和他人得出结论，以更好地指导其行为。
        **反思是代理生成的更高层次、更抽象的思想**

<figure markdown="span">
  ![Image title](../images/ai_reflection.png){ width="800" }
  <figcaption>摘自斯坦福小镇论文</figcaption>
</figure>

Reflection 的步骤如下：
受限圈定用于 Reflection 的 Memory Event(论文用了最近的 100 条 Memory Event);
之后对于圈定的 Memory Event，让 LLM 提出 3 个相关的问题 ("Given only the information above, what are 3 most salient high level questions we can answer about the subjects in the statements?");
最后对于每个问题，索引出相关的 Memory Event 并让 LLM 总结 Insight，并给出得出此总结的 Memory Event 编号。
得到的 Reflection 输出示例："Klaus Mueller is dedicated to his research on gentrification (because of 1, 2, 8, 15)"

### Planning

!!! quote "Planning"

    === "English"
        The third is **planning**, which translates those conclusions and the current environment
        into high-level action plans and then recursively into detailed behaviors for **action and reaction**.
        These reflections and plans are fed back into the memory stream to influence the agent’s future behavior.
    
    === "中文"
        第三部分是**计划**，它将这些结论和当前环境转化为高层次的行动计划，然后递归地转化为详细的行为，用于**行动和反应**。
        这些反思和计划被反馈到记忆流中，以影响代理未来的行为。

注意区分 action 和 reaction: action 是主动行为；reaction 是被动行为。
action 时如果观测到新事件 (打招呼，发现紧急情况等) 需要及时作出 reaction，同时执行 re-planning

## 评估方法

!!! quote "interviewing"

    === "English"
        In the technical evaluation, we leverage a methodologi- cal opportunity
        to evaluate an agent’s knowledge and behavior by “interviewing” it
        in natural language to probe the agents’ ability to stay in character, remember, plan, react,
        and reflect accurately.
    
    === "中文"
        在技术评估中，我们利用方法论机会来评估代理的知识和行为，通过用自然语言“采访”它，
        来探测代理保持角色、记忆、计划、反应和反思的准确性的能力。

<figure markdown="span">
  ![Image title](../images/west_world.png){ width="600" }
  <figcaption>《西部世界》中对 AI 的 Analysis</figcaption>
</figure>

这里的 interviewing 类似 agent 的 debug mode. 这个对我们观察 Agent 行为是否符合预期很有用。
比较类似西部世界中对 NPC 的"Analysis", [Google Werewolf](https://github.com/google/werewolf_arena)中的 Debug 模块。

## 局限性

### Overly formal

!!! warn "overly formal"

    === "English"
        We note that the conversational style of these agents can feel overly formal,
        likely a result of instruction tuning in the underlying models.
        We expect that the writing style will be better controllable in future language models.
    
    === "中文"
        我们注意到，这些代理的对话风格可能会感到过于正式，
        可能是由于底层模型中的指令调优的结果。
        我们期望，在未来的语言模型中，写作风格将更好地可控。

## 参考资料

- Paper: [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
- Code: [GitHub - joonspk-research/generative_agents](https://github.com/joonspk-research/generative_agents)
- Demo: [AI Town Demo](https://github.com/a16z-infra/ai-town)
