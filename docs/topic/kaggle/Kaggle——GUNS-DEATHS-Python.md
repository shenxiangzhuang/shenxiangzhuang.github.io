---
title: 'Kaggle——GUNS-DEATHS[Python]'
date: 2017-03-02 13:23:07
categories:
- Python
tags:
- Python
- Kaggle
- Data Analysis
---

Kaggle案例二——Guns Deaths——Python分析

数据集的理解：
>Our data has almost 101,000 rows (gun death incidents) and 10 columns (categories).
Here's an explanation of each column:
    this is an identifier column, which contains the row number. It's common in CSV files to include a unique identifier for each row, but we can ignore it in this analysis.
    year: the year in which the fatality occurred.
    month: the month in which the fatality occurred.
    intent: the intent of the perpetrator of the crime. This can be Suicide, Accidental, NA, Homicide, or Undetermined.
    police: whether a police officer was involved with the shooting. Either 0 (false) or 1 (true).
    sex: the gender of the victim. Either M or F.
    age: the age of the victim.
    race: the race of the victim. Either Asian/Pacific Islander, Native American/Native Alaskan, Black, Hispanic, or White.
    hispanic: a code indicating the Hispanic origin of the victim.
    place: where the shooting occurred. Has several categories, which you're encouraged to explore on your own.
    education: educational status of the victim. Can be one of the following:
        1: Less than High School
        2: Graduated from High School or equivalent
        3: Some College
        4: At least graduated from College
        5: Not available
It's good practice to get to know our data set before begining to analyze. 

###### 导入数据，清洗并熟悉数据 
{% codeblock lang:python %}
    import pandas as pd
    import numpy as np

    '''
    1. Importing, cleaning and getting familiar with the data
    '''

    # 导入数据，[为了可读性和易操作性]简单处理，预览数据
    guns = pd.read_csv('guns.csv', index_col = 0)
    print(guns.shape)
    print(guns.head())
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/1.png)

{% codeblock lang:python %}

    guns.index.name = 'Index'
    # for readability and concistency - capitalizing column names
    guns.columns = map(str.capitalize, guns.columns)
    print(guns.head())
    
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/2.png)

{% codeblock lang:python %}

    # 总体观察数据
    print(guns.info())  # 总体信息
    print(guns.dtypes)  # 变量类型
    # print(guns.describe)  # 数值型变量的一些分=分位数等信息

    # 缺失值的处理[这里开始竟然忘了。。。]
    print(guns.notnull().sum())

    # In order to see the percentage of valid data:
    print(guns.notnull().sum() * 100.0/guns.shape[0])

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/3.png)

{% codeblock lang:python %}

    # Organizing the data by a column value: first by the year, then by month:
    guns.sort_values(['Year', 'Month'], inplace=True)
    print(guns.head(10))

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/4.png)


###### 探索并分析数据 

{% codeblock lang:python %}

    '''
    2. Exploring and analyzing the data [这里我们关注的时Intent]
    '''
    print(guns.Intent.value_counts(ascending=False))
    # Looking at the normalized values makes the picture clearer.
    # Note: 'normalize=False' excludes the 'NaN's where here it includes them
    print(guns.Intent.value_counts(ascending=False, dropna=False, normalize=True))
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/5.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/55.png)


{% codeblock lang:python %}

    # 数值型变量的[分位数]描述
    cols = ['Education', 'Age']
    for col in cols:
        print(col, ':')
        print(guns[col][guns[col].notnull()].describe())
        print('-'*20 + '\n')

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/6.png)

{% codeblock lang:python %}
    # 更多分位数的数据
    percentiles = np.arange(0.1, 1.1, 0.1)
    for col in cols:
        print(col, ':')
        print(guns[col][guns[col].notnull()].describe(percentiles=percentiles))
        print('-'*20, '\n')
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/7.png)

{% codeblock lang:python %}

    # Education
    # Age < 16 数据[关于教育]的处理
    print(guns[guns['Age'] < 16].shape)
    print(guns[guns['Age'] < 16].head())

    index_temp = guns[(guns['Age'] < 16) & ((guns['Education'].isnull()) | (guns['Education'] == 5.0))].index
    guns.loc[index_temp, 'Education'] = 1.0
    print(guns[guns.Education.isnull()].shape)

    index_temp = guns[guns.Age < 5].index
    guns.loc[index_temp, 'Education'] = 0.0
    print(guns['Education'][guns.Education.notnull()].describe())

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/8.png)


