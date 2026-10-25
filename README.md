# Сайт студии дизайна Биплан-Дизайн

- Frontend
  - Архитектура FSD Feature Sliced Design
  - UI на `shadcn-vue`
  - Дашборд-таблица для управления проектами
  - Формы с валидацией с помощью `vee-validate`
  - *Логическая* сортировка групп, категорий, проектов, изображений
  - Оптимизация изображений, карусель
  - Состояние в url
  - Кэширование запросов
  - Drag&drop элементов в админке
- Backend
  - `tRPC`
  - БД `libsql`
  - Clean architecture
  - `drizzle` + `s3`
  - Сессии на куках
  - Регистрация администраторов сайта и управление аккаунтом
  - SEO: robost.txt, sitemap.yml, open-graph

## Локальная разработка

```bash
# 1. Переменные окружения
cp .env.example .env

# 2. Копия базы для первого запуска (libsql/sqlite)
mkdir -p server/db/data/seed
cp ~/Downloads/biplane-design.db server/db/data/seed/biplane-design.db

# 3. Только БД в Docker, приложение на хосте
docker compose up -d sqld
bun install
bun dev

# Либо всё вместе (app + libsql), с горячей перезагрузкой
docker compose up
```

- `sqld` — libsql-сервер на `http://localhost:8080`.
- `db-init` при первом запуске копирует `server/db/data/seed/biplane-design.db`
  в каталог данных `sqld`. Дальнейшие изменения БД сохраняются в
  `server/db/data/sqld` и переживают перезапуск контейнеров.
- Приложение в Docker доступно на `http://localhost:3000` и подключается
  к БД по адресу `http://sqld:8080`.

Пересоздать локальную БД с нуля:

```bash
docker compose down
rm -rf server/db/data/sqld
docker compose up -d sqld
```

## License

Source code is licensed under the [MIT License](./LICENSE).

Brand assets — the name, logo and images in this repository — are not covered
by the license. See [NOTICE](./NOTICE) for details.
