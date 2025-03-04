# LLM Engineering



## LLM Serving

### Importance metrics

???+ note "Databricks: [LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices)"

    - **Time To First Token (TTFT)**: How quickly users start seeing the model's output after entering their query. Low waiting times for a response are essential in real-time interactions, but less important in offline workloads. This metric is driven by the time required to process the prompt and then generate the first output token.
    - **Time Per Output Token (TPOT)**: ime to generate an output token for each user that is querying our system. This metric corresponds with how each user will perceive the "speed" of the model. For example, a TPOT of 100 milliseconds/tok would be 10 tokens per second per user, or ~450 words per minute, which is faster than a typical person can read.
    - **Latency**: The overall time it takes for the model to generate the full response for a user. Overall response latency can be calculated using the previous two metrics: latency = (TTFT) + (TPOT) * (the number of tokens to be generated).
    - **Throughput**: The number of output tokens per second an inference server can generate across all users and requests.

## Optimization

[NVIDIA: Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/)

### Speculative Sampling

- DeepMind: *Accelerating large language model decoding with speculative sampling*[@sps_deepmind]
- Google: *Fast inference from transformers via speculative decoding*[@sps_google]

DeepMind 和 Google 前后分别发了一篇 Speculative Sampling 的文章，内容比较相似 (还是有些许不同)。

- [feifeibear/LLMSpeculativeSampling](https://github.com/feifeibear/LLMSpeculativeSampling) 给出了两个算法的 PyTorch 实现
- [jaymody/speculative-sampling](https://github.com/jaymody/speculative-sampling) 给出了 DeepMind 算法的 Jax 实现
- [ai-glimpse/toyllm](https://github.com/ai-glimpse/toyllm) 给出了 DeepMind 算法的 PyTorch 实现 (基于 GPT2 做验证)


### KV Cache
[图解大模型推理优化之 KV Cache](https://zhuanlan.zhihu.com/p/679249229)
给出了非常详细且简洁的解释，文章中参考的 HuggingFace 代码来自
[transformers/models/decision_transformer/modeling_decision_transformer.py](https://github.com/huggingface/transformers/blob/28751958874eccb155fa2ab10a79bf8068d9ae29/src/transformers/models/decision_transformer/modeling_decision_transformer.py#L301-L318)

```python
query = self._split_heads(query, self.num_heads, self.head_dim)
key = self._split_heads(key, self.num_heads, self.head_dim)
value = self._split_heads(value, self.num_heads, self.head_dim)

if layer_past is not None:
    past_key, past_value = layer_past
    key = torch.cat((past_key, key), dim=-2)
    value = torch.cat((past_value, value), dim=-2)
```
核心的逻辑就是如果有历史的 key 和 value，就把当前的 key 和 value 拼接到历史的 key 和 value 上，以此减少计算量。


### MQA

Multi-Query Attention(MQA)

### GQA
Grouped-query Attention(GQA)

### Flash Attention


### PagedAttention

