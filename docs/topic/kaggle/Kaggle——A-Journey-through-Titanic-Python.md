---
title: 'Kaggle——A Journey through Titanic[Python]'
date: 2017-03-02 15:29:03
categories:
- Python
tags:
- Python
- Kaggle
- Data Analysis
---
Kaggle案例一——Titanic——Python分析与预测
>非原创，目前本站Kaggle案例均来自Kaggle官网发布的kernel，这里摘抄下来学习借鉴。

##### 数据变量描述
>VARIABLE DESCRIPTIONS:
survival        Survival
                (0 = No; 1 = Yes)
pclass          Passenger Class
                (1 = 1st; 2 = 2nd; 3 = 3rd)
name            Name
sex             Sex
age             Age
sibsp           Number of Siblings/Spouses Aboard
parch           Number of Parents/Children Aboard
ticket          Ticket Number
fare            Passenger Fare
cabin           Cabin
embarked        Port of Embarkation
                (C = Cherbourg; Q = Queenstown; S = Southampton)

>SPECIAL NOTES:
Pclass is a proxy for socio-economic status (SES)
 1st ~ Upper; 2nd ~ Middle; 3rd ~ Lower

>Age is in Years; Fractional if Age less than One (1)
 If the Age is Estimated, it is in the form xx.5

>With respect to the family relation variables (i.e. sibsp and parch)
some relations were ignored.  The following are the definitions used
for sibsp and parch.

>Sibling:  Brother, Sister, Stepbrother, or Stepsister of Passenger Aboard Titanic
Spouse:   Husband or Wife of Passenger Aboard Titanic (Mistresses and Fiances Ignored)
Parent:   Mother or Father of Passenger Aboard Titanic
Child:    Son, Daughter, Stepson, or Stepdaughter of Passenger Aboard Titanic

>Other family relatives excluded from this study include cousins,
nephews/nieces, aunts/uncles, and in-laws.  Some children travelled
only with a nanny, therefore parch=0 for them.  As well, some
travelled with very close friends or neighbors in a village, however,
the definitions do not support such relations.



##### 数据分析
{% codeblock lang:python %}
    # Imports

    # pandas
    import pandas as pd
    from pandas import Series,DataFrame

    # numpy, matplotlib, seaborn
    import numpy as np
    import matplotlib.pyplot as plt
    import seaborn as sns
    # 设置seaborn默认的绘图样式
    sns.set_style('whitegrid')

    # machine learning
    from sklearn.linear_model import LogisticRegression
    from sklearn.svm import SVC, LinearSVC
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.neighbors import KNeighborsClassifier
    from sklearn.naive_bayes import GaussianNB


{% endcodeblock %}
关于sns.set_style('whitegrid'):
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/1.png)


{% codeblock lang:python %}

    # get titanic & test csv files as a DataFrame
    # 获取训练和待预测的数据，导入为DF
    titanic_df = pd.read_csv("/home/shen/PycharmProjects/MyPython/Kaggle/Titanic/train.csv")
    test_df    = pd.read_csv("/home/shen/PycharmProjects/MyPython/Kaggle/Titanic/test.csv")

    # preview the data
    # 预览数据
    titanic_df.head()

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/2.png)


{% codeblock lang:python %}

    titanic_df.info()
    print("----------------------------")
    test_df.info()

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/3.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/4.png)



{% codeblock lang:python %}

    # drop unnecessary columns, these columns won't be useful in analysis and prediction
    # 去除一些无用的列，这种  关注数据的核心信息   在之后还能看到

    titanic_df = titanic_df.drop(['PassengerId','Name','Ticket'], axis=1)  # axis=1,代表列
    test_df    = test_df.drop(['Name','Ticket'], axis=1)

    # Embarked

    # only in titanic_df, fill the two missing values with the most occurred value, which is "S".
    # 少量非数值缺失值处理的一种方法-->用出现最多的观测值填充
    titanic_df["Embarked"] = titanic_df["Embarked"].fillna("S")

    # plot
    sns.factorplot('Embarked','Survived', data=titanic_df,size=4,aspect=3)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/5.png)



