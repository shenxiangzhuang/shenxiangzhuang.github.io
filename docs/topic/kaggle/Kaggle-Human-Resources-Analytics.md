---
title: 'Kaggle: Human Resources Analytics'
date: 2017-02-25 09:57:04
categories:
- Python
tags:
- Python
- Kaggle
---

##### Introduce
这是新年定下的目标之一 —— Kaggle案例的学习
这里，数据即来自[Human Resources Analytics](https://www.kaggle.com/ludobenistant/hr-analytics)， 参考[这里](https://www.kaggle.com/nirajvermafcb/d/ludobenistant/hr-analytics/principal-component-analysis-explained)学习数据的分析.

##### Overview
这个kernel里面呢，大部分还是比较常规的EDA，可视化和简单算法的应用，但是也有要学习的地方，这里在代码里面都有声明。
>[学习heatmap使用]
>[学习plt.barh使用]
>[学习如下reindex的步骤]
>[学习iloc使用]
>[学习使用sklearn进行标准化]
>[掌握手动计算协方差]
>[学习使用Numpy简单的线性代数的运算]
>[学习使用sklearn做PCA]

##### Code
{% codeblock lang:Python%}

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    """
    Created on Sat Feb 25 07:48:50 2017

    @author: shen
    """

    # 人力资源——离职分析
    # 采用PCA
    # 参考https://www.kaggle.com/nirajvermafcb/d/ludobenistant/hr-analytics/principal-component-analysis-explained



    import numpy as np  # linear algebra
    import pandas as pd  # data rocessing
    import matplotlib.pyplot as plt
    import seaborn as sns


    # 导入数据
    # https://www.kaggle.com/nirajvermafcb/d/ludobenistant/hr-analytics/principal-component-analysis-explained
    df = pd.read_csv('/home/shen/PycharmProjects/MyPython/Kaggle/human resources/data.csv')



    # 了解数据
    '''
    df.columns.tolist() fetches all the columns and 
    then convert it into list type.This step is just 
    to check out all the column names in our data.Columns 
    are also called as features of our datasets.
    '''
    columns_names = df.columns.tolist()

    print(df.shape)
    print(df.head())

    # 数值型变量的协方差矩阵
    print(df.corr())

    # [学习heatmap使用]
    # 协方差矩阵的可视化
    correlation = df.corr()
    plt.figure(figsize=(10,10))
    sns.heatmap(correlation, vmax=1, square=True, annot=True, cmap='cubehelix')
    plt.title('Correlation between diffrent features')


    # 职位
    print(df['sales'].unique())

    groupby_sales = df.groupby('sales').mean()

    IT=groupby_sales['satisfaction_level'].IT
    RandD=groupby_sales['satisfaction_level'].RandD
    accounting=groupby_sales['satisfaction_level'].accounting
    hr=groupby_sales['satisfaction_level'].hr
    management=groupby_sales['satisfaction_level'].management
    marketing=groupby_sales['satisfaction_level'].marketing
    product_mng=groupby_sales['satisfaction_level'].product_mng
    sales=groupby_sales['satisfaction_level'].sales
    support=groupby_sales['satisfaction_level'].support
    technical=groupby_sales['satisfaction_level'].technical



    # [学习plt.barh使用]
    department_name = df['sales'].unique()
    department=(sales, accounting, hr, technical, support, management,
           IT, product_mng, marketing, RandD)

    y_pos = np.arange(len(department))
    x = np.arange(0, 1, 0.1)

    plt.barh(y_pos, department, align='center', alpha=0.8)
    plt.yticks(y_pos, department_name)
    plt.xlabel('Satisfaction level')
    plt.title('Mean Satisfaction Level of each department')



    # PCA
    # 去除非数值型的变量(feature)
    print(df.dtypes)
    df_drop = df.drop(labels=['sales', 'salary'], axis=1)
    print(df_drop.dtypes)


    # [学习如下reindex的步骤]
    '''
    Here we are converting columns of the dataframe to list 
    so it would be easier for us to reshuffle the columns.
    We are going to use cols.insert method
    '''
    cols = df_drop.columns.tolist()
    cols.insert(0, cols.pop(cols.index('left')))

    df_drop = df_drop.reindex(columns= cols)


    # [学习iloc使用]
    # 索引分离数据
    X = df_drop.iloc[:, 1:8].values
    y = df_drop.iloc[:, 0].values

    print(np.shape(X))
    print(np.shape(y))

    # [学习使用sklearn进行标准化]
    # 数据的标准化
    from sklearn.preprocessing import StandardScaler
    X_std = StandardScaler().fit_transform(X)

    # [掌握手动计算协方差]
    # 计算协方差矩阵
    mean_vec = np.mean(X_std, axis=0)
    cov_mat = (X_std - mean_vec).T.dot((X_std - mean_vec)) / (X_std.shape[0] - 1)

    # another way --> np.cov
    print('NumPy covariance matrix: \n%s' %np.cov(X_std.T))


    plt.figure(figsize=(8,8))
    sns.heatmap(cov_mat, vmax=1, square=True,annot=True,cmap='cubehelix')

    plt.title('Correlation between different features')

    # [学习使用Numpy简单的线性代数的运算]
    # 计算特征值与特征向量
    eig_vals, eig_vecs = np.linalg.eig(cov_mat)

    print('Eigenvectors \n%s' %eig_vecs)
    print('\nEigenvalues \n%s' %eig_vals)



    # Make a list of (eigenvalue, eigenvector) tuples
    eig_pairs = [(np.abs(eig_vals[i]), eig_vecs[:,i]) for i in range(len(eig_vals))]

    # Sort the (eigenvalue, eigenvector) tuples from high to low
    eig_pairs.sort(key=lambda x: x[0], reverse=True)

    # Visually confirm that the list is correctly sorted by decreasing eigenvalues
    print('Eigenvalues in descending order:')
    for i in eig_pairs:
        print(i[0])


    # Explained Variance
    tot = sum(eig_vals)
    var_exp = [(i / tot)*100 for i in sorted(eig_vals, reverse=True)]

    with plt.style.context('ggplot'):
        plt.figure(figsize=(6, 4))

        plt.bar(range(7), var_exp, alpha=0.5, align='center',
                label='individual explained variance')
        plt.ylabel('Explained variance ratio')
        plt.xlabel('Principal components')
        plt.legend(loc='best')
        plt.tight_layout()


    # Projection matrix
    # [假设前两个主成分占Explain Variance 的90%]选取前两个变量，构成Projection matrix
    matrix_w = np.hstack((eig_pairs[0][1].reshape(7,1), 
                          eig_pairs[1][1].reshape(7,1)
                        ))
    print('Matrix W:\n', matrix_w)

    # Projection Onto the New Feature Space
    Y = X_std.dot(matrix_w)

    # [学习使用sklearn做PCA]
    # PCA in scikit-learn
    from sklearn.decomposition import PCA
    pca = PCA().fit(X_std)
    plt.plot(np.cumsum(pca.explained_variance_ratio_))
    plt.xlim(0, 7, 1)
    plt.xlabel('Number of components')
    plt.ylabel('Cumulativa explained variance')


    from sklearn.decomposition import PCA 
    sklearn_pca = PCA(n_components=6)
    Y_sklearn = sklearn_pca.fit_transform(X_std)

    print(Y_sklearn.shape)

{% endcodeblock %}

##### Supplement
补充下sns.heatmap的使用
>heatmap(data, vmin=None, vmax=None, cmap=None, center=None, robust=False, annot=None, fmt='.2g', annot_kws=None, linewidths=0, linecolor='white', cbar=True, cbar_kws=None, cbar_ax=None, square=False, ax=None, xticklabels=True, yticklabels=True, mask=None, **kwargs)

>Plot rectangular data as a color-encoded matrix.
    
>This function tries to infer a good colormap to use from the data, but
this is not guaranteed to work, so take care to make sure the kind of
colormap (sequential or diverging) and its limits are appropriate.

>This is an Axes-level function and will draw the heatmap into the
currently-active Axes if none is provided to the ``ax`` argument.  Part of
this Axes space will be taken and used to plot a colormap, unless ``cbar``
is False or a separate Axes is provided to ``cbar_ax``.


{% codeblock lang:Python%}
    import seaborn as sns
    import matplotlib.pyplot as plt
    flights = sns.load_dataset("flights")
    flights = flights.pivot("month", "year", "passengers")
    ax = sns.heatmap(flights, linewidth=.5)
    plt.show()

{% endcodeblock %}
输出：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Screenshot%20from%202017-02-25%2010-22-47.png)

{% codeblock lang:Python%}
    import seaborn as sns
    import matplotlib.pyplot as plt
    flights = sns.load_dataset("flights")
    flights = flights.pivot("month", "year", "passengers")
    ax = sns.heatmap(flights, center=flights.loc["January", 1955])
    plt.show()

{% endcodeblock %}
输出：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Screenshot%20from%202017-02-25%2010-26-23.png)