{% codeblock lang:python %}

    # Let's get rid of rows that has '5.0' (Not available) and NaN in the 'education' column:
    # subset = can include a list of column names
    guns.dropna(inplace=True)
    guns = guns[guns.Education != 5.0]

    print(guns.Education.value_counts())

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/9.png)

{% codeblock lang:python %}

    for col in guns.columns:
        if col not in ['Age', '']:
            print(guns[col].unique())

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/10.png)



{% codeblock lang:python %}

    # 一些实用的处理技巧
    # Year Month
    # evaluating the percentage change between years
    n2012 = guns[2012 == guns['Year']].shape[0]
    (guns.Year.value_counts(sort=False) - n2012) * 100./ n2012    


    nexpected_month = guns.shape[0]/12.
    (guns.Month.value_counts(sort=True) - nexpected_month) * 100./nexpected_month        

    guns.sort_values(['Year', 'Month'], inplace=True)


{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/11.png)

{% codeblock lang:python %}
    # 上面简单通过月份看死亡率不太严谨，接下来考虑闰年和特殊月份天数问题
    import datetime
    # The purpose of *10000 and the *100 are to convert 2012, 01, 01 into 20120101 for readability
    guns['Date'] = pd.to_datetime((guns.Year * 10000 + guns.Month * 100 + 1).apply(str),format='%Y%m%d')
    guns.dtypes.tail(1)
    # 删除无用的变量，简化数据集[这里Date的引入与在Titanic上对于family的处理是一样的]
    del guns['Year']
    del guns['Month']

    import calendar
    monthly_rates = pd.DataFrame(guns.groupby('Date').size(), columns=['Count'])
    monthly_rates.index.to_datetime
    print(monthly_rates.index.dtype)
    print(monthly_rates.shape)
    monthly_rates.head()

    # 计算新列 Days_per_month
    days_per_month = []
    for val in monthly_rates.index:
        days_per_month.append(calendar.monthrange(val.year, val.month)[1])
    monthly_rates['Days_per_month'] = days_per_month
    monthly_rates.head()

    # 'Averahe_per_day' 代表各年各月份，平均每天死于gun的人数
    monthly_rates['Average_per_day'] = monthly_rates['Count']*1./monthly_rates['Days_per_month']
    print(monthly_rates.shape)
    monthly_rates.tail()

    # 求三年的平均值
    month_rate_dict = {}
    for i in range(1,13):
        bool_temp = monthly_rates.index.month == i
        month_average = (sum(monthly_rates.loc[bool_temp, 'Average_per_day']))/3.
        month_rate_dict[i] = month_average

    avg_month_rate = pd.DataFrame.from_dict(list(month_rate_dict.items()))
    avg_month_rate.columns = ['Month', 'Value']


    # calculating the expected cases for each day [+1. becuase 2012 was a leap year]
    nexpected_day = guns.shape[0]/(365*3 + 1.)

    avg_month_rate['Percent_change'] = (avg_month_rate.Value - nexpected_day) * 100./ nexpected_day
    print(avg_month_rate.sort('Percent_change'))

    # Police
    # 删除无用列[数据无有效的信息]
    print(100 * guns.Police.value_counts(normalize=True))
    del guns['Police']
    print(guns.shape)
    print(guns.head())
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/12.png)


{% codeblock lang:python %}
    # Race
    print(guns.Race.value_counts(sort=True, normalize=True))
    # Question: Which race appears the most in the df and which appears the least?
    '''
    这里的细节值得注意，我们不能因为看到White的case比如较多就认为死于gun的人当中White就最多，
    正如答案所言，在不知道总体人种比例时，我们不能妄下论断
    '''
    # Answer: We can not conclude anything by those numbers unless we take in account the distribution of races in the US population.


    # 一些技巧
    # About Sample
    # a sample of about 10% of the data may look like this:
    sample_guns = guns.sample(n=10000)
    sample_guns.head()

    # How do you define a categorical columns/pd.Series? 
    # E.g please order guns['intent'] by this order: 'Homicide','Suicide','Accidental','Undetermined'

    list_ordered = ['Homicide','Suicide','Accidental','Undetermined']
    guns['Intent'] = guns['Intent'].astype('category')
    guns.Intent.cat.set_categories(list_ordered, inplace=True)
    guns.sort_values(['Intent']).head()

    # 这里Undeterminded对预测Intent无太大作用，删除
    guns = guns[guns.Intent != 'Undetermined']
    guns.Intent.value_counts()

    # removing last value in list ordered - which is 'Undetermined'
    list_ordered = list_ordered[:-1]
    guns.Intent.cat.set_categories(list_ordered, inplace=True)
    guns.Intent.value_counts()

    # **Question:** Given a Series which contains strings, how do you find the length of each of the strings?
    guns.Race.str.len().unique()

    # **Question:** For the same series, how do you know if any given entry contains a string segment. E.g: Which entries int the 'intent' column contain the segment 'cide'?
    guns.Intent.str.contains('cide').sum()