{% codeblock lang:python %}

    fig, (axis1,axis2,axis3) = plt.subplots(1,3,figsize=(15,5))

    # sns.factorplot('Embarked',data=titanic_df,kind='count',order=['S','C','Q'],ax=axis1)
    # sns.factorplot('Survived',hue="Embarked",data=titanic_df,kind='count',order=[1,0],ax=axis2)
    sns.countplot(x='Embarked', data=titanic_df, ax=axis1)
    sns.countplot(x='Survived', hue="Embarked", data=titanic_df, order=[1,0], ax=axis2)

    # group by embarked, and get the mean for survived passengers for each value in Embarked
    embark_perc = titanic_df[["Embarked", "Survived"]].groupby(['Embarked'],as_index=False).mean()
    sns.barplot(x='Embarked', y='Survived', data=embark_perc,order=['S','C','Q'],ax=axis3)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/6.png)



{% codeblock lang:python %}
    # Either to consider Embarked column in predictions,
    # and remove "S" dummy variable, 
    # and leave "C" & "Q", since they seem to have a good rate for Survival.
    # 观察到"C", "Q"相比“S”有较高的生存率，所以我们删除S列

    # OR, don't create dummy variables for Embarked column, just drop it, 
    # because logically, Embarked doesn't seem to be useful in prediction.
    # 或者我们可以直接删除Embarked这一列，它对预测无太大影响

    embark_dummies_titanic  = pd.get_dummies(titanic_df['Embarked'])
    embark_dummies_titanic.drop(['S'], axis=1, inplace=True)

    embark_dummies_test  = pd.get_dummies(test_df['Embarked'])
    embark_dummies_test.drop(['S'], axis=1, inplace=True)

    titanic_df = titanic_df.join(embark_dummies_titanic)
    test_df    = test_df.join(embark_dummies_test)

    titanic_df.drop(['Embarked'], axis=1,inplace=True)
    test_df.drop(['Embarked'], axis=1,inplace=True)

    # Fare

    # only for test_df, since there is a missing "Fare" values
    # 少量数值型缺失值的处理方法-->中位数填充
    test_df["Fare"].fillna(test_df["Fare"].median(), inplace=True)

    # convert from float to int
    # 数据类型的转换
    titanic_df['Fare'] = titanic_df['Fare'].astype(int)
    test_df['Fare']    = test_df['Fare'].astype(int)

    # get fare for survived & didn't survive passengers
    # 数据分类
    fare_not_survived = titanic_df["Fare"][titanic_df["Survived"] == 0]
    fare_survived     = titanic_df["Fare"][titanic_df["Survived"] == 1]

    # get average and std for fare of survived/not survived passengers
    # 获取典型统计量，更好地描述和观察数据
    avgerage_fare = DataFrame([fare_not_survived.mean(), fare_survived.mean()])
    std_fare      = DataFrame([fare_not_survived.std(), fare_survived.std()])

    # plot
    titanic_df['Fare'].plot(kind='hist', figsize=(15,3),bins=100, xlim=(0,50))

    avgerage_fare.index.names = std_fare.index.names = ["Survived"]
    avgerage_fare.plot(yerr=std_fare,kind='bar',legend=False)


{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/7.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/8.png)


{% codeblock lang:python %}

    # Age 

    fig, (axis1,axis2) = plt.subplots(1,2,figsize=(15,4))
    axis1.set_title('Original Age values - Titanic')
    axis2.set_title('New Age values - Titanic')

    # axis3.set_title('Original Age values - Test')
    # axis4.set_title('New Age values - Test')

    # get average, std, and number of NaN values in titanic_df
    # 训练集中年龄的统计量的获取
    average_age_titanic   = titanic_df["Age"].mean()
    std_age_titanic       = titanic_df["Age"].std()
    count_nan_age_titanic = titanic_df["Age"].isnull().sum()

    # get average, std, and number of NaN values in test_df
    # 测试集中年龄的统计量的获取

    average_age_test   = test_df["Age"].mean()
    std_age_test       = test_df["Age"].std()
    count_nan_age_test = test_df["Age"].isnull().sum()

    # generate random numbers between (mean - std) & (mean + std)
    # 随机获取在均值的一倍标准差内的数据，用于填充大量的数值型缺失值
    rand_1 = np.random.randint(average_age_titanic - std_age_titanic, average_age_titanic + std_age_titanic, size = count_nan_age_titanic)
    rand_2 = np.random.randint(average_age_test - std_age_test, average_age_test + std_age_test, size = count_nan_age_test)

    # plot original Age values
    # NOTE: drop all null values, and convert to int
    titanic_df['Age'].dropna().astype(int).hist(bins=70, ax=axis1)
    # test_df['Age'].dropna().astype(int).hist(bins=70, ax=axis1)

    # fill NaN values in Age column with random values generated
    # 经典的方法，通过布尔值过滤得到想要的“条件数据”
    titanic_df["Age"][np.isnan(titanic_df["Age"])] = rand_1
    test_df["Age"][np.isnan(test_df["Age"])] = rand_2

    # convert from float to int
    titanic_df['Age'] = titanic_df['Age'].astype(int)
    test_df['Age']    = test_df['Age'].astype(int)

    # plot new Age Values
    titanic_df['Age'].hist(bins=70, ax=axis2)
    # test_df['Age'].hist(bins=70, ax=axis4)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/9.png)



