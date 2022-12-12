---
title: list comprehension in Haskell
copyright: true
date: 2018-01-17 17:55:00
categories:
- Haskell
tags:
- Haskell
---

#### Overview

以建立简易的图书馆数据库为例，学习Haskell的list comprehension以及其他的关于QuickCheck，pattern match的一些内容。


#### Code

{% codeblock lang:haskell %}

	-- 图书馆数据库模型
	module Library where
	  import Test.QuickCheck
	  import Data.List

	  --在对问题建立模型时，首先考虑对象的类型
	  type Person  = String
	  type Book     = String
	  type Database = [(Person, Book)]

	  exampleBase :: Database
	  exampleBase =
		[("Alice", "Tintin"), ("Anna", "Little Women"),
		 ("Alice", "Asterix"), ("Roty", "Tintin")]

	  -- 数据库上的函数

	  -- 查询函数(lookup)
	  -- 读者->图书
	  books      ::Database -> Person -> [Book]
	  books dBase findPerson = [book | (person, book) <- dBase, person == findPerson]
	  -- 图书->读者
	  borrowers  ::Database -> Book -> [Person]
	  borrowers dBase findBook = [person | (person, book) <- dBase, book == findBook]
	  -- 图书是否借出
	  borrowed   ::Database -> Book -> Bool
	  borrowed dBase findBook = findBook `elem` [book | (_, book) <- dBase]
	  -- 读者借书数目
	  numBorrowed::Database -> Person -> Int
	  numBorrowed dBase findPerson = length (books dBase findPerson)


	  -- 更新函数(update)
	  makeLoan  ::Database -> Person -> Book ->Database
	  makeLoan dBase findPerson findBook = dBase ++ [(findPerson, findBook)]

	  returnLoan::Database -> Person -> Book -> Database
	  returnLoan dBase findPerson findBook = [pair | pair <- dBase, pair /= (findPerson, findBook)]

	  -- Show Database
	  showDatabase::Database -> IO()
	  showDatabase dBase =
		putStrLn $ intercalate "\n" [person++":"++book | (person, book) <- dBase]

	  -- QuickCheck测试
	  -- 如果将书借给读者person,然后查询借给读者person的书，那么book应该在列表中出现
	  prop_db1::Database -> Person -> Book -> Bool
	  prop_db1 dBase person book =
		book `elem` loanedAfterLoan where
		  afterLoan = makeLoan dBase person book
		  loanedAfterLoan = books afterLoan person

	  -- 如果读者将peson借的书book还回，然后查询读者person借阅的图书，那么book不应该在列表中
	  prop_db2::Database -> Person -> Book -> Bool
	  prop_db2 dBase person book =
		  book `notElem` loanedAfterReturn where
		  afterReturn = returnLoan dBase person book
		  loanedAfterReturn = books afterReturn person


{% endcodeblock %}


#### ...

学haskell有一段时间了，感觉还是挺不错的。了解了很多新的东西（虽然现在还有很多理解不了）。感觉就elegant来言，haskell是不输Python的。目前了解到的typeclass感觉很强大（比OOP里面的多态继承要更加简洁），看了wiki，它也是首次出现在haskell里面的。其他是之前看到haskell不仅可以test,而且可以proof...test用的QuickCheck，感觉很好用,proof还没有看到。另外感觉haskell群的各位大佬都比较热心，经常是原理+demo的给讲解很基础的东西。慢慢学吧...

