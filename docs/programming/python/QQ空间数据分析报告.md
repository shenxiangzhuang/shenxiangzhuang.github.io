---
title: QQ空间数据分析报告
date: 2017-03-02 12:42:05
categories:
- Python
tags:
- Python
- Data Analysis
---
##### 概览
 之前呢，写了[这个爬虫](http://datahonor.com/2017/03/02/Selenium%E7%88%AC%E5%8F%96QQ%E7%A9%BA%E9%97%B4%E8%AF%B4%E8%AF%B4%E4%BF%A1%E6%81%AF/#more)，从QQ邮箱导出所有QQ联系人后，在本地电脑上放养几天，经过几次refuse，还是爬完了所有的好友的说说资料。数据量约60K+， 但是NA值较多。
 
##### 数据导出
这里呢，简单作下分析。
第一步就是从MySQL中把数据以csv格式导出。

参考[这里](http://www.tech-recipes.com/rx/1475/save-mysql-query-results-into-a-text-or-csv-file/)。开始时，尝试：

{% codeblock %}
    SELECT * FROM QQSpace
    INTO OUTFILE '/home/shen/PycharmProjects/MyPython/MySpider/QQ/data.csv'
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
{% endcodeblock %}

出现权限问题：
>The MySQL server is running with the --secure-file-priv option so it cannot execute this statement

参考[这里](http://stackoverflow.com/questions/32737478/how-should-i-tackle-secure-file-priv-in-mysql)解决：
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ1.png)
之后先将文件导出到这个文件夹下，再复制到指定文件夹下：
{% codeblock %}
    cp /var/lib/mysql-files/data.csv /home/shen/PycharmProjects/MyPython/MySpider/QQ/data.csv
{% endcodeblock %}
发现文件时锁定的，在给予权限：
{% codeblock %}
    sudo chmod 777 /home/shen/PycharmProjects/MyPython/MySpider/QQ/data.csv
{% endcodeblock %}
##### 数据分析
至此，算是将数据从数据库导出，接下来开始用Python作分析

{% codeblock lang:python%}
    # 导入数据
    data = pd.read_csv('/home/shen/PycharmProjects/MyPython/MySpider/QQ/data.csv', error_bad_lines=False） # drop bad lines
    data.columns = ['Qq', 'Date', 'Content', 'Star', 'Comment']
    # 预览数据，检查有无编码等问题
    print(data.head())
    print(data.shape)
    print(data.dtypes)
    # 因当中有过测试性的抓取，所以可能存在重复数据，这里先去重
    data = data.drop_duplicates()

    # 查看缺失值
    print(data.isnull().sum())
{% endcodeblock %}

![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ2.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ3.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ4.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ5.png)

{% codeblock lang:python%}
    # 我们首先统一分析
    Date = data['Date']
    Content = data['Content']
    Star = data['Star']
    Comment = data['Comment']
{% endcodeblock %}

  日期的分析：
{% codeblock lang:python%}
    # Date
    Date = pd.DataFrame(Date)
    print(Date.shape[0])
    Date.isnull().sum()
    Date  = Date.dropna()
    # 对日期的处理，定义统一格式的函数
    '''
    2016年09月09日
    2017年1月1日
    昨天18:03  这种格式一般为最近几天，数量较少，暂时忽略不去处理
    '''
    def datesplit(date):
        try:
            year = date.split('年')[0]

            month = date.split('年')[1].split('月')[0]
            if ((int(month) < 10) & ('0' not in month)):
                month = '0' + month

            day = date.split('年')[1].split('月')[1].replace('日', '')
            if ((int(day) < 10) & ('0' not in day)):
                day = '0' + day
            sdate = int(int(year)*10000+int(month)*100+int(day))
        except:
            # print(date)
            return [None, None, None, None]
        return [year, month, day, sdate]


    Date['Year'] = Date['Date'].apply(datesplit).apply(lambda x : x[0])
    Date['Month'] = Date['Date'].apply(datesplit).apply(lambda x : x[1])
    Date['Day'] = Date['Date'].apply(datesplit).apply(lambda x : x[2])
    Date['SDate'] = Date['Date'].apply(datesplit).apply(lambda x : x[3])

    Date = Date.dropna()  # 去除废弃时间格式的数据
    Date['SDate'] = Date['SDate'].astype(int)
    print(Date.head())
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ6.png)

{% codeblock lang:python%}
    Date['Date'] = pd.to_datetime(Date['SDate'], format='%Y%m%d')  # 格式化为标准时间格式
    del Date['SDate'] # 删掉无用列
    print(Date.head())
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ7.png)

{% codeblock lang:python%}
    # Year,Month, Day
    sns.countplot('Year', data=Date)
    plt.show()

    sns.countplot('Month', data=Date)
    plt.show()

    sns.countplot('Day', data=Date)
    plt.show()
{% endcodeblock %}
从年份看，还是很平均的，因为2017时刚开始，数据本来就是很少的。至于2010前比较少，可能和大部分人喜欢删之前的说说有关.
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ8.png)

  月份上，7，8月比较高，猜测和之前在博客园写的超级课程表的分析时原因类似的，就是，7，8月为暑假，大家对学习关注较少，而游玩的较多，所以经常会发些旅游的动态。或是在家里闲得无聊，发说说也会比较多。

