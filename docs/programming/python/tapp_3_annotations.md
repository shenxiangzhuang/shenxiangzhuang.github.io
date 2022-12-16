---
date: 2019-11-10 15:34:22
---


### Overview

整理下关于`Python`中`Type Checking`的资料。主要参考[realpython](https://realpython.com/python-type-checking/).关于`Type Checking`，这篇文章主要是基于`mypy`来讲的，另外微软的`pyright`用着也还可以（还是有Bug...），可以和`Vscode`一起用。


### Annotations

在`variable`, `function`,和`class`中均可以使用`Annotations`.此外有`Type Comments`可以用为旧版本`Python`的替代品，不过不太好用，一般只用`Annotations`。


#### Variable Annotations

```python
pi: float = 3.14
```

`Variable`的`Annotations`被存储在字典`__annotations__ `中。

```python
print(__annotations__)
```

输出`{'pi': <class 'float'>}`.


#### Function Annotations

定义格式如下，

```python
def func(arg: arg_type, optarg: arg_type = default) -> return_type:
```



示例代码，

```python
def calArea(r: float, pi:float = 3.14):
    return pi * r * r
```


在函数不返回任何值的时候，使用`None`

```python
def play(player_name: str) -> None:
    print(f"{player_name} plays")
```

因为`Python`是支持`Gradual typing`的，所以如果函数不返回任何值，这里是可以不写返回值的。不同的是，不写返回值的时候，`ret_val = play("Henrik")`是被`mypy`允许的，而上面的写返回值为`None`的时候，`ret_val = play("Henrik")`是不被允许的——`error: "play" does not return a value`。

#### Class: Type Hints for Methods


```python
class Card:
    SUITS = "♠ ♡ ♢ ♣".split()
    RANKS = "2 3 4 5 6 7 8 9 10 J Q K A".split()

    def __init__(self, suit: str, rank: str) -> None:
        self.suit = suit
        self.rank = rank

    def __repr__(self) -> str:
        return f"{self.suit}{self.rank}"
```

### Composite Types&Type Aliases

对于简单的变量类型，我们可以直接使用内置的类型，

```python
name: str = "Guido"
pi: float = 3.142
centered: bool = False
```

也可以进行依据内置的类型进行复合，
```python
names: list = ["Guido", "Jukka", "Ivan"]
version: tuple = (3, 7, 1)
options: dict = {"centered": False, "capitalize": True}
```

但是这种写法存在问题，通过`Annotations`，可以直接推断出`names`是一个`list`，但是对于`names[0]`的类型，并不能通过`Annotations`知道（因为在`Python`中做`Type Checking`大部分不是在运行时进行的，所以我们无从知道`names[0]`的类型，换言之，我们能且只能通过`Annotations`来获取变量的类型）。

这就引出了下面的用法，即依靠`typing`库的内置类型，

```python
from typing import Dict, List, Tuple

names: List[str] = ["Guido", "Jukka", "Ivan"]
version: Tuple[int, int, int] = (3, 7, 1)
options: Dict[str, bool] = {"centered": False, "capitalize": True}
```

如此，我们可以得到：
>`names`是`str`组成的`list`
>`version`是三个`int`组成的`tuple`
>`options`是`key`为`str`，`value`为`bool`的`dict`


比如在后面`Example`段中将要提到的扑克牌（格式`♠8`）的例子就是利用上述类型，

```python
def create_deck(shuffle: bool = False) -> List[Tuple[str, str]]:
    """Create a new deck of 52 cards"""
    deck = [(s, r) for r in RANKS for s in SUITS]
    if shuffle:
        random.shuffle(deck)
	return deck
```

观察上面的代码我们也可以发现一个问题，`List[Tuple[str, str]]`已经变的复杂，不仅其实际代表的数据结构的含义被掩盖，我们后面将此类型的参数传入函数的时候，其`Annotations`也会变得冗长，如，

```python
def deal_hands(
    deck: List[Tuple[str, str]]
) -> Tuple[
    List[Tuple[str, str]],
    List[Tuple[str, str]],
    List[Tuple[str, str]],
    List[Tuple[str, str]],
]:
    """Deal the cards in the deck into four hands"""
    return (deck[0::4], deck[1::4], deck[2::4], deck[3::4])
```


于是就有了`Type Alias`的引入，

```python
from typing import List, Tuple

Card = Tuple[str, str]
Deck = List[Card]

def deal_hands(deck: Deck) -> Tuple[Deck, Deck, Deck, Deck]:
    """Deal the cards in the deck into four hands"""
    return (deck[0::4], deck[1::4], deck[2::4], deck[3::4])
```

如此，我们不但简化了`Annotations`的编写，也使得代码逻辑更容易理解。


### Special Types: `Any`&`Type Variables`

考虑如下函数，
```python
import random
from typing import Any, Sequence

def choose(items: Sequence[Any]) -> Any:
    return random.choice(items)
```

>Why Sequence: In many cases your functions will expect some kind of sequence, and not really care whether it is a list or a tuple.

这里，我们的意图是：使用`choose`函数从一个`Sequence`中任取一个值并返回，因为我们不关心`Sequence`中元素的类型，所以使用`Any`，代表任意类型。我们是想要其返回元素的类型与输入的`Sequence`元素的类型是一致的（在使用`Any`的情况下），但实际上并非如此——这里函数返回值丢失了原来`Sequence`中的元素类型，看下面的例子，

```python
# choose.py
import random
from typing import Any, Sequence

def choose(items: Sequence[Any]) -> Any:
    return random.choice(items)

names = ["Guido", "Jukka", "Ivan"]
reveal_type(names)

name = choose(names)
reveal_type(name)
```

运行`mypy choose.py`，
>choose.py:10: error: Revealed type is 'builtins.list[builtins.str*]'
>choose.py:13: error: Revealed type is 'Any',可以看到原来元素为`str`，现在已经丢失为`Any`类型。



为解决此问题，我们引入了`Type Variables`，

```python
import random
from typing import Sequence, TypeVar

Choosable = TypeVar("Chooseable")

def choose(items: Sequence[Choosable]) -> Choosable:
    return random.choice(items)

names = ["Guido", "Jukka", "Ivan"]
reveal_type(names)

name = choose(names)
reveal_type(name)
```
运行`mypy choose.py`，
>choose.py:12: error: Revealed type is 'builtins.list[builtins.str*]'
>choose.py:15: error: Revealed type is 'builtins.str*'

此外，我们也可以进一步地限制`Type Variables`的可选类型范围，

```python
Choosable = TypeVar("Choosable", str, float)
```

### Example: A Deck of Cards

#### Without Annotations

```python
import random

SUITS = "♠ ♡ ♢ ♣".split()
RANKS = "2 3 4 5 6 7 8 9 10 J Q K A".split()

def create_deck(shuffle=False):
    """Create a new deck of 52 cards"""
    deck = [(s, r) for r in RANKS for s in SUITS]
    if shuffle:
        random.shuffle(deck)
        return deck

def deal_hands(deck):
    """Deal the cards in the deck into four hands"""
    return (deck[0::4], deck[1::4], deck[2::4], deck[3::4])

def play():
    """Play a 4-player card game"""
    deck = create_deck(shuffle=True)
    names = "P1 P2 P3 P4".split()
    hands = {n: h for n, h in zip(names, deal_hands(deck))}

	for name, cards in hands.items():
		card_str = " ".join(f"{s}{r}" for (s, r) in cards)
		print(f"{name}: {card_str}")

if __name__ == "__main__":
	play()
```

>P4: ♣9 ♢9 ♡2 ♢7 ♡7 ♣A ♠6 ♡K ♡5 ♢6 ♢3 ♣3 ♣Q
>P1: ♡A ♠2 ♠10 ♢J ♣10 ♣4 ♠5 ♡Q ♢5 ♣6 ♠A ♣5 ♢4
>P2: ♢2 ♠7 ♡8 ♢K ♠3 ♡3 ♣K ♠J ♢A ♣7 ♡6 ♡10 ♠K
>P3: ♣2 ♣8 ♠8 ♣J ♢Q ♡9 ♡J ♠4 ♢8 ♢10 ♠9 ♡4 ♠Q

#### With Annotations

```python
import random
from typing import List, Tuple

SUITS = "♠ ♡ ♢ ♣".split()
RANKS = "2 3 4 5 6 7 8 9 10 J Q K A".split()

Card = Tuple[str, str]
Deck = List[Card]

def create_deck(shuffle: bool = False) -> Deck:
	"""Create a new deck of 52 cards"""
	deck = [(s, r) for r in RANKS for s in SUITS]
	if shuffle:
		random.shuffle(deck)
	return deck

def deal_hands(deck: Deck) -> Tuple[Deck, Deck, Deck, Deck]:
	"""Deal the cards in the deck into four hands"""
	return (deck[0::4], deck[1::4], deck[2::4], deck[3::4])

def choose(items):
	"""Choose and return a random item"""
	return random.choice(items)

def player_order(names, start=None):
	"""Rotate player order so that start goes first"""
	if start is None:
		start = choose(names)
	start_idx = names.index(start)
	return names[start_idx:] + names[:start_idx]

def play() -> None:
	"""Play a 4-player card game"""
	deck = create_deck(shuffle=True)
	names = "P1 P2 P3 P4".split()
	hands = {n: h for n, h in zip(names, deal_hands(deck))}
	start_player = choose(names)
	turn_order = player_order(names, start=start_player)

	# Randomly play cards from each player's hand until empty
	while hands[start_player]:
		for name in turn_order:
			card = choose(hands[name])
			hands[name].remove(card)
			print(f"{name}: {card[0] + card[1]:<3}  ", end="")
		print()

if __name__ == "__main__":
	play()
```

#### With Annotations & OOP

```python
import random
import sys

class Card:
	SUITS = "♠ ♡ ♢ ♣".split()
	RANKS = "2 3 4 5 6 7 8 9 10 J Q K A".split()

	def __init__(self, suit, rank):
		self.suit = suit
		self.rank = rank

	def __repr__(self):
		return f"{self.suit}{self.rank}"

class Deck:
	def __init__(self, cards):
		self.cards = cards

	@classmethod
	def create(cls, shuffle=False):
		"""Create a new deck of 52 cards"""
		cards = [Card(s, r) for r in Card.RANKS for s in Card.SUITS]
		if shuffle:
			random.shuffle(cards)
		return cls(cards)

	def deal(self, num_hands):
		"""Deal the cards in the deck into a number of hands"""
		cls = self.__class__
		return tuple(cls(self.cards[i::num_hands]) for i in range(num_hands))

class Player:
	def __init__(self, name, hand):
		self.name = name
		self.hand = hand

	def play_card(self):
		"""Play a card from the player's hand"""
		card = random.choice(self.hand.cards)
		self.hand.cards.remove(card)
		print(f"{self.name}: {card!r:<3}  ", end="")
		return card

class Game:
	def __init__(self, *names):
		"""Set up the deck and deal cards to 4 players"""
		deck = Deck.create(shuffle=True)
		self.names = (list(names) + "P1 P2 P3 P4".split())[:4]
		self.hands = {
			n: Player(n, h) for n, h in zip(self.names, deck.deal(4))
		}

	def play(self):
		"""Play a card game"""
		start_player = random.choice(self.names)
		turn_order = self.player_order(start=start_player)

		# Play cards from each player's hand until empty
		while self.hands[start_player].hand.cards:
			for name in turn_order:
				self.hands[name].play_card()
			print()

	def player_order(self, start=None):
		"""Rotate player order so that start goes first"""
		if start is None:
			start = random.choice(self.names)
		start_idx = self.names.index(start)
		return self.names[start_idx:] + self.names[:start_idx]

if __name__ == "__main__":
	# Read player names from command line
	player_names = sys.argv[1:]
	game = Game(*player_names)
	game.play()

```