{% codeblock lang:python %}

    # .... continue with plot Age column

    # peaks for survived/not survived passengers by their age
    facet = sns.FacetGrid(titanic_df, hue="Survived",aspect=4)  # aspect=4 长宽比4:1
    facet.map(sns.kdeplot,'Age',shade= True)
    facet.set(xlim=(0, titanic_df['Age'].max()))
    facet.add_legend()

{% endcodeblock %}

![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/10.png)


{% codeblock lang:python %}

    # average survived passengers by age
    fig, axis1 = plt.subplots(1,1,figsize=(18,4))
    average_age = titanic_df[["Age", "Survived"]].groupby(['Age'],as_index=False).mean()
    sns.barplot(x='Age', y='Survived', data=average_age)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/11.png)



{% codeblock lang:python %}

    # Cabin
    # It has a lot of NaN values, so it won't cause a remarkable impact on prediction
    # 这里也是要学习的地方，对于含有大量缺失值，并且对预测无太大影响时，可以直接将其移除
    titanic_df.drop("Cabin",axis=1,inplace=True)
    test_df.drop("Cabin",axis=1,inplace=True)

    # 学习的地方，化繁为简，找到关注的重点为是否有家人，而不是具体的父母兄弟等
    titanic_df['Family'] =  titanic_df["Parch"] + titanic_df["SibSp"]
    titanic_df['Family'].loc[titanic_df['Family'] > 0] = 1
    titanic_df['Family'].loc[titanic_df['Family'] == 0] = 0
    # 测试集和训练集作相同处理
    test_df['Family'] =  test_df["Parch"] + test_df["SibSp"]
    test_df['Family'].loc[test_df['Family'] > 0] = 1
    test_df['Family'].loc[test_df['Family'] == 0] = 0

    # drop Parch & SibSp
    titanic_df = titanic_df.drop(['SibSp','Parch'], axis=1)
    test_df    = test_df.drop(['SibSp','Parch'], axis=1)

    # plot
    fig, (axis1,axis2) = plt.subplots(1,2,sharex=True,figsize=(10,5))

    # sns.factorplot('Family',data=titanic_df,kind='count',ax=axis1)
    sns.countplot(x='Family', data=titanic_df, order=[1,0], ax=axis1)

    # average of survived for those who had/didn't have any family member
    family_perc = titanic_df[["Family", "Survived"]].groupby(['Family'],as_index=False).mean()
    sns.barplot(x='Family', y='Survived', data=family_perc, order=[1,0], ax=axis2)

    axis1.set_xticklabels(["With Family","Alone"], rotation=0)

{% endcodeblock %}

![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/12.png)


