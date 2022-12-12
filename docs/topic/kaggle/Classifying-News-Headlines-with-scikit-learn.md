---
title: Classifying News Headlines with scikit-learn
date: 2017-03-05 09:14:46
categories:
- Python
tags:
- Python
- Kaggle
- Data Analysis
---

##### 概览
Kaggle案例学习，练习使用sklearn进行新闻的分类，主要使用了朴素贝叶斯进行分类。

##### 学习
>学习使用正则来清洗数据
>掌握sklearn准备训练集和测试集的方法[LabelEncoder， train_test_split等的使用]
>学习使用sklearn调用朴素贝叶斯算法进行分类预测

##### 代码
{% codeblock lang:python %}
    # get some libraries that will be useful
    import re
    import numpy as np # linear algebra
    import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

    # the Naive Bayes model
    from sklearn.naive_bayes import MultinomialNB
    # function to split the data for cross-validation
    from sklearn.model_selection import train_test_split
    # function for transforming documents into counts
    from sklearn.feature_extraction.text import CountVectorizer
    # function for encoding categories
    from sklearn.preprocessing import LabelEncoder


    # grab the data
    news = pd.read_csv("uci-news-aggregator.csv")

    # let's take a look at our data
    print(news.head())

    # 对新闻标题的处理


    def normalize_text(s):
        s = s.lower()

        # remove punctuation that is not word-internal (e.g., hyphens, apostrophes)
        s = re.sub('\s\W', ' ', s)
        s = re.sub('\W\s', ' ', s)

        # make sure we didn't introduce any double spaces
        s = re.sub('\s+', ' ', s)

        return s


    news['TEXT'] = [normalize_text(s) for s in news['TITLE']]
    print(news['TITLE'].head())


    # 准备训练集和测试集
    # pull the data into vectors
    vectorizer = CountVectorizer()
    x = vectorizer.fit_transform(news['TEXT'])

    encoder = LabelEncoder()
    y = encoder.fit_transform(news['CATEGORY'])

    # split into train and test sets
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

    # take a look at the shape of each of these
    print(x_train.shape)
    print(y_train.shape)
    print(x_test.shape)
    print(y_test.shape)



    # 开始预测
    nb = MultinomialNB()
    nb.fit(x_train, y_train)
    print(nb.score(x_test, y_test))



{% endcodeblock %}

#####  补充
关于正则：
{%codeblock%}

    \s       Matches any whitespace character; equivalent to [ \t\n\r\f\v] in
             bytes patterns or string patterns with the ASCII flag.
             In string patterns without the ASCII flag, it will match the whole
             range of Unicode whitespace characters.
    \S       Matches any non-whitespace character; equivalent to [^\s].
    \w       Matches any alphanumeric character; equivalent to [a-zA-Z0-9_]
             in bytes patterns or string patterns with the ASCII flag.
             In string patterns without the ASCII flag, it will match the
             range of Unicode alphanumeric characters (letters plus digits
             plus underscore).
             With LOCALE, it will match the set [0-9_] plus characters defined
             as letters for the current locale.
    \W       Matches the complement of \w.

{% endcodeblock %}



关于LabelEncoder:
{%codeblock%}
    class LabelEncoder(sklearn.base.BaseEstimator, sklearn.base.TransformerMixin)
    |  Encode labels with value between 0 and n_classes-1.
    |
    |  Read more in the :ref:`User Guide <preprocessing_targets>`.
    |
    |  Attributes
    |  ----------
    |  classes_ : array of shape (n_class,)
    |      Holds the label for each class.
    |
    |  Examples
    |  --------
    |  `LabelEncoder` can be used to normalize labels.
    |  >>> from sklearn import preprocessing
    |  >>> le = preprocessing.LabelEncoder()
    |  >>> le.fit([1, 2, 2, 6])
    |  LabelEncoder()
    |  >>> le.classes_
    |  array([1, 2, 6])
    |  >>> le.transform([1, 1, 2, 6]) #doctest: +ELLIPSIS
    |  array([0, 0, 1, 2]...)
    |  >>> le.inverse_transform([0, 0, 1, 2])
    |  array([1, 1, 2, 6])
    |
    |  It can also be used to transform non-numerical labels (as long as they are
    |  hashable and comparable) to numerical labels.
    |
    |  >>> le = preprocessing.LabelEncoder()
    |  >>> le.fit(["paris", "paris", "tokyo", "amsterdam"])
    |  LabelEncoder()
    |  >>> list(le.classes_)
    |  ['amsterdam', 'paris', 'tokyo']
    |  >>> le.transform(["tokyo", "tokyo", "paris"]) #doctest: +ELLIPSIS
    |  array([2, 2, 1]...)
    |  >>> list(le.inverse_transform([2, 2, 1]))
    |  ['tokyo', 'tokyo', 'paris']

{% endcodeblock %}

##### 参考
[*Classifying News Headlines with scikit-learn*](https://www.kaggle.com/shenxiangzhuang/d/uciml/news-aggregator-dataset/classifying-news-headlines-with-scikit-learn/editnb)

