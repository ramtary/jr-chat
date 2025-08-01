1. Контейнер — исполняемая среда в компьютере, которая заставляет
   программы, запущенные в ней думать, что они работают в __данной__
   операционной системе с __данным__ набором софта. Какие программы могут
   быть
    - Сервер баз данных (MySQL, Postgres)
    - Веб-сервер (Apache, Nginx)
    - Приложение на Node.js (Express-сервер)

      == контейнер создается на основе образа ==

2. Образ это [шаблон] для создания контейнера, который содержит
   исходный набор файлов, на основе которого этот контейнер 
   разворачивается

3. Образы можно получить из двух мест
  - Docker Hub (как npm только для образов) — облачный сервис, который хранит контейнеры.
    Публичные образы из Docker Hub полезны для
    - Быстрой настройки инфраструктуры без __ковыряния__ в нюансах конкретной ОС
      и конкретного компьютера
    - Создания образов на основе других образов

  - Создать образ локально (но только на основе другого образа) — для этого используется
    `Dockerfile`

-----------

— GWT — Фронт (фронт на Java)
— Spring Framework для сервера (на Java)
  — Наш бэк
— Apache Kafka — NoSQL In memomy БД

-----------

Postgres — это софт, это программа
Любой софт пишется для некоей операционной системы

-----------

- App source
- App Dependencies — Node.js
- App Requirements — npm, nodejs                                | /ubuntu-python-node
- Python | pip                                                  | /ubuntu-python
- Linux: Debian, Ubuntu, Kubuntu, Fedora | command line  | apt  | /ubuntu

-----------

Docker — контейнеризация — удобная __доставка__ приложений
Виртуализация

Веб-приложение
  - Сервер для API — [контейнер 1]
    - Node.js — системная зависимость
      - Express.js `npm install`
      - TypeScript  `npm install`
  - Фронтенд - [контейнер 2]
    - Node.js — системная зависимость
    - http-server  `npm install`
    - статика (js, картинки, css)
    - локальные зависимости
      - `moment.js` — 1.2.0 npm
  - БД - [контейнер 3]
    - PostgreSQL — системная зависимость

`Node.js` — способ запустить JS файл на уровне операционной системы
Операционная система:
— файловая система (работа с диском)
— работа с железом компьютера (процессор, память и т. д.)
— работа с сетью
                                                             Домен
                                                             DNS
                                                             Дата-центр `SomeH`
                                                             Компьютеры (серверы)
                                                             Удаленный доступ
=Компьютер лектора=              =Любой другой компьютер=    =Хостинг (VPS/VDS)=
— Mac                            — Windows                   — Linux
— Mac OS Sequoia 15.5 (*nix)     — Windows 11                — Ubuntu 24.04
  — Terminal                       — Power Shell               — Linux Terminal
  — zsh                            — Power Shell               — bash
  — пакетный менеджер `brew`       — `chokolatey`              — `apt-get`
  — ПО своей версии                — ПО своей версии           — ПО своей версии
    — Node.js                        — Node.js                   — Node.js

— 8GB RAM
— 256GB SSD

[x|x|x| | | ]
[ | |x| | | ]
[ | | | |x| ]
[ | | |x| | ]
[ |x|x| | | ]
[ | | |x| | ]
[ | |x| | | ]
[ | | |x| | ]
[ | | | | | ]
[ | | | | | ]
[ | | | | | ]
[ | | | | | ]
[ | | | | | ]
[ | | | | | ]
[ | | | | | ]
  _       _

- винчестер
- процессор
- память
- сетевая карта
- шнур

Требования
Иван Иваныч                   Петр Петрович                 МЫ
- блог                        - лендинг                     - мощный сервис
- PHP                         - сгенерирован                - Postgres, Node.js
- 20 человек в день           - 2000 человек в день         - 1 000 000 человек

Вируализация
- подавляющее количество хостингов в мире — виртуальные
- виртуализация это подход при котором на одном и том же железе можно запускать
  несколько виртуальных операционных систем, которые будут между собой разделять
  физические ресурсы компьютера

  ```
  [ПЗУ]
  [Память]                               <--- [Хост ОС ~ Windows]
  [Процессор] <--- [Ядро виртуализации]  <--- [Ubuntu]
  [Сетевое обор.]                        <--- [Ubuntu]
  ```

`Mac`
`Intel/AMD`
`NVidia`      [Linux ==> Debian, Ubuntu, Red Hat, Fedora]
              [Windows]


Операционная система                                                 API Server    Client
- mkdir/rmdir/cp/mv — `интерфейс командной строки`                   Ubuntu        Ubuntu
- пакетный менеджер — `<x> install nodejs && <x> install postgres`   `apt`         `apt`
- сетевой интерфейс                                                  —              —
- ПО установленное на ОС                                             Node 20.12    Node 20.12

- переменные окружения
- локальные файлы



OS                           `/ubuntu`
OS Dependencies              `/ubuntu_node_js`
Runtime                      Node.js 20.12   node
----
App Dependencies             `/ubuntu_node_js_deps` `npm install`
Application Code             `/ubuntu_node_js_deps_code`
Config                       `/ubuntu_node_js_deps_code_config`

```
== Auth       == Data
Node         Node
Express      Express
cors         cors
TypeScript   TypeScript
tsx          tsx
sequelize    sequelize
```

Если это выглядит как утка, плавает как утка и крякает как утка, то возможно
это утка

Контейнер — это виртуальная изолированная среда запуска программ
с интерфейсом, похожим на операционную систему, но им не являющуюся

  ```
  [Память]                                          <--- [Контейнер 1]
  [Процессор] <--- [Хост ОС] <--- [Контейнеризатор] <--- [Контейнер 2] 
  [Сетевое обор.]                                   <--- [Контейнер 3]
  ```

[Docker]  --- запускает ---> [Контейнер] --- строится на основе --> [Образ]
[Образ] --- описывается с помощью ---> [Dockerfile]


MacOS <== Docker <== Ubuntu

Docker Image
- ОС: Ubuntu                           /docker-ubuntu
- верхнеуровневые приложения           /docker-ubuntu-nodejs /docker-ubuntu-pg
- файлы                                /our-backend /our-frontend

Docker Hub
