---
title: Python抓取微信文章
date: 2017-04-04 01:03:24
categories:
- Python
tags:
- Python
- Data Analysis
---

##### 概览
涉及selenium获取cookie并用于模拟登录[这方法很强大！]
通过[清博指数](http://www.gsdata.cn/)，抓取海大夜洞表白信...
数据存取及简单可视化...


##### 实现代码
###### Get_lovelinks.py
{% codeblock lang:python %}

    '''
    selenium模拟登录清博指数后获取表白信列表页，
    并在列表页提取表白信文章标题及链接，存入csv文件
    [注意这里不登录获取不到全部的列表页，而登录涉及cookie加密，并未深入研究，直接用selenium获取cookie]
    '''

    import os
    import time
    import pandas as pd
    import requests
    import pickle
    from selenium import webdriver
    from bs4 import BeautifulSoup as bs
    from selenium.webdriver.common.desired_capabilities import DesiredCapabilities



    # selenium获取cookie, 并写入文件
    def get_cookie_from_network():
        print("Get data from selenium...")
        # 使用selenium
        dcap = dict(DesiredCapabilities.PHANTOMJS)
        dcap["phantomjs.page.settings.userAgent"] = (
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0")
        driver = webdriver.PhantomJS('/home/shensir/phantomjs-2.1.1-linux-x86_64/bin/phantomjs',
                                     desired_capabilities=dcap)
        driver.maximize_window()

        login_url = 'http://www.gsdata.cn/member/login'
        driver.get(url=login_url)
        data = driver.page_source
        # print(data)
        driver.find_element_by_xpath('/html/body/div[2]/div/form/div/p[1]/input').send_keys('登录手机号码')
        driver.find_element_by_xpath('/html/body/div[2]/div/form/div/p[2]/input').send_keys('密码')
        driver.find_element_by_xpath('/html/body/div[2]/div/form/div/p[4]/input').click()

        cookie_list = driver.get_cookies()
        # print(cookie_list)
        cookie_dict = {}
        for cookie in cookie_list:
            #写入文件
            f = open(cookie['name']+'.qingbo','wb')
            pickle.dump(cookie, f)
            f.close()
            cookie_dict[cookie['name']] = cookie['value']

        return cookie_dict



    # 从文件获取cookie
    def get_cookie_from_cache():
        print("Get cookie from cache files...")
        cookie_dict = {}
        for parent, dirnames, filenames in os.walk('./'):
            for filename in filenames:
                if filename.endswith('.qingbo'):
                    # print(filename)
                    with open(filename, 'rb') as f:
                        d = pickle.load(f)
                        cookie_dict[d['name']] = d['value']
        return cookie_dict


    # Cookie final
    def get_cookie():
        cookie_dict = get_cookie_from_cache()
        if not cookie_dict:
            cookie_dict = get_cookie_from_network()

        return cookie_dict


    # 从单个文章列表页获取表白信url
    def get_love_urls(url):

        cookdic = get_cookie()
        headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'}
        timeout = 5
        r = requests.get(url, headers=headers, cookies=cookdic, timeout=timeout)
        soup = bs(r.text, 'lxml')
        # print(soup)
        articles = soup.find('ul', {'class':'article-ul'}).find_all('li')
        # print(len(articles))
        for article in articles:
            title = article.find('h4').get_text()
            if "表白" in title:
                love_url = article.find('h4').find('a').get('href')
                print(title, love_url)
                love_titles.append(title)
                love_urls.append(str(love_url))




    if __name__=='__main__':
        # urls为所有文章列表列
        urls = ['http://www.gsdata.cn/query/article?q=hndxyd&search_field=4&post_time=0&sort=-1&read_num=0' \
                '&page={}'.format(str(i)) for i in range(1, 20)]

        love_titles = []
        love_urls = []
        for url in urls:
            time.sleep(3)   # 这里建议sleep大约2-3s， 不然网页会因为访问频繁刷出验证码
            get_love_urls(url)

        # 将表白新url数据存到文件
        love_links_file = pd.DataFrame()
        love_links_file['titles'] = love_titles
        love_links_file['urls'] = love_urls
        love_links_file.to_csv('love_links.csv', index=None)


{% endcodeblock %}



###### Get_lovedatas.py
{% codeblock lang:python %}

    '''
    通过之前获取的表白信文章标题及链接文件，爬取表白信详细信息，存入json文件
    此处不需要登录~
    '''


    '''
    2016.4.02 -- 2016.6.17 是旧的版式
    2016.6.21 -- 2017.4.03 是新的版式


    由于旧版内容较少，这里我们暂时只抓新版内容；
    以后有时间再补充旧版的抓取。

    文章有些已经被删除，注意设置容错

    尝试使用xpath, 其实不会用，，，这里完全是找规律，欢迎大家提出改进意见

    '''

    import re
    import json
    import requests
    import pandas as pd
    from lxml import etree


    # 导入表白信标题链接数据[这里转化为字典是为了方便操作，当然，之前再保存时存为json格式会更方便]
    def load_links_data():
        links_data = {}
        data = pd.read_csv('love_links.csv')
        titles = list(data['titles'])
        links = list(data['urls'])
        for i in range(len(titles)):
            links_data[titles[i]] = links[i]
        return links_data

    # 从标题（注意是之前获取的列表页的标题）获取信件数目，用于下面的xpath路径的书写
    def get_num_from_title(title):
        num = re.findall('.*?\|(\d+)封', title)[0]
        # print(num)
        return int(num)

    def get_date_from_title(title):
        date = re.findall('\\n(.*?)表白', title)
        date = list(date)[0]
        print(date)
        return date

    def get_data(title, url):
        page_data = {}
        page_data['title'] = title
        page_data['url'] = url
        page_data['envos'] = {}

        num = get_num_from_title(title)
        data = requests.get(url)
        selector = etree.HTML(data.text)

        # 表白信标题
        '''
        不会用xpath, try...and we can find some rules from different part
        And we know that the '/text()' is to get the text 
        # /html/body/div/div[2]/div[1]/div[1]/div[2]/section[1]/section[1]/section/section/section[1]/section/section/p/span
        # /html/body/div/div[2]/div[1]/div[1]/div[2]/section[2]/section[1]/section/section/section[1]/section/section/p/span
        '''
        envo_titles = []
        envo_title_paths = ['/html/body/div/div[2]/div[1]/div[1]/div[2]/section[{}]/section[1]/section/section/section[1]/section/section/p/span/text()'.format(str(i)) for i in range(1, num)]
        for envo_title_path in envo_title_paths:
            envo_title = selector.xpath(envo_title_path)
            envo_titles.append(list(envo_title)[0])
            # print(envo_title)

        # 表白信内容
        '''
        # /html/body/div/div[2]/div[1]/div[1]/div[2]/section[1]/section[1]/section/section/section[1]/section/section/section/p[2]/span
        # /html/body/div/div[2]/div[1]/div[1]/div[2]/section[2]/section[1]/section/section/section[1]/section/section/section/p[2]/span
        # /html/body/div/div[2]/div[1]/div[1]/div[2]/section[3]/section[1]/section/section/section[1]/section/section/section/p[2]/span
        '''
        envo_conts = []
        envo_cont_paths = ['/html/body/div/div[2]/div[1]/div[1]/div[2]/section[{}]/section[1]/section/section/section[1]/section/section/section/p[2]/span/text()'.format(str(i)) for i in range(1, num)]
        for envo_cont_path in envo_cont_paths:
            envo_cont = selector.xpath(envo_cont_path)
            envo_cont = list(envo_cont)[0]
            envo_conts.append(envo_cont)
            # print(envo_cont)

        for i in range(len(envo_titles)):
            page_data['envos'][envo_titles[i]] = envo_conts[i]

        return page_data


    if __name__=='__main__':
        links_data = load_links_data()
        links_title = list(links_data.keys())
        links_url = list(links_data.values())
        all_data = {}
        for link_num in range(len(links_data)):
            title = links_title[link_num]
            url = links_url[link_num]
            date = get_date_from_title(title)
            try:
                page_data = get_data(title, url)
            except:
                print(url)
                page_data = None
            all_data[date] = page_data
            print(page_data)

        # save as json format
        # all_data = json.dumps(all_data,  ensure_ascii=False)
        with open('all_data.txt', 'w', encoding='UTF-8') as f:
            json.dump(all_data, f ,ensure_ascii=False)


{% endcodeblock %}



###### Data_analysis.py
{% codeblock lang:python %}

    '''
    导入json文件进行分析
    这里仅仅进行简单的探索，大家可以仿照之前的QQ空间数据分析报告那篇文章，
    调用boson公司的ａｐｉ进行情感分析等
    '''

    import re
    import json
    from wordcloud import WordCloud
    from scipy.misc import imread
    import matplotlib.pyplot as plt
    import seaborn as sns

    with open('all_data.txt') as data_file:
        data = json.load(data_file)

    # print(data)
    data = dict(data)
    details = list(data.values())



    # 合并标题至同一列表
    whos = []
    texts = []
    for detail in details:
        if detail != None:
            page_data = detail['envos']
            who = list(page_data.keys())
            text = list(page_data.values())
            whos += who
            texts += text


    # Whos
    print("总数量： ",  len(whos))
    print(whos)

    ## 年级
    whos_text = ' '.join(str(who) for who in whos)
    rank = re.findall('.*?(\d\d).*?', whos_text)

    true_rank = []
    for i in range(len(rank)):
        if (int(rank[i])>=12) and (int(rank[i])<=16):
            true_rank.append(rank[i])

    sns.countplot(true_rank)
    plt.title('Grade')
    plt.show()

    ## reply
    reps = 0
    for who in whos:
        if '回复' in who:
            reps += 1
    print("回信数： ", reps)
    print("回信率： ", reps/len(whos))


    # What
    # print(texts)

    # 分词
    clear_texts = []
    for sentence in texts:
        sentence = sentence.replace(' ','').replace('\n', '').replace('\xa0', '')
        clear_texts += sentence
    # print(clear_texts)


    pic_path = 'heart.png'
    heart_mask = imread(pic_path)

    plt.figure(figsize=(10,10))
    wordcloud = WordCloud(background_color="white", font_path='/home/shensir/Downloads/Fonts/msyh.ttc', mask=heart_mask).generate(str(clear_texts))
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.show()

{% endcodeblock %}

输出：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Spider/wechat/grade.png)

![](http://dataimage-1252464519.costj.myqcloud.com/images/Spider/wechat/heart_wc.png)

##### 补充

>代码写的比较粗糙...不过思路还好比较清晰
>这个清博...好像提供API来着...并未深入了解


##### 参考

[网页爬虫之cookie自动获取 ](http://kekefund.com/2016/01/21/spider-cookie/)
[QQ空间数据分析报告 ](http://datahonor.com/2017/03/02/QQ%E7%A9%BA%E9%97%B4%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E6%8A%A5%E5%91%8A/)

##### 废话几句
自学Python快一年了，其中最大的快乐当真来自大家的认同。不断有朋友通过邮件，留言等方式告诉我说，为了学爬虫来的，觉得自己写的浅显易懂些，希望多更新爬虫的文章。有位大佬竟然真的从博客园，追到DATADREAM[之前的站点，不打算更了...], 再追到DATAHONOR[就是本站了...]，莫名感动...对大家的认可，真是发自内心的感激，谢谢你们的鼓励~ 曾听得曹涧秋老师讲到人活着的意义何在，说到底，三个字————被需要！那么我觉着...省略1W字 :-)
不过呢因为目前大部分时间放在cpp和数学，所以很少写爬虫了，十分抱歉~争取有时间尽量写点...
大好年华，一起努力吧！
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                      ————2017/4/4  01:40 小小白 
                                     -






