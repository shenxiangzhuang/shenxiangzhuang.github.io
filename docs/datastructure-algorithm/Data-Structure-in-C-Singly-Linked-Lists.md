---
title: 'Data Structure in C: Singly Linked Lists'
type: categories
copyright: true
date: 2019-02-14 16:12:36
tags:
- C
- Data Structure
categories:
- C
---


### Overview
但凡提及`Data Structure`的学习总是从`Single Linked List`开始...之前看*Data Structures and Algorithms in C++*在[Singly Linked Lists](http://datahonor.com/2017/04/25/Singly-Linked-Lists/)写过一个Cpp版本的，实现的东西比较简单一些。后来有看了*Data Structure Using C*(一些笔记放在[这里](https://github.com/shenxiangzhuang/DataStructureUsingC)), 这书写的十分细致，而且代码比较好看懂(虽然偶尔Bug比较多...)。但是两本书写的东西都有些局限的地方，比如都只是“面向”`Int`类型给出的实现。这在*Master Algorithms with C*得到很好的实现，因为它把链表存储的对象换成了`generic pointer`,这就使得可以进行任何类型数据的存储。

下面首先结合前面两本书给出`Int`类型的实现，后给出`generic pointer`的实现。

### Code

#### Int type version

##### singlelinkedlist.h

注意，下面的两个自定义的`type`，`Node`就是我们的链表元素，或者叫节点。`List`就是链表。

这里我们实现了大部分可以想到的操作...包括增[4]删[4]改[1]查[1],创建，打印，排序[`Buble sort`]
{% codeblock lang:cpp %}

	//
	// Created by shensir on 19-2-14.
	//

	#ifndef TEST_SINGLELINKEDLIST_H
	#define TEST_SINGLELINKEDLIST_H

	// Node's data structure
	typedef struct Node{
		int data;
		struct Node *next;
	}Node;

	// linked list's data structure
	typedef struct List{
		Node *head;
		int length;
	}List;

	// create a single linked list with length n
	void list_create(List *list, int n);
	// print a single linked list
	void list_print(List *list);
	// add a Node to a list
	void node_insert_begin(List *list, Node *new_element);
	void node_insert_end(List *list, Node *new_element);
	void node_insert_after(List *list, int given_node_data, Node *new_element);
	void node_insert_before(List *list, int given_node_data, Node *new_element);
	// delete Node in a list
	void node_delete_begin(List *list);
	void node_delete_end(List *list);
	void node_delete_given_node(List *list, int data);
	void list_delete_all(List *list);
	// change node's data in a list
	void node_change(List *list, int data, int new_data);
	// search a number in a list
	int node_search(List *list, int data);
	// sort  the list(increasing)
	void list_sorted(List *list);
	// test function
	void run();
	#endif //TEST_SINGLELINKEDLIST_H

{% endcodeblock %}


##### main.c

几点注意：

>1.为说明起见，这里没有处理重复数据的情况，重复情况下仅仅对第一个数据进行对应处理
>2.多次出现的temp变量，其作用就是一个工具变量，用于定位与释放内存
>3.在链表中，next的使用“代替”了数组中根据index的循环
>4.我们必须注意对空表的处理，使用if或assert来控制这一情况


{% codeblock lang:cpp %}

	#include <stdlib.h>
	#include <stdio.h>
	#include <assert.h>
	#include "singlelinkedlist.h"

	/*StepINT SINGLE LINKED LIST*/
	int main(){
		run();
		return 0;
	}

	void list_create(List *list, int n)
	{
		int i, data;
		Node *new_element;
		for(i=0; i<n; i++){
			new_element = (Node*)malloc(sizeof(Node));
			new_element->next = NULL;
			printf("Enter the data: ");
			scanf("%d", &data);
			new_element->data = data;
			node_insert_end(list, new_element);
		}
	}


	void list_print(List *list){
		if(list->length == 0)
			printf("Empty List!");
		else{
			Node *temp;
			temp = list->head;
			while(temp!=NULL){
				printf("%d ", temp->data);
				temp = temp->next;
			}
		}
		printf("\n");
	}

	// add a Node to a list
	void node_insert_begin(List *list, Node * new_element){
		// 从用户输入新元素的数据
		if(new_element == NULL){
			int data;
			printf("Enter the data: ");
			scanf("%d", &data);
			new_element = (Node*)malloc(sizeof(Node));
			new_element->next = NULL;
			new_element->data = data;
		}
		// empty list or not
		if(list->length == 0)
			list->head = new_element;
		else{
			new_element->next = list->head;
			list->head = new_element;
		}
		list->length++;
	}

	void node_insert_end(List *list, Node *new_element)
	{
		if(new_element == NULL){
			int data;
			printf("Enter the data: ");
			scanf("%d", &data);
			new_element = (Node*)malloc(sizeof(Node));
			new_element->next = NULL;
			new_element->data = data;
		}
		// empty list or not
		if(list->length == 0)
			list->head = new_element;
		else{
			// 找到最后的元素
			int i;
			Node *temp;
			temp = list->head;
			for(i=0; i < list->length-1; i++)
				temp = temp->next;
			// 确保找到的是尾节点
			assert(temp->next == NULL);
			temp->next = new_element;
		}
		list->length++;
	}

	void node_insert_after(List *list, int given_node_data, Node *new_element){
		assert(list->length > 0);
		if(new_element == NULL){
			int data;
			printf("Enter the data of new node: ");
			scanf("%d", &data);
			new_element = (Node*)malloc(sizeof(Node));
			new_element->data = data;
			new_element->next = NULL;
		}
		Node *temp;
		temp = list->head;
		while(1){
			if(temp->data == given_node_data)
				break;
			temp = temp->next;
		}
		new_element->next = temp->next;
		temp->next = new_element;
		list->length++;
	}

	void node_insert_before(List *list, int given_node_data, Node *new_element) {
		assert(list->length > 0);
		if(new_element == NULL){
			int data;
			printf("Enter the data of new node: ");
			scanf("%d", &data);
			new_element = (Node*)malloc(sizeof(Node));
			new_element->data = data;
			new_element->next = NULL;
		}
		// before head or not
		if(list->head->data == given_node_data)
			node_insert_begin(list, new_element);
		else{
			Node *temp;
			temp = list->head;
			while(1){
				if(temp->next->data == given_node_data)
					break;
				temp = temp->next;
			}
			new_element->next = temp->next;
			temp->next = new_element;
		}
		list->length++;
	}

	// delete Node in a list
	void node_delete_begin(List *list){
		assert(list->length > 0);
		Node*temp;
		temp = list->head;
		list->head = list->head->next;
		free(temp);
		list->length--;
	}

	void node_delete_end(List *list){
		assert(list->length > 0);
		// 仅有一个节点
		if(list->length == 1){
			free(list->head);
			list->head = NULL;
		}
		else{
			// 两个节点及以上
			// 获取倒数第二个节点
			Node*prev;
			prev = list->head;
			while(1){
				if(prev->next->next == NULL)
					break;
				prev = prev->next;
			}
			free(prev->next);
			prev->next = NULL;
		}
		list->length--;
	}

	void node_delete_given_node(List *list, int data){
		assert(list->length > 0);
		// if the node at 1st
		if(list->head->data == data){
			printf("Delete from head!\n");
			node_delete_begin(list);
		}
		else{
			// two nodes or more
			// find the node before the given node
			Node*prev, *node;
			prev = list->head;
			while(1){
				if(prev->next->data == data)
					break;
				prev = prev->next;
			}
			node = prev->next;
			prev->next = node->next;
			free(node);
			list->length--;
		}
	}


	void list_delete_all(List *list){
		Node*temp;
		while(list->length > 0){
			temp = list->head;
			list->head = list->head->next;
			free(temp);
			list->length--;
		}
	}

	// change node's data in a list(for simple: only change the first one)
	void node_change(List *list, int data, int new_data){
		assert(list->length > 0);
		Node *temp;
		temp = list->head;
		while(1){
			if(temp->data == data){
				temp->data = new_data;
				break;
			}
			temp = temp->next;
		}
	}

	// search a number in a list
	int node_search(List *list, int data){
		assert(list->length > 0);
		Node *temp;
		temp = list->head;
		int count = 0;
		while(temp->next!=NULL){
			if(temp->data == data)
				count++;
			temp = temp->next;
		}
		if(count>0){
			printf("Get %d '%d'!", count, data);
			return count;
		}
		else{
			printf("There is not a %d\n", data);
			return 0;
		}
	}
	// sort the list(increasing)
	void list_sorted(List *list){
		if(list->length == 0){
			printf("Empty list!");
			return;
		}
		Node *ptr1, *lptr;
		int temp, swapped;
		do{
			swapped = 0;
			ptr1 = list->head;
			lptr = NULL;
			while (ptr1->next != lptr)
			{
				if (ptr1->data > ptr1->next->data)
				{
					temp = ptr1->data;
					ptr1->data = ptr1->next->data;
					ptr1->next->data = temp;
					swapped = 1;
				}
				ptr1 = ptr1->next;
			}
			lptr = ptr1;
		}
		while (swapped);
	}

	void run(){
		List * list;
		list = (List *)malloc(sizeof(List));
		list->head = NULL;
		list->length = 0;
		// 控制下面循环的选项; the length var
		int option, n;
		// 要用到的变量
		int given_node_data, old_data, new_data;
		do{
			printf("*****MAIN MENU *****\n");
			printf("1: Create a list\n");
			printf("2: Display a list\n");
			printf("3: Add a node at the beginning\n");
			printf("4: Add a node at the end\n");
			printf("5: Add a node before a given node\n");
			printf("6: Add a node after a given node\n");
			printf("7: Delete a node from the beginning\n");
			printf("8: Delete a node from the end\n");
			printf("9: Delete a given node\n");
			printf("10: Delete the entire list\n");
			printf("11: Change the number\n");
			printf("12: Search a number\n");
			printf("13: Sort the list\n");
			printf("14: EXIT\n");
			// 输入选项
			printf("Enter your option: ");
			scanf("%d", &option);
			switch(option)
			{
				case 1:
					printf("Enter the length of the list: ");
					scanf("%d", &n);
					list_create(list, n);
					break;
				case 2:
					list_print(list);
					break;
				case 3:
					// 我们从输入来进行新增元素的初始化
					// 所以这里写为NULL，而非一个Node
					// 下同
					node_insert_begin(list, NULL);
					break;
				case 4:
					node_insert_end(list, NULL);
					break;
				case 5:
					printf("Enter the given node data(we will insert node before it): ");
					scanf("%d", &given_node_data);
					node_insert_before(list, given_node_data, NULL);
					break;
				case 6:
					printf("Enter the given node data(we will insert node after it): ");
					scanf("%d", &given_node_data);
					node_insert_after(list, given_node_data, NULL);
					break;
				case 7:
					node_delete_begin(list);
					break;
				case 8:
					node_delete_end(list);
					break;
				case 9:
					// 同插入时一样，我们从用户输入来
					// 指定要删除的元素，故写为NULL
					printf("Enter the given node data: ");
					scanf("%d", &given_node_data);
					node_delete_given_node(list, given_node_data);
					break;
				case 10:
					list_delete_all(list);
					break;
				case 11:
					printf("Change data.\nold data: ");
					scanf("%d", &old_data);
					printf("new data: ");
					scanf("%d", &new_data);
					node_change(list, old_data, new_data);
					break;
				case 12:
					printf("Enter data to be searched: ");
					scanf("%d", &given_node_data);
					node_search(list, given_node_data);
					break;
				case 13:
					list_sorted(list);
					break;
			}
		}while(option != 14);
	}


{% endcodeblock %}


#### Generic pointer version
暂略.

### Supplement

在CLion中写C的项目，直接把Cmake改一行比较好用。把`CMAKE_CXX_FLAGS`所在行改为`set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Werror")`，参考[这里](https://stackoverflow.com/questions/26177390/how-to-create-a-c-project-with-clion)

### Reference
*Data Structure Using C*
*Master Algorithms with C*
*Data Structures and Algorithms in C++*
