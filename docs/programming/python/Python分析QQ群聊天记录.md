---
title: Python分析QQ群聊天记录
date: 2017-03-02 01:20:35
categories:
- Python
tags:
- Python
- 正则
---
##### Overview
之前，写了[这篇文章](http://www.cnblogs.com/buzhizhitong/p/5701299.html)，用python提取全部群成员的发言时间，并简单做了下分析。先补充一下，针对特定单个群成员（这里以  小小白   为例）消息记录的获取。代码比较简单，主要是正则表达式的书写。（附：聊天文件记录的导出请参考上面提到的文章）


##### Code
这里有两个版本的，前面的比较简单，后面的一个实现了自动化提取做图。
###### Version1.0
{% codeblock lang:python %}
    #2016/9/14
    #从QQ聊天数据导出特定人发言的日期时间和发言内容

    import re
    import xlsxwriter

    # 小小白   这里代指你要获取数据的对象的昵称
    # 方便起见，见数据导出的文件名也明明为此
    workbook = xlsxwriter.Workbook('小小白.xlsx')
    worksheet = workbook.add_worksheet()
    worksheet.set_column('A:A', 5)
    worksheet.set_column('B:B', 10)
    worksheet.set_column('C:C', 200)

    with open('高等数学.txt',encoding='utf-8') as f:
        s = f.read()
        # 正则，跨行匹配
        pa = re.compile(r'^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) 小小白\(小小白的QQ号\)\n(.*?)\n$',re.DOTALL+re.MULTILINE)
        ma = re.findall(pa,s)
        # print(len(ma))
        for i in range(len(ma)):
            # print(ma[i][0])
            date = ma[i][0]
            time = ma[i][1]
            word = ma[i][2]

            worksheet.write(int(i),0,date)
            worksheet.write(int(i),1,time)
            worksheet.write(int(i),2,word)

        workbook.close()
        print("处理完毕，快去看看文件夹下面新建的.xlsx文件吧")

{% endcodeblock %}


###### Version2.0
{% codeblock lang:python %}
    import re
    import matplotlib.pyplot as plt


    # 解决matplotlib显示中文的问题
    import matplotlib as mpl
    mpl.rcParams["font.sans-serif"] = ["Microsoft YaHei"]
    mpl.rcParams['axes.unicode_minus'] = False


    # 获取24个时间段----->periods
    # 用于之后时间的分段
    def get_periods():
        periods = []
        for i in range(0,24):
            # 这里的判断用于将类似的‘8’ 转化为 ‘08’ 便于和导出数据匹配
            if i < 10:
                i = '0'+str(i)
            else:
                i = str(i)
            periods.append(i)
        return periods

    '''
    对QQ群而言的时间提取

    # 获取聊天文件的“小时”数据
    def get_times(filename):
        with open(filename, encoding='utf-8') as f:
            data = f.read()
            # 例如20:50:52，要匹配其中的20
            pa = re.compile(r"(\d\d):\d\d:\d\d")
            times = re.findall(pa, data)

        return times
    '''


    # 对每一个时间段进行计数
    def classification(times,period):
        num = 0
        for time in times:
            if time == period:
                num += 1
        period_time.append([period,num])
        # print(period, '--->', num)


    # 作图

    def plot_time(period_time,name):
        time = []
        num  = []
        for i in period_time:
            time.append(i[0])
            num.append(i[1])
        time = time[6:24]+time[0:6]
        num = num[6:24]+num[0:6]
        # print(time,'\n',num)
        labels = time
        x = [i for i in range(0,24)]
        plt.plot(num, 'g')
        num_max = max(num)
        plt.xticks(x,labels)
        plt.axis([00, 24, 0, num_max*(1.2)])
        plt.grid(True)
        plt.title(name)
        plt.ylabel('发言量')
        plt.xlabel('时间')
        plt.show()

    def get_person_data(filename,name,qqnumber):
        person_data = {'date':[],'time':[],'word':[]}
        with open(filename,encoding='utf-8') as f:
            s = f.read()
            # 正则，跨行匹配
            pa = re.compile(r'^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) '+name+r'\('+qqnumber+'\)\n(.*?)\n$',re.DOTALL+re.MULTILINE)
            ma = re.findall(pa,s)
            # print(len(ma))
            for i in range(len(ma)):
                # print(ma[i][0])
                date = ma[i][0]
                time = ma[i][1]
                word = ma[i][2]
                person_data['date'].append(date)
                person_data['time'].append(time[0:2])
                person_data['word'].append(word)
        return person_data


    if __name__=="__main__":
        filename = input('请输入聊天记录文件名：')
        name = input('准备提取个人信息就绪，请输入要提取人的群名片：')
        qqnumber = input('请输入要提取人的QQ号：')
        period_time = []
        person_data = get_person_data(filename,name,qqnumber)
        times = person_data['time']

        periods = get_periods()
        for period in periods:
            classification(times,period)
        plot_time(period_time,name)
        # print(person_data['word'])

{% endcodeblock %}
输出：
![](http://images2015.cnblogs.com/blog/980075/201610/980075-20161018105033451-390495188.png)

##### Supplement
>关于Windows下，matplotlib中文显示的问题，参考我之前的[这篇文章](http://www.cnblogs.com/buzhizhitong/p/5759304.html)。
至于Ubuntu下，还未去处理，之后有时间补充。