{% endcodeblock %}


###### 数据可视化


![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/13.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/14.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/15.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/16.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/17.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/18.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/19.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/20.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/21.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/guns/22.png)



{% codeblock lang:python %}
    '''
    3. Visualizing the data 
    '''
    # Line Charts / Time analysis
    import matplotlib.pyplot as plt
    import seaborn as sns
    sns.set(style='white', color_codes=True)

    # 2012
    plt.plot(monthly_rates.index[:12], monthly_rates['Count'][:12], 
             linestyle='--', linewidth=3., alpha=0.6)
    plt.xticks(rotation=70)
    plt.tick_params(axis='both', which='both',length=0)
    plt.show()


    # notice the y column in the previous plot begins at 2200; 

    # Let's look at the real picture from 0 

    plt.plot(monthly_rates.index[:12], monthly_rates['Count'][:12],

            linestyle='--', linewidth=3., alpha=0.6)

    plt.xticks(rotation=70)

    plt.ylim(ymin=0, ymax=3500)

    plt.tick_params(axis='both', which='both',length=0)

    plt.xlabel('Month', fontsize=14)

    plt.ylabel('Gun Deaths\ncount', fontsize=14)

    plt.title('Monthly Gun Death Count in the US, 2012', fontsize=14, fontweight='bold')

    sns.despine()

    plt.show()




    # years 2012 - 2014

    # Changing linestyle to a constant line = seeing intersections more clearly

    fig = plt.figure()

    plt.plot(monthly_rates.index.month[0:12], monthly_rates['Count'][0:12], label='2012',

            linestyle='-', linewidth=2., alpha=0.8)

    plt.plot(monthly_rates.index.month[12:24], monthly_rates['Count'][12:24], label='2013',

            linestyle='-', linewidth=2., alpha=0.8, color='r')

    plt.plot(monthly_rates.index.month[24:36], monthly_rates['Count'][24:36], label='2014',

            linestyle='-', linewidth=2., alpha=0.8, color='g')

    plt.xlim(xmin=1, xmax=12)

    plt.ylim(ymax=max(monthly_rates['Count'])+100)

    plt.tick_params(axis='both', which='both',length=0)

    plt.xticks(np.arange(1, 13, 1))

    plt.legend(loc='upper left', frameon=False)

    plt.xlabel('Month', fontsize=14)

    plt.ylabel('Gun Death\nCount', fontsize=14)

    plt.title('Monthly Gun Death Count in the US: 2012-2014', fontsize=14, fontweight='bold')

    sns.despine()

    plt.show()



    # From zero
    fig = plt.figure(figsize=(10,6))

    colors = ['b', 'r', 'g']
    labels = ['2012', '2013', '2014']

    for i in range(len(labels)):
        start_index = i*12
        end_index = (i+1)*12
        subset = monthly_rates[start_index:end_index]
        plt.plot(subset.index.month, subset['Count'], color=colors[i], label=labels[i],
                linestyle='-', linewidth=2., alpha=0.6)

    plt.xlim(xmin=1, xmax=12)
    plt.ylim(ymin=0, ymax=max(monthly_rates['Count'])+100)
    plt.tick_params(axis='both', which='both',length=0)
    plt.xticks(np.arange(1, 13, 1))
    plt.legend(loc='center right', frameon=False)
    plt.xlabel('Month', fontsize=14)
    plt.ylabel('Number of Gun Death Count', fontsize=14)
    plt.title('Monthly Gun Death Count in the US: 2012-2014', fontsize=14, fontweight='bold')
    sns.despine()
    plt.show()


    # Bar plot
    intent_sex = guns.groupby(['Intent', 'Sex'])['Intent'].count().unstack('Sex')
    ax = intent_sex.plot(kind='bar', stacked=True, alpha=0.7)
    ax.set_xlabel('Intent', fontsize=14)
    ax.set_ylabel('Count', fontsize=14)
    plt.xticks(rotation=0)
    plt.tick_params(axis='both', which='both',length=0)
    ax.legend(labels=['Female', 'Male'], frameon=False, loc=0)
    plt.title('Gender distribution\nGun Deaths US: 2012-2014', fontsize=14, fontweight='bold')
    sns.despine()
    plt.show()


    # 一个不太好的图
    intent_edu = guns.groupby(['Intent', 'Education'])['Intent'].count().unstack('Education')
    # creating a range of 5 colors - from light to dark
    edu_legend_labels = ['Less than\nElementry school','Less than \nHigh School', 'Graduated from\nHigh School\nor equivalent', 
                     'Some College', 'At least\ngraduated\nfrom College']
    colors = plt.cm.GnBu(np.linspace(0, 1, 5))
    ax = intent_edu.plot(kind='bar', stacked=True, color=colors, width=0.5, alpha=0.6)
    plt.xticks(rotation=0)
    ax.set_xlabel('Intent', fontsize=14)
    ax.set_ylabel('Count', fontsize=14)
    plt.tick_params(axis='both', which='both',length=0)
    ax.legend(edu_legend_labels, ncol=1, frameon=False, prop={'size':10}, loc=0)
    plt.ylim(ymin=0, ymax=90000)
    plt.title('Education distribution\n in Gun Deaths US: 2012-2014', fontsize=14, fontweight='bold')
    sns.despine()
    plt.show()

    # 上图略显拥挤，我们用下面的水平图的进行改进
    intent_edu = guns.groupby(['Intent', 'Education'])['Intent'].count().unstack('Education')
    ax = intent_edu.plot(kind='barh', figsize=(15,6), stacked=True, color=colors, alpha=0.6)
    ax.set_xlabel('Count', fontsize=20)
    ax.set_ylabel('Intent', fontsize=20)
    ax.legend(edu_legend_labels, loc=0,  prop={'size':12}, frameon=False)
    plt.xlim(xmin=0, xmax=80000)
    plt.tick_params(axis='both', which='both',length=0)
    plt.title('Education distribution\nin Gun Deaths US: 2012-2014', fontsize=20, fontweight='bold')
    sns.despine()
    plt.show()



    # the percentage visual is more informative
    education = pd.crosstab(guns.Education, guns.Intent)
    education.div(education.sum(1).astype(float), axis=0).plot(kind='bar', stacked=True, alpha=0.6)
    plt.title('Intent Percentage by Education')
    plt.xlabel('Education level')
    plt.ylabel('Percentage')
    plt.legend(loc='upper center', bbox_to_anchor=(1.1,0.9))
    sns.despine()


    # Place
    intent_place = guns.groupby(['Intent', 'Place'])['Intent'].count().unstack('Place')

    colors = plt.cm.GnBu(np.linspace(0, 2, 20))

    ax = intent_place.plot(kind='barh', stacked=True, color=colors, alpha=0.8)

    ax.set_xlabel('Count', fontsize=14)

    ax.set_ylabel('Intent', fontsize=14)

    plt.tick_params(axis='both', which='both', length=0)

    ax.legend(loc=0, ncol=2, prop={'size':10}, frameon=False)

    plt.title('Location distribution\nin Gun Deaths US: 2012-2014', fontsize=14, fontweight='bold')

    sns.despine()

    plt.show()


    # 归类的思想
    #These are too many categories and it's hard to arrive to conclusions
    # let's merge 'street' with 'trade/service area' and the rest to 'Other'
    index_temp = guns[(guns['Place'] == 'Trade/service area') | (guns.Place == 'Industrial/construction')].index
    guns.loc[index_temp, 'Place'] = 'Street'
    index_temp = guns[(guns['Place'] != 'Street') & (guns.Place != 'Home')].index
    guns.loc[index_temp, 'Place'] = 'Other'

    guns.Place.value_counts()

    # Let's take another look:
    intent_place = guns.groupby(['Intent', 'Place'])['Intent'].count().unstack('Place')
    colors = plt.cm.GnBu(np.linspace(0,2,6))
    ax = intent_place.plot(kind='barh', stacked=True, color=colors, alpha=0.6)
    ax.set_xlabel('Count', fontsize=14)
    ax.set_ylabel('Intent', fontsize=14)
    plt.tick_params(axis='both', which='both',length=0)
    ax.legend(loc='upper right', prop={'size':10}, frameon=False)
    plt.title('Location distribution\nin Gun Deaths US: 2012-2014', fontsize=14, fontweight='bold')
    sns.despine()
    plt.show()


    # the percentage visual is more informative
    place_died = pd.crosstab(guns.Place, guns.Intent)
    place_died.div(place_died.sum(1).astype(float), axis=0).plot(kind='bar', stacked=True, alpha=0.6)
    plt.title('Intent Percentage by Place')
    plt.xlabel('Place of death')
    plt.ylabel('Percentage')
    plt.legend(loc='upper center', bbox_to_anchor=(1.1,0.9))
    sns.despine()

    # barplot of gender grouped by intent 
    pd.crosstab(guns.Sex, guns.Intent).plot(kind='bar', alpha=0.6)
    plt.title('Gender Distribution by Intent')
    plt.xlabel('Gender')
    plt.ylabel('Frequency')
    plt.legend(loc=0)
    sns.despine()


    # barplot of education grouped by intent 
    pd.crosstab(guns.Education, guns.Intent).plot(kind='bar', alpha=0.6)
    plt.title('Education Distribution by Intent')
    plt.xlabel('Education')
    plt.ylabel('Frequency')
    sns.despine()


    # Histograms

    age_freq = guns.Age.value_counts()
    sorted_age_freq = age_freq.sort_index()
    sorted_age_freq.head()
    plt.hist(guns['Age'], range=(0,107), alpha=0.4)
    plt.tick_params(axis='both', which='both',length=0)
    plt.xlim(xmin=0, xmax=110)
    plt.xlabel('Age', fontsize=14)
    plt.ylabel('Count', fontsize=14)
    plt.title('Age distribution', fontsize=14, fontweight='bold')
    sns.despine(bottom=True, left=True)
    plt.show()


    # Sex and Intent
    fig = plt.figure(figsize=(12,4))
    ax1 = fig.add_subplot(1,2,1)
    ax2 = fig.add_subplot(1,2,2)

    suicide = guns[guns['Intent'] == 'Suicide']
    homicide = guns[guns['Intent'] == 'Homicide']

    ax1.hist(suicide.Age, 20, alpha=0.4)
    ax1.set_title('Suicide gun deaths\nAge Distribution', fontsize=14, fontweight='bold')
    ax2.hist(homicide.Age, 20, alpha=0.4)
    ax2.set_title('Homicide gun deaths\nAge Distribution', fontsize=14, fontweight='bold')
    ax1.set_xlabel('Age', fontsize=14)
    ax2.set_xlabel('Age', fontsize=14)
    ax1.set_ylabel('Frequency', fontsize=14)
    ax2.set_ylabel('Frequency', fontsize=14)
    ax1.tick_params(axis='both', which='both',length=0)
    ax2.tick_params(axis='both', which='both',length=0)
    ax1.set_xlim(xmin=0, xmax=110)
    ax2.set_xlim(xmin=0, xmax=110)
    sns.despine(bottom=True, left=True)
    plt.show()


    # Cross
    g = sns.FacetGrid(suicide, col='Sex')  
    g.map(sns.distplot, 'Age')
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.05))
    g.fig.suptitle('Suicide ages: Gender comparison', fontsize=14, fontweight='bold')
    g = sns.FacetGrid(homicide, col='Sex') 
    g.map(sns.distplot, 'Age')
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.05), xlabel='Age', ylabel='Percentage', )
    g.fig.suptitle('Homicide ages: Gender comparison', fontsize=14, fontweight='bold')


    # Race and age
    g = sns.FacetGrid(suicide, col='Race')  
    g.map(sns.distplot, 'Age')
    g.set(xlim=(0, None))
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.06), xlabel='Age')
    g.fig.suptitle('Suicide ages: Race comparison', fontsize=14, fontweight='bold')
    g = sns.FacetGrid(homicide, col='Race') 
    g.map(sns.distplot, 'Age')
    g.set(xlim=(0, None))
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.06), xlabel='Age')
    g.fig.suptitle('Homicide ages: Race comparison', fontsize=14, fontweight='bold')


    # in order to get in in the same order for better comparison:
    race_ordered = ['Black', 'White', 'Hispanic', 'Asian/Pacific Islander', 'Native American/Native Alaskan']
    guns['Race'] = guns['Race'].astype('category')
    guns.Race.cat.set_categories(race_ordered, inplace=True)

    suicide = guns[guns['Intent'] == 'Suicide']
    homicide = guns[guns['Intent'] == 'Homicide']

    g = sns.FacetGrid(suicide, col='Race')  
    g.map(sns.distplot, 'Age')
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.06), xlabel='Age')
    g.fig.suptitle('Suicide ages: Race comparison', fontsize=16, fontweight='bold')
    g = sns.FacetGrid(homicide, col='Race') 
    g.map(sns.distplot, 'Age')
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.06), xlabel='Age')
    g.fig.suptitle('Homicide ages: Race comparison', fontsize=16, fontweight='bold')


    # we can ignore education = 0 - since these are all very young ages
    g = sns.FacetGrid(suicide[suicide.Education > 0], col='Education')
    g.map(sns.distplot, 'Age')
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.06), xlabel='Age')
    g.fig.suptitle('Suicide ages: Education comparison', fontsize=16, fontweight='bold')
    g = sns.FacetGrid(homicide[homicide.Education > 0], col='Education') 
    g.map(sns.distplot, 'Age')
    plt.subplots_adjust(top=0.8)
    g.set(xlim=(0, 110), ylim=(0, 0.06), xlabel='Age')
    g.fig.suptitle('Homicide ages: Education comparison', fontsize=16, fontweight='bold')



    # KDE-PLOT

    # limit the x-axis
    # Intent-Age
    sns.FacetGrid(guns, hue='Intent', size=4).map(sns.kdeplot, 'Age')
    plt.legend(loc=9, frameon=False)
    plt.xlim(xmin=0)
    plt.xlabel('Age', fontsize=14)
    plt.ylabel('Density', fontsize=14)
    sns.despine(left=True)
    plt.title('Age distribution\nHomicide vs. Suicide', fontsize=14, fontweight='bold')

    # Sex-Age
    sns.FacetGrid(guns, hue='Sex', size=4).map(sns.kdeplot, 'Age').add_legend()
    sns.despine(left=True)
    plt.xlim(xmin=0)
    plt.title('Age distribution\nMale vs. Female', fontsize=14, fontweight='bold')


    # Intent:Sex-Age
    sns.FacetGrid(suicide, hue='Sex', size=4).map(sns.kdeplot, 'Age').add_legend()
    plt.xlabel('Age', fontsize=14)
    sns.despine(left=True)
    plt.title('Suicide ages: Gender comparison', fontsize=14, fontweight='bold')
    sns.FacetGrid(homicide, hue='Sex', size=4).map(sns.kdeplot, 'Age').add_legend()
    plt.xlabel('Age', fontsize=14)
    sns.despine(left=True)
    plt.xlim(xmin=0)
    plt.title('Homicide ages: Gender comparison', fontsize=14, fontweight='bold')



    # Box plot
    fig, ax = plt.subplots()
    data_to_plot = [suicide.Age, homicide.Age]
    plt.xlim(xmin=0, xmax=110)
    plt.boxplot(data_to_plot)
    plt.ylim(ymin=-1, ymax=110)
    plt.xticks([1, 2, 3], ['Suicide', 'Homicide'], fontsize=14)
    plt.tick_params(axis='both', which='both',length=0)
    plt.ylabel('Age', fontsize=14)
    plt.title('Ages in Suicide vs. Homicide',
              fontsize=14, fontweight='bold')
    sns.despine(bottom=True)
    plt.show()

    #sns.set(style='ticks')
    sns.boxplot(x='Intent', y='Age', hue='Sex', data=guns, palette='PRGn', width=0.6)
    sns.despine(bottom=True)


    # Violin-plot
    sns.violinplot(x='Intent', y='Age', hue='Sex', split=True, data=guns, size=4, inner='quart')
    sns.despine(bottom=True)
{% endcodeblock %}






























