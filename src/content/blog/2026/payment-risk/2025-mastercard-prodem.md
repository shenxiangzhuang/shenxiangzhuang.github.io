---
title: '2025-MasterCard-PRODEM'
description: 'MasterCard 在2025年发表的关于风控模型监控的研究：反向蒸馏线上模型来训练更复杂的离线模型，用离线模型来监控线上模型的效果。'
date: 2026-04-07
tags: ['风控', 'Paper']
imageWithoutText: 'https://storage.mathewshen.me/images/2025-mastercard-prodem.png'
authors: ['mathew']
draft: false
order: 1
---

## When/Where/What

MasterCard 在2025年发表的关于风控模型监控的研究: [*Proactive Detection of Model Degradation in Financial Fraud Prediction with Delayed Labels*](https://ecmlpkdd-storage.s3.eu-central-1.amazonaws.com/preprints/2025/ads/preprint_ecml_pkdd_2025_ads_315.pdf).


## Why

传统的模型监控方式普遍存在滞后的问题：

1. Drift Detection（KS, PSI, Wasserstein distance, JS-Divergence）： "Despite these improvements, these methods remain fundamentally reactive rather than proactive when confronted with delayed labels."
2. Model Monitoring Systems: "They do not predict future model errors before ground truth labels become available."

一些OOD检测的方法也不能直接用于判断模型的预测性能是不是已经发生了退化：

1. Anomaly and Out of Distribution Detection(Isolation Forest, MSP): "They primarily focus on identifying individual anomalous or out of distribution instances rather than systematic degradation patterns, and don’t directly assess whether model predictions will be incorrect."


PRODEM的核心就是解决上述的滞后和退化检测问题：

> Unlike traditional reactive methods that wait for confirmed fraud labels, our framework proactively identifies potential model failures before significant financial losses accumulate, enabling timely intervention in the face of evolving fraud patterns.


## How
