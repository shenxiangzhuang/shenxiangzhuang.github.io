---
title: Haskell&The Caesar Cipher
copyright: true
date: 2018-02-07 21:04:24
categories:
- Haskell
tags:
- Haskell
---


#### Overvier

例子来自*Programming in Haskell*(很好的一本书，简要明了)， 主要是将list comprehension。仅仅短短几十行代码...充分体现了FP的concise...


#### Code

{% codeblock lang:haskell %}

	module FirstScript where
	  import Test.QuickCheck
	  import Test.HUnit
	  import Data.Char

	  let2int :: Char -> Int
	  let2int c  = ord c - ord 'a'
	  int2let :: Int -> Char
	  int2let n = chr(ord 'a' + n)

	  shift :: Int -> Char -> Char
	  shift n c | isLower c = int2let((let2int c + n) `mod` 26)
				| otherwise = c

	  encode :: Int -> String -> String
	  encode n xs = [shift n x | x <- xs]

	  percent :: Integer -> Integer -> Float
	  percent n m = (fromInteger n / fromInteger m)*100

	  count :: Char -> String -> Integer
	  count c string = sum[ 1 | x <- string, c == x ]

	  lowers :: String -> Integer
	  lowers xs = sum[ 1 | x <- xs, isLower x ]

	  freqs :: String -> [Float]
	  freqs xs = [percent (count x xs) n | x <- ['a'..'z']]
			  where n = lowers xs
	  table :: [Float ]
	  table = [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.2, 0.8, 4.0, 2.4,
			6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.2, 2.0, 0.1]

	  chisqr :: [Float] -> [Float] -> Float
	  chisqr os es = sum[ (o-e)^2 | (o, e) <- zip os es]

	  rotate :: Int -> [a] -> [a]
	  rotate n xs = drop n xs ++ take n xs

	  positions :: Eq a => a -> [a] -> [Int]
	  positions x xs = [ i | (x', i) <- zip xs [0..n-1], x' == x] where
				n = length xs

	  crack :: String -> String
	  crack xs = encode (-factor) xs where
				factor = head (positions (minimum chitab) chitab)
				chitab = [chisqr (rotate n table') table | n <- [0..25]]
				table' = freqs xs

	-- test data
	-- crack (encode 3 "Haskell is fun and I love it!")
	-- crack (encode 3 "Haskell is fun!")
	-- crack (encode 3 "haskell is fun!")

{% endcodeblock %}

>ps:一开始看到用卡方值还一阵惊讶，我可能不是一个合格的玩统计的人...其实从前面开始讲词频的时候就该想到和分布有关，然后由于一般性，首先应该想到正态分布，进而就是”集成正态分布“的卡方分布了。
