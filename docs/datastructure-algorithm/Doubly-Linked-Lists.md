---
title: Doubly Linked Lists
copyright: true
date: 2017-04-25 13:53:46
categories:
- Cpp
tags:
- Cpp
- DataStructure
---

##### 初识
双向链表原理和单链表时一样的，也是由节点组成，每个节点包含要存储的数据信息和前后节点[单链表只有后面节点的信息]的位置信息，这些节点串连，形成一个链表。


##### 实现

###### doublyLLst.h
{% codeblock lang:cpp %}

    //
    // Created by shensir on 17-4-25.
    //

    #ifndef CPPPROJECTS_DOUBLYLLST_H
    #define CPPPROJECTS_DOUBLYLLST_H

    #include <iostream>

    template <class T>
    class Node{
    public:
        T info;
        Node* next, *prev;

        Node(){
            next = prev = 0;
        }

        Node(const T& el ,Node* n = 0, Node* p = 0){
            info = el; next = n; prev = p;
        }
    };



    template <class T>
    class DoublyLinkedList{

    protected:
        Node<T> *head, *tail;

    public:
        DoublyLinkedList(){
            head = tail = 0;
        }

        void addToDLLTail(const T&);
        void addToDLLHead(const T&);
        T deleteFromDLLTail();
        T deleteFromDLLHead();
        void deleteNodeFromEl(T el);
        void deleteNodeFromPs(int pos);
        void addToDLList(const T& el, int pos);
        bool isInList(T el);
        void printLinkedLists();


    };

    template <class T>
    void DoublyLinkedList<T>::addToDLLTail(const T &el ) {
        if(tail != 0){
            tail = new Node<T>(el, 0, tail);
            tail->prev->next = tail;
        }
        else head = tail = new Node<T>(el);
    }



    template <class T>
    void DoublyLinkedList<T>::addToDLLHead(const T &el ) {
        if(head != 0){
            head = new Node<T>(el, head, 0);
            head->next->prev = head;
        }
        else head = tail = new Node<T>(el);
    }



    template <class T>
    T DoublyLinkedList<T>::deleteFromDLLHead() {
        T el = head->info;
        if(head == tail){ // if only one node in the list
            delete head;
            head = tail =0;
        }
        else{ // if more than one node in the list
            head = head->next;  // 先将head后移
            delete head->prev;  // 删除旧head
            head->prev = 0;  // 新head's prev 设置为0
        }
        return el;
    }




    template <class T>
    T DoublyLinkedList<T>::deleteFromDLLTail() {
        T el = tail->info;
        if(head == tail){ // if only one node in the list
            delete head;
            head = tail =0;
        }
        else{ // if more than one node in the list
            tail = tail->prev;
            delete tail->next;
            tail->next = 0;
        }
        return el;
    }


    template <class T>
    void DoublyLinkedList<T>::deleteNodeFromEl(T el) {
        if(head != 0){
            if(el == head->info && head==tail){
                delete head;
                head = tail = 0;
            }
            else if(el == head->info){
                deleteFromDLLHead();
            }
            else{
                Node<T>* tmp, *pred;
                for(pred = head, tmp = head->next; tmp!=0 && !(tmp->info == el);
                    pred = pred->next, tmp = tmp->next);  // and a non-head node is deleted
                if(tmp != 0){
                    pred->next =tmp->next;
                    tmp->next->prev = pred;
                    delete tmp;

                }
            }
        }
    }


    template <class T>
    void DoublyLinkedList<T>::deleteNodeFromPs(int pos) {
        if(pos == 1)
            deleteFromDLLHead();
        else if(pos == -1)
            deleteFromDLLTail();
        else{
            Node<T> *tmp = head->next;
            Node<T> *pred = head;
            for(int i=0;i < pos - 2;
                i++, pred = pred->next, tmp = tmp->next);

            pred->next = tmp->next;
            if(tmp->next != 0)  // 如果删除的不是最后一个节点，那么要与前面的节点连接[只在双向链表有]
                tmp->next->prev = pred;

            delete tmp;

        }

    }




    template <class T>
    void DoublyLinkedList<T>::addToDLList(const T&el, int pos) {
        if(pos == 1)
            addToDLLHead(el);
        else if(pos == -1)
            addToDLLTail(el);
        else{
            Node<T> *tmp = head->next;
            Node<T> *pred = head;
            for(int i=0;i < pos - 2;
                i++, pred = pred->next, tmp = tmp->next);

            Node<T>* psNode = new Node<T>(el, tmp, pred);
            tmp->prev = psNode;
            pred->next = psNode;

        }
    }


    template <class T>
    bool DoublyLinkedList<T>::isInList(T el) {
        Node<T>* tmp;
        for(tmp=head; tmp != 0 && el != tmp->info; tmp = tmp->next);
        return tmp != 0;
    }


    // print the singly linked lists
    template <class T>
    void DoublyLinkedList<T>::printLinkedLists(){
        Node<T>* p = head;
        while(p != 0){
            printf("%d\n", p->info);
            p = p->next;
        }
    }


    #endif //CPPPROJECTS_DOUBLYLLST_H


{% endcodeblock %}

###### main.cpp

{% codeblock lang:cpp %}

    #include <iostream>
    #include "doublyLLst.h"

    int main(){

        DoublyLinkedList<int> list;
        list.addToDLLTail(11);
        list.addToDLLTail(12);
        list.addToDLLTail(13);
        list.addToDLLHead(10);


        list.printLinkedLists();

        list.deleteFromDLLHead();
        printf("after the deleting from head...\n");
        list.printLinkedLists();

        printf("after the deleting from el:12...\n");
        list.deleteNodeFromEl(12);
        list.printLinkedLists();

        printf("after the deleting from ps:2...\n");
        list.deleteNodeFromPs(2);
        list.printLinkedLists();

        printf("after the adding from ps:1...\n");
        list.addToDLList(6, 1);
        list.printLinkedLists();

        bool isin = list.isInList(6);

        std::cout<<"Is 6 in list? The answer is: "<<isin<<std::endl;
        return 0;
    }


{% endcodeblock %}

输出:
>10
11
12
13
after the deleting from head...
11
12
13
after the deleting from el:12...
11
13
after the deleting from ps:2...
11
after the adding from ps:1...
6
11
Is 6 in list? The answer is: 1

###### 注意

此处用到模板，其声明的函数一般要在当前的头文件进行定义。当然，非要分到对应的cpp文件[例如doublyLLst.cpp]也行，只不过，这时候调用这些函数的话，要在main.cpp上面添加一句`include "doublyLLst.cpp"`。

##### 参考
*[stackoverflow](http://stackoverflow.com/questions/13216844/undefined-reference-to-linkedlistintpush-frontint)*
*Data Structures and Algorithms in C++*

