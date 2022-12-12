---
title: Dangling pointer and Lifetime
copyright: true
date: 2018-01-24 17:38:11
categories:
- C
tags:
- C
---


#### Overview

在CW刷C的题，一道7ku的题目写了快100行...（虽然完成率只有1%）,然后还出错了...折腾下改好了。回头发现原来是写了Dangling pointer.


#### Code

将原问题抽象成下面的代码：

{% codeblock lang:c %}

	#include <stdio.h>

	char* readData(char s[10]){
		fgets(s, 10, stdin);
		return s;
	}

	char* foo(){
		char s[10];
		return readData(s);
	}

	int main(){
		char *pch = foo();
		printf("%s", pch);
		return 0;
	}

{% endcodeblock %}

这里的main函数中的pch就是dangling pointer了，因为在foo函数执行完之后，s的内存就被释放掉了，此时pch指向的内存中保存的数据是undefined的。所以（可能由于内存未刷新的原因），多次执行这个程序，有时也会正常打印，但是大部分时候是不行的。

这就涉及到了变量的lifetime的问题（参考[这里](https://blog.feabhas.com/2010/09/scope-and-lifetime-of-variables-in-c/)），如上，s是属于最常见的automatic objects,所以其内存会随着函数执行的结束而释放。解决办法有两种，就是使用其他两种变量(static&dynamic)来替换这里作为automatic的s。


##### static

{% codeblock lang:c %}

	#include <stdio.h>

	char* readData(char s[10]){
		fgets(s, 10, stdin);
		return s;
	}

	char* foo(){
		static char s[10];
		return readData(s);
	}

	int main(){
		char *pch = foo();
		printf("%s", pch);
		return 0;
	}

{% endcodeblock %}

只需要将原来foo函数中的`char s[10]`改为`static char s[10]`即可。这种方法虽然简单，但是有个缺点，就是这里分配的内存应为确定的，这里是10。所以不太方便。


##### dynamic

{% codeblock lang:c %}

	#include <stdio.h>
	#include <stdlib.h>

	char* readData(char s[10]){
		fgets(s, 10, stdin);
		return s;
	}

	char* foo(){
		char *s;
		s = malloc(10);
		return readData(s);
	}

	int main(){
		char *pch = foo();
		printf("%s", pch);
		free(pch);
		return 0;
	}

{% endcodeblock %}

这里改动也是不多的，只是用了`malloc`和`free`来动态地分配和释放内存。

其实，严格来说，dynamic也是属于automatic的，只不过有些不同：

>Strictly speaking (according to the C standard) dynamically allocated objects are also called automatics. However, it is important to differentiate between this type of object and automatics for two reasons:

>The memory is allocated from a different memory area (the heap not the stack)

>The lifetime is under the control of the programmer rather than the C run-time system.

第二条是我们想要利用的属性，也就是可控的lifetime.


