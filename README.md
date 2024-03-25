# Сайт компании Биплан-Дизайн

"Чистая" архитектура /server

- `api` - контроллеры | оперируют use-кейсами
- `use-cases` - use-кейсы
- `use-cases/types` - интерфейсы репозиториев
- `infra` - репозитории

Реализовано

- ui с помощью shadcn-vue
- бд на supabase
- админ-панель с регистрацией
- управление проектами
- загрузка изображений в локальную директорию
- кастомный порядок размещения изображений
- оптимизация изображений
- open-graph
- состояние в url

TODO

- [ ] таблица бд
- [ ] dbd для элементов
- [ ] seo
- [ ] возможность добавлять проекты в разные категории внутри группы
- [ ] 3d модели проектов