至于3,4,5月份数量较少[闰年二月天数少的影响在此可忽略]，就不太明白了，沉迷学习？ 🙂 
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ9.png)
天数上看，大家还是“风雨无阻”的，31少也是必然的，毕竟1，3，5，7。。。 	
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ10.png)

看了上面的图感觉都很平均的orz...
这里附上一张超级课程表分析时的一张图:
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ11.png)
与之比较，我们重新将月份整理为折线图：

{% codeblock lang:python%}
    # 与超级课程表相比较
    plt.plot(Date.groupby('Month').size(), linestyle='-')
    plt.xlim(xmin=1)
    plt.grid()
    plt.title('Month')
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ12.png)

貌似有点类似负相关的关系哦...
当我尝试进行年份[根据以上分析选取12-16年数据]比较时，发现了一个问题：没有出现预期的走势一致性.
{% codeblock lang:python%}
    # 各个年份的比较[12-16]
    plt.plot(Date[Date['Year']== '2012'].groupby('Month').size()/Date[Date['Year']== '2012'].shape[0], label='2012')
    plt.plot(Date[Date['Year']== '2013'].groupby('Month').size()/Date[Date['Year']== '2013'].shape[0], label='2013')
    plt.plot(Date[Date['Year']== '2014'].groupby('Month').size()/Date[Date['Year']== '2014'].shape[0], label='2014')
    plt.plot(Date[Date['Year']== '2015'].groupby('Month').size()/Date[Date['Year']== '2015'].shape[0], label='2015') 
    plt.plot(Date[Date['Year']== '2016'].groupby('Month').size()/Date[Date['Year']== '2016'].shape[0], label='2016')
    plt.legend()
    plt.grid()
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ13.png)

 这张图有些乱，我们分开来做图，先做12-14年的： 
{% codeblock lang:python%}
    plt.plot(Date[Date['Year']== '2012'].groupby('Month').size()/Date[Date['Year']== '2012'].shape[0], label='2012')
    plt.plot(Date[Date['Year']== '2013'].groupby('Month').size()/Date[Date['Year']== '2013'].shape[0], label='2013')
    plt.plot(Date[Date['Year']== '2014'].groupby('Month').size()/Date[Date['Year']== '2014'].shape[0], label='2014')
    plt.legend()
    plt.grid()
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ14.png)
可以看到，12-14年走势基本上是一致的，但是14年出现较大的不同。
再作出14-16的图看下：
{% codeblock lang:python%}
    plt.plot(Date[Date['Year']== '2014'].groupby('Month').size()/Date[Date['Year']== '2014'].shape[0], label='2014')
    plt.plot(Date[Date['Year']== '2015'].groupby('Month').size()/Date[Date['Year']== '2015'].shape[0], label='2015') 
    plt.plot(Date[Date['Year']== '2016'].groupby('Month').size()/Date[Date['Year']== '2016'].shape[0], label='2016')
    plt.legend()
    plt.grid()
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ15.png)
看到变化更大了，15尚且出现较大的峰值，到了16年，竟然变得近似平稳了...16年似乎欠我们个峰值...仔细想下，这可能和微信的崛起有关。查了下[资料](http://mt.sohu.com/20150723/n417406422.shtml)，14年春晚使用微信红包后微信开始迅速崛起，并于15年强势和QQ抗衡，并且微信发展速度明显超越QQ。所以16年QQ空间欠我们的峰值，可能跑去了微信朋友圈orz...
继续分析，我们来看下，一年中哪些特别的峰值。 

{% codeblock lang:python%}
    # 一年中的特特殊的日子
    plt.figure(figsize=(20,6))
    plt.subplot(131)
    plt.plot(Date[Date['Year']=='2012'].groupby('Date').size())
    plt.xticks(rotation=70)


    plt.subplot(132)
    plt.plot(Date[Date['Year']=='2013'].groupby('Date').size())
    plt.xticks(rotation=70)


    plt.subplot(133)
    plt.plot(Date[Date['Year']=='2014'].groupby('Date').size())
    plt.xticks(rotation=70)


    plt.grid()
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ16.png)

