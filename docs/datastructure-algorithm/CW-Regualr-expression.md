---
title: CW&Regular expression
copyright: true
date: 2018-02-24 16:42:24
categories:
- Python
tags:
- Python
- CodeWas
- Regular expression
---

#### Overview

前几天终于撸完了那么C的数据结构...所以来刷下CodeWars，感觉一个3kyu的题目挺有意思，[传送门](https://www.codewars.com/kata/calculator/train/python)。就是评估一个四则运算的表达式，给出结果。

#### Code

这里首选的是用正则表达式，好久没写过都手生了...查了下文档和一些资料，发现用`re.sub`就能解决了，所以代码如下：

{% codeblock lang:python %}

	import re

	class Calculator(object):
		def symIn(self, string):
			if re.findall(r'\+|-|\*|\/', string) == []:
				return False
			if string[0] == '-' and ' ' not in string:
				return False

			return True

		def evaluate(self, string):
			# print(string)
			while self.symIn(string):
				# *
				def _mul(matched):
					num = float(matched.group('num1')) * float(matched.group('num2'))
					return str(num)
				string = re.sub(r'(?P<num1>[-\d.]+) \* (?P<num2>[-\d.]+)', repl=_mul, string=string,count=1)

				# /
				def _div(matched):
					num = float(matched.group('num1')) / float(matched.group('num2'))
					return str(num)
				string = re.sub(r'(?P<num1>[-\d.]+) \/ (?P<num2>[-\d.]+)', repl=_div, string=string,count=1)

				# +
				def _add(matched):
					num = float(matched.group('num1')) + float(matched.group('num2'))
					return str(num)
				string = re.sub(r'(?P<num1>[-\d.]+) \+ (?P<num2>[-\d.]+)', repl=_add, string=string,count=1)

				# -
				def _sub(matched):
					num = float(matched.group('num1')) - float(matched.group('num2'))
					return str(num)
				string = re.sub(r'(?P<num1>[-\d.]+) - (?P<num2>[-\d.]+)', repl=_sub, string=string,count=1)

			return float(string)

{% endcodeblock %}

感觉思路还是比较清晰的。嗯，然后提交后看大佬们的操作,发现了竟然有用eval的...另外，之后还打算做个NLP的东西，之前一定要再重新过一遍正则 :(

#### Reference

[Python Doc](https://docs.python.org/2/library/re.html)
[Blog](https://www.crifan.com/python_re_sub_detailed_introduction/)






