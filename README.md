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
  - `drizzle` + `s3`
  - Сессии на куках
  - Регистрация администраторов сайта и управление аккаунтом
  - SEO: robost.txt, sitemap.yml, open-graph

## Архитектура бэкенда

- `server/db` — схема Drizzle и подключение к libsql.
- `server/repositories` — по одному репозиторию на сущность: запросы к БД/S3
  и готовые к отдаче DTO в одном месте.
- `server/api/trpc` — tRPC-роутер: валидация входа и вызов репозитория.

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

## Прод-образ

CI публикует образ на каждый push в `main`:
`ghcr.io/artemiy111/biplane-design:latest`.

```bash
docker run -d --name biplane-design -p 3000:3000 \
  -e BASE_URL=http://localhost:3000 \
  -e DATABASE_URL=http://sqld:8080 \
  -e DATABASE_AUTH_TOKEN=... \
  -e AWS_ACCESS_KEY_ID=... \
  -e AWS_SECRET_ACCESS_KEY=... \
  -e ENDPOINT_URL=... \
  -e REGION=... \
  -e BUCKET_NAME=... \
  ghcr.io/artemiy111/biplane-design:latest
```

## License

Source code is licensed under the [MIT License](./LICENSE).

Brand assets — the name, logo and images in this repository — are not covered
by the license. See [NOTICE](./NOTICE) for details.