可以看到，2月初到中旬的情人节，暑假开始7月，开学季9月，国庆节10月都或多或少出现一些峰值[可能是爬虫漏爬的问题，这里不是特别明显]

接下来分析说说的文本内容。
{% codeblock lang:python%}
    # 动态内容，文本分析
    Content = pd.DataFrame(Content.astype(str))
    Content.columns = ['content']

    # 说说长度
    Content['length'] = Content['content'].apply(len)
    # 大体观察，看有无异常值
    plt.plot(Content['length'])
    plt.show()
    # 发现一个异常值，去除异常值并填充
    Content['length'][Content['length'] > 1000] = Content['length'].mean()
    # 再次观察
    plt.plot(Content['length'])
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ17.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ18.png)

{% codeblock lang:python%}
    # 上图仅仅是为了观察异常值，这里我们具体观察说说长度
    # 取长度在4倍标准差之内的数据
    ctmean = Content['length'].mean()
    ctstd = Content['length'].std()
    foursigma = Content[(ctmean-4*ctstd<Content['length']) & (Content['length']<ctmean+4*ctstd)]
    plt.hist(foursigma['length'])
    plt.grid()
    plt.title('Length')
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ19.png)

可以看到，大部分的说说都是不超过50字的...这才是典型的快餐文化嘛:-)

接着我们来做个简单的情感分析，通过调用Boson公司的API

{% codeblock lang:python%}
    # 之前没考虑到根据QQ号来分类，这里重新获取
    Content = data[['Qq', 'Content']]
    Content = Content.dropna()


    print(Content['Qq'].unique())
    # 发现有些QQ号被误填为其他文字，用相邻[上一个]QQ号填充
    for i in range(len(Content['Qq']).index):
        try:
            Content['Qq'].loc[Content['Qq'].index[i]] = int(Content['Qq'].loc[Content['Qq'].index[i]])
        except:

            Content['Qq'].loc[Content['Qq'].index[i]] = int(Content['Qq'].loc[Content['Qq'].index[i-1]])

    print(Content['Qq'].unique())
{% endcodeblock %}


{% codeblock lang:python%}
    # 情感分析
    emotion = {}
    nlp = BosonNLP('你的密钥')   

    qq_cont = (Content.groupby('Qq')['Content'])
    for i in range(len(qq_cont)):
        qq = list(Content.groupby('Qq')['Content'])[i][0]
        contents = list(list(Content.groupby('Qq')['Content'])[i][1])
        text = ''
        for content in contents:
            text += content

        grade = nlp.sentiment(text)[0]
        emotion[str(qq)] = grade
        print(grade)


    # 正面，负面情绪 
    positive = []
    negative = []
    for e in emotion.values():
        positive.append(e[0])
        negative.append(e[1])
{% endcodeblock %}

简单的可视化：
{% codeblock lang:python%}
    p1 = plt.subplot(121)
    plt.hist(positive)
    p1.set_title('Positive')

    p2 = plt.subplot(122)
    plt.hist(negative)
    p2.set_title('Negative')
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ20.png)
{% codeblock lang:python %}
    from matplotlib.colors import LogNorm

    plt.hist2d(positive, negative, norm=LogNorm())
    plt.xlabel('Positive')
    plt.ylabel('Negative')
    plt.title('Emotion', fontweight='bold')
    plt.colorbar()
    plt.show()

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ21.png)

哈哈，还是开心看到大家都是非常乐观的:-)

继续，我们来提取下关键词。
{% codeblock lang:python%}
    # 关键词提取
    WeightWord = {}
    KEYWORDS_URL = 'http://api.bosonnlp.com/keywords/analysis'

    for cont in ContentDict.values():
        text = cont
        params = {'top_k': 5}
        data = json.dumps(text)
        headers = {'X-Token': '你的密钥'}
        print('requesting...')
        try:
            resp = requests.post(KEYWORDS_URL, headers=headers, params=params, data=data.encode('utf-8'), timeout=5)
            print(resp.json())
            for weight, word in resp.json():
                if word not in WeightWord.keys():
                    WeightWord[word] = weight
                else:
                    print('Hit...')
                    WeightWord[word] += weight
        except:
            pass
            
    # 关键词排序
    SortedValue = [v for v in sorted(WeightWord.values())]
    ValueWord = {}
    for key, value in WeightWord.items():
        ValueWord[str(value)] = key

    SortedValue_top100 = SortedValue[-100:][::-1]
    SortedWord = [ValueWord[str(k)] for k in SortedValue_top100]

