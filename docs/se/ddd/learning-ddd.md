# Book: Learning DDD

*Learning Domain-Driven Design*(猴书)读书笔记


## PART I: Strategic Design

???+ "DDD方法论: 战略与战术"

    - 战略层面: 回答"what"和"why?"
    - 战术层面: "how"


### Chap1: Analyzing Business Domains

???+ "Definition: Business Domain & Subdomain"

    - Business domain: A business domain defines a company's main area of activity.
        - Starbucks is best known for its coffee

    - Subdomain: A subdomain is a fine-grained area of bussiness activity
        - All of a company's subdomains form its business domain: the service it provides to its customers.


![](image/subdomains.jpg)

???+ "Types of subdomains: Core, Generic, Supporting"

    - Core subdomain: what a company does differently from its competitors.
        - Core subdomains are naturally complex: they should be
          as hard for competitors to copy as possible —— the company's profitability depends on it

        - Change often and continuously: the solution must be maintainable and easy to evolve.
          Thus, core subdomains require implementation of the most advanced engineering techniques

    - Generic subdomain: businness activities that all companies are performing in the same way
        - Complex and hard to implement
        - Do **NOT** provide any competitive edge for the company

    - Supporting subdomian: support the company's business.
        - Simple: ETL(extract, transform, load), CRUD(createm read, update, delete) and so on
        - Do **NOT** provide any competitive advantage


### Chap2: Discovering Domain Knowledge