{% codeblock lang:python %}

    # Sex

    # As we see, children(age < ~16) on aboard seem to have a high chances for Survival.
    # So, we can classify passengers as males, females, and child
    def get_person(passenger):
        age,sex = passenger
        return 'child' if age < 16 else sex

    titanic_df['Person'] = titanic_df[['Age','Sex']].apply(get_person,axis=1)
    test_df['Person']    = test_df[['Age','Sex']].apply(get_person,axis=1)

    # No need to use Sex column since we created Person column
    titanic_df.drop(['Sex'],axis=1,inplace=True)
    test_df.drop(['Sex'],axis=1,inplace=True)

    # create dummy variables for Person column, & drop Male as it has the lowest average of survived passengers
    person_dummies_titanic  = pd.get_dummies(titanic_df['Person'])
    person_dummies_titanic.columns = ['Child','Female','Male']
    person_dummies_titanic.drop(['Male'], axis=1, inplace=True)

    person_dummies_test  = pd.get_dummies(test_df['Person'])
    person_dummies_test.columns = ['Child','Female','Male']
    person_dummies_test.drop(['Male'], axis=1, inplace=True)

    titanic_df = titanic_df.join(person_dummies_titanic)
    test_df    = test_df.join(person_dummies_test)

    fig, (axis1,axis2) = plt.subplots(1,2,figsize=(10,5))

    # sns.factorplot('Person',data=titanic_df,kind='count',ax=axis1)
    sns.countplot(x='Person', data=titanic_df, ax=axis1)

    # average of survived for each Person(male, female, or child)
    person_perc = titanic_df[["Person", "Survived"]].groupby(['Person'],as_index=False).mean()
    sns.barplot(x='Person', y='Survived', data=person_perc, ax=axis2, order=['male','female','child'])

    titanic_df.drop(['Person'],axis=1,inplace=True)
    test_df.drop(['Person'],axis=1,inplace=True)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/13.png)

{% codeblock lang:python %}

    # Pclass

    # sns.factorplot('Pclass',data=titanic_df,kind='count',order=[1,2,3])
    sns.factorplot('Pclass','Survived',order=[1,2,3], data=titanic_df,size=5)

    # create dummy variables for Pclass column, & drop 3rd class as it has the lowest average of survived passengers
    pclass_dummies_titanic  = pd.get_dummies(titanic_df['Pclass'])
    pclass_dummies_titanic.columns = ['Class_1','Class_2','Class_3']
    pclass_dummies_titanic.drop(['Class_3'], axis=1, inplace=True)

    pclass_dummies_test  = pd.get_dummies(test_df['Pclass'])
    pclass_dummies_test.columns = ['Class_1','Class_2','Class_3']
    pclass_dummies_test.drop(['Class_3'], axis=1, inplace=True)

    titanic_df.drop(['Pclass'],axis=1,inplace=True)
    test_df.drop(['Pclass'],axis=1,inplace=True)

    titanic_df = titanic_df.join(pclass_dummies_titanic)
    test_df    = test_df.join(pclass_dummies_test)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/14.png)



{% codeblock lang:python %}
	# 开始预测
    # define training and testing sets

    X_train = titanic_df.drop("Survived",axis=1)
    Y_train = titanic_df["Survived"]
    X_test  = test_df.drop("PassengerId",axis=1).copy()

{% endcodeblock %}

{% codeblock lang:python %}

    # Logistic Regression

    logreg = LogisticRegression()
    logreg.fit(X_train, Y_train)
    Y_pred = logreg.predict(X_test)

    logreg.score(X_train, Y_train)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/15.png)




{% codeblock lang:python %}

    svc = SVC()
    svc.fit(X_train, Y_train)
    Y_pred = svc.predict(X_test)
    svc.score(X_train, Y_train)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/16.png)


{% codeblock lang:python %}

    # Random Forests

    random_forest = RandomForestClassifier(n_estimators=100)

    random_forest.fit(X_train, Y_train)

    Y_pred = random_forest.predict(X_test)

    random_forest.score(X_train, Y_train)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/17.png)



{% codeblock lang:python %}

    knn = KNeighborsClassifier(n_neighbors = 3)

    knn.fit(X_train, Y_train)

    Y_pred = knn.predict(X_test)

    knn.score(X_train, Y_train)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/18.png)


{% codeblock lang:python %}

    # Gaussian Naive Bayes

    gaussian = GaussianNB()

    gaussian.fit(X_train, Y_train)

    Y_pred = gaussian.predict(X_test)

    gaussian.score(X_train, Y_train)

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/19.png)


{% codeblock lang:python %}

    # get Correlation Coefficient for each feature using Logistic Regression
    coeff_df = DataFrame(titanic_df.columns.delete(0))
    coeff_df.columns = ['Features']
    coeff_df["Coefficient Estimate"] = pd.Series(logreg.coef_[0])

    # preview
    coeff_df

{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/20.png)


##### 补充说明

关于pd.get_dummies 使用

![](http://dataimage-1252464519.costj.myqcloud.com/images/kaggle/titanic/0.png)

##### 参考
[*A journey through titanic*](https://www.kaggle.com/omarelgabry/titanic/a-journey-through-titanic)


