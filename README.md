# Проект для тестирования автоматического разделения кода при сборке webpack.

## Компоненты

В папке `src` есть два набора компонент:

* `components-static` &mdash; все зависимости импортируются статически;
* `components-dynamic` &mdash; компоненты загружают зависимости по требованию.

Их можно импортировать в файле `src/index.js` в различном сочетании и смотреть как это влияет на общую сборку.


### gallery.js

Зависит только от **jQuery**

### panel.js

Зависит только от **React**

### search.js

Зависит от **jQuery**, **React** и **moment.js**

## Варианты сборки

### Монолит

В `src/index.js` используются только компоненты со статическими импортами:

```javascript
import gallery from './components-static/gallery';
import search from './components-static/search';
import tiles from './components-static/panel';
```

Статистика сборки:

```text
Hash: c69ea09c1db6e55c903e
Version: webpack 3.5.5
Time: 1798ms
 Asset     Size  Chunks                    Chunk Names
app.js  1.49 MB       0  [emitted]  [big]  app
```

Наличие или отсутствие в `webpack.config.js` плагина `CommonsChunkPlugin` никак не влияет на результат, так как точка входа только одна и извлекать из неё нечего. Чтобы плагин начал работать нужно чтобы появились другие точки входа или чанки.  

### Асинхронная загрузка некоторых компонент

Заменим `search` и `panel` на динамически загружаемые компоненты и убедимся, что в конфигурации webpack нет плагинов.

```javascript
import gallery from './components-static/gallery';
import search from './components-dynamic/search';
import tiles from './components-dynamic/panel';
```

Статистика сборки:

```text
Hash: d96503f08df39a10dd10
Version: webpack 3.5.5
Time: 1835ms
                        Asset     Size  Chunks                    Chunk Names
chunk.9e415c4a65607bcc802d.js  1.21 MB       0  [emitted]  [big]
chunk.746d996ec3912a00a8c3.js   746 kB       1  [emitted]  [big]
                       app.js   276 kB       2  [emitted]  [big]  app
```

В `app.js` осталась **jQuery**. Две компоненты, которые мы загружаем динамически, имеют по копии **React** в чанках.

Самое время подключить `CommonsChunkPlugin` и начать оптимизацию сборки.

### Чанк с библиотеками

В `webpack.config.js` добавим:

```javascript
plugins: [
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: module => (
      module.context &&
      module.context.indexOf('node_modules') !== -1
    ),
    async: 'vendor'
  })
]
```

```text
Hash: cb227a1967c28269ca93
Version: webpack 3.5.5
Time: 1802ms
                        Asset       Size  Chunks                    Chunk Names
chunk.5a34e9dedb776754f2f5.js    1.21 MB       0  [emitted]  [big]  vendor-app
chunk.06c916c0bbb979a72183.js    1.82 kB       1  [emitted]
chunk.995d1aad3046061c7ed8.js  513 bytes       2  [emitted]
                       app.js     276 kB       3  [emitted]  [big]  app
```

webpack сгенерировал отдельный чанк, который называется `vendor-app` и загружается асинхронно когда он будет нужен. Туда он поместил **React** и **moment.js**. А **jQuery** всё так же остаётся в основной сборке из-за того, что он импортируется статически.

### Полностью асинхронная загрузка

Убедимся, что в `index.js` импортируются компоненты только из папки `components-dynamic`.

```javascript
import gallery from './components-dynamic/gallery';
import search from './components-dynamic/search';
import tiles from './components-dynamic/panel';
```

В результате получается один большой чанк со всеми библиотеками:

```text
Hash: 83ae341661bded2da7fe
Version: webpack 3.5.5
Time: 1824ms
                        Asset       Size  Chunks                    Chunk Names
chunk.8aa6720187bcb568e55c.js    1.48 MB       0  [emitted]  [big]  vendor-app
chunk.04814adbe48009f345c4.js    1.82 kB       1  [emitted]
chunk.995d1aad3046061c7ed8.js  513 bytes       2  [emitted]
                       app.js     7.6 kB       3  [emitted]         app

```

### Несколько чанков с библиотеками

Плагин `CommonsChunkPlugin` можно использовать несколько раз с разными настройками. И так как мы сами пишем условия, когда нужно объединять модули в чанк, то теоретически мы можем генерировать нужные нам наборы библиотек.

Например, извлечём **jQuery** в отдельный файл, чтобы не загружать **React**, когда он не нужен на странице.

```javascript
plugins: [
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: module => (
      module.context &&
      module.context.indexOf('node_modules') !== -1
    ),
    async: 'vendor'
  }),
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: module => (
      module.context &&
      module.context.indexOf('node_modules') !== -1
    ),
    async: 'jquery'
  })
]
```

Получаем ещё один чанк:

```text
Hash: 2ef62f1cd04a79a71b68
Version: webpack 3.5.5
Time: 1800ms
                        Asset       Size  Chunks                    Chunk Names
chunk.5a34e9dedb776754f2f5.js    1.21 MB       0  [emitted]  [big]  vendor-app
chunk.0e9c67bdd4a6e004b42c.js     268 kB       1  [emitted]  [big]  jquery-app
chunk.e570fc4234fc6c71b7a7.js    1.82 kB       2  [emitted]
chunk.4d686bc6e2f2013b7ed3.js  513 bytes       3  [emitted]
                       app.js    7.72 kB       4  [emitted]         app
``` 

Обратите внимание, что хеш чанка `vendor-app` опять вернулся к своему прежнему значению, после того как мы извлекли из него **jQuery**.

## Что дальше

Из опыта хочу сказать, что в функции `minChunks` можно написать всю необходимую логику для объединения модулей.

Так же нужно обязательно задавать в свойстве `async` уникальное имя чанка.

Ещё можно формировать наборы библиотек руками через дополнительные точки входа и опцию [externals](https://webpack.js.org/configuration/externals/) в `webpack.config.js`.

## Обратная связь

Задавайте вопросы в [issues](https://github.com/mistakster/test-code-splitting/issues) или пишите в [Твиттер](https://twitter.com/mista_k).
 