{% endcodeblock %}

![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ22.png)

这是用Boson公司的API做的，我们接下来用结巴分词并用wordcloud做个词云看看吧:-)[参考[这里](https://www.oschina.net/code/snippet_2294527_56155)]

我这里用的Ubuntu16.04，没有中文字体，安装字体参考[这里](http://blog.csdn.net/up_com/article/details/51218458)。 

{% codeblock lang:python%}
    # 关键词词云
    import jieba
    from wordcloud import WordCloud
    from scipy.misc import imread

    mylist = list(ContentDict.values())   

    word_list = [" ".join(jieba.cut(sentence)) for sentence in mylist]
    new_text = ' '.join(word_list)


    pic_path = '/home/shen/CLionProjects/MyCv/QQ.jpg'
    mang_mask = imread(pic_path)

    plt.figure(figsize=(12,12))
    wordcloud = WordCloud(background_color="white", font_path='/home/shen/Downloads/font/msyh.ttc', mask=mang_mask).generate(new_text)
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.show()
{% endcodeblock %}]
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ23.png)
嗯，这张图用了QQ图标做的mask,还是挺有意思的。

那么，我们接下来分析下说说关注的话题看看。 

{% codeblock lang:python%}
    # 说说文本分类
    CLASSIFY_URL = 'http://api.bosonnlp.com/classify/analysis'
    TextClass = []

    for i in range(len(mylist)):
        try:
            data = json.dumps(mylist[i])
            headers = {'X-Token': '你的密钥'}
            resp = requests.post(CLASSIFY_URL, headers=headers, data=data.encode('utf-8'))

            print(resp.text[1])
            TextClass.append(int(resp.text[1]))
        except:
            pass

    from collections import Counter
    ClassCount = Counter(TextClass)
    print(ClassCount)
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ24.png)
Boson给定的参照表为：
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ25.png)

我们简单做个可视化： ~
{% codeblock lang:python%}
    dfclass = pd.DataFrame(TextClass)
    sns.countplot(0, data=dfclass)
    plt.xticks((0,1,2,3,4,5,6), ('Physical', 'Education', 'Society', 'Entertainment', 'Domestic', 'Technology', 'Estate'), rotation=70)
    plt.xlabel('')
    plt.title('Class', fontsize=16)
    plt.grid()
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ26.png)

嗯，同学们和大佬们还是学习的比较多:-)
于我的好友来说，确实是关注教育，娱乐，科技多一点的，看来Boson的API还是挺好用的。
数据集里面还有点赞数和评论数，我们先从点赞数分析。

{% codeblock lang:python%}
    print(Star.shape)
    print(Star.isnull().sum())
{% endcodeblock %}
输出：
>(48822, )
>51

{% codeblock lang:python%}
    # 去除缺失值
    Star = pd.DataFrame(Star.dropna())
    Star.columns = Star['star']

    # 去除Star里面的异常值
    for i in Star['star'].index:
        try:
            Star['star'].loc[i] = int(Star['star'].loc[i])
        except:
            print(Star['star'].loc[i])
            Star['star'].loc[i] = None


    print(Star.isnull().sum())
    Star = pd.DataFrame(Star.dropna())

    # 有些赞数是来自转发的，一般较多，我们这里将这种情况去除
    Star = Star[(Star['star'].apply(int) < 200)]
    print(Star.shape)

    # 作图
    plt.hist(list(Star['star']), bins=20)
    plt.grid()
    plt.title('Star')
    plt.show()

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ27.png)

相同地，接下来是评论数的分析：
{% codeblock lang:python%}
    # 评论数分析[与点赞分析基本一致]
    print(Comment.shape)
    print(Comment.isnull().sum())

    # 去除缺失值
    Comment = pd.DataFrame(Comment.dropna())
    Comment.columns = ['Comment']

    # 去除Comment里面的异常值
    for i in Comment['Comment'].index:
        try:
            Comment['Comment'].loc[i] = int(Comment['Comment'].loc[i])
        except:
            print(Comment['Comment'].loc[i])
            Comment['Comment'].loc[i] = None


    print(Comment.isnull().sum())
    Comment = pd.DataFrame(Comment.dropna())

    # 有些评论是来自转发的，一般较多，我们这里将这种情况去除
    Comment = Comment[(Comment['Comment'].apply(int) < 100)]
    print(Comment.shape)

    # 作图
    plt.hist(list(Comment['Comment']), bins=20)
    plt.grid()
    plt.title('Comment')
    plt.show()
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/QQ/QQ28.png)






