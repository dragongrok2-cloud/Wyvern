# Как помочь дракону

Спасибо, что хочешь добавить огня в Wyvern.

## Быстрый старт для вклада

```bash
git clone https://github.com/dragongrok2-cloud/Wyvern.git
cd Wyvern
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

## Стиль

- TypeScript строгий, без `any` если можно.
- Компоненты — в `src/components`, API — в `src/app/api`.
- Схема БД меняется только через Prisma.
- Сообщения коммитов: коротко и по делу (`feat: threads ui`, `fix: voice token`).

## Pull Request

1. Ветка от `main`.
2. Один смысл на PR.
3. Опиши, что изменилось для всадника, а не только для компилятора.
4. Если трогаешь схему — обнови `prisma/seed.ts`.

## Кодекс логова

Будь добр к людям и к драконам. Никакого огня без причины.
