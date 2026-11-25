# Hostess

Курсовой проект — система бронирования столов для ресторана. Рабочее место хостес: видно, кто и на какое время забронировал стол, можно оформить резерв или банкет, отменить бронь, найти гостя.

## Что умеет

- вход по PIN-коду, две роли: администратор и официант
- список броней на выбранный день, переключение дней стрелками
- фильтры: все / банкеты / резервы / только активные
- подсветка броней: за 30 минут до прихода гостей — «пора готовить стол», если гости опаздывают больше 10 минут — «опаздывают»
- создание и редактирование брони, поиск гостя по имени или телефону, новый гость добавляется прямо в форме
- для банкета дополнительно указываются меню и депозит
- нельзя забронировать стол, если на это время он уже занят
- отмена и восстановление брони
- список сам обновляется раз в минуту
- администратор может поменять PIN-коды в настройках

## Стек

- **Backend:** Java 17, Spring Boot 3.2.5 (Web, Data JPA, Security, Validation), Lombok, Maven
- **Frontend:** React 18, Vite 5, React Router, Axios
- **БД:** MySQL 8

## Как устроен проект

Фронтенд и бэкенд — два отдельных приложения. React-сайт отправляет запросы на сервер (`http://localhost:8080/api`), сервер работает с базой через Hibernate и возвращает JSON.

```text
hostess-backend/   — сервер на Spring Boot
  ├── config/      — настройки Security и CORS
  ├── controller/  — REST-контроллеры
  ├── model/       — сущности (по ним Hibernate создаёт таблицы)
  ├── repository/  — запросы к базе через Spring Data JPA
  └── service/     — бизнес-логика (проверка занятости столов и т.д.)

hostess-frontend/  — интерфейс на React
  └── src/
      ├── pages/   — 4 страницы: вход, список броней, форма брони, настройки
      ├── api.js   — настройки Axios и запросы к серверу
      └── App.jsx  — маршруты между страницами
```

## База данных

Таблицы создаются сами при первом запуске (`ddl-auto=update`), вручную нужно создать только саму базу.

- `guests` — гости: имя, фамилия, телефон (уникальный), комментарий
- `tables` — столы: номер, вместимость, зал
- `reservations` — брони: тип (`RESERVE` / `BANQUET`), статус, дата, время, длительность, кол-во гостей, комментарий. Ссылается на гостя и стол
- `banquets` — доп. данные банкета: депозит и примечание к меню. Связь один к одному с бронью
- `menu_items` — позиции меню банкета

Статусы брони: `NEW`, `ACTIVE`, `LATE`, `PREPARING`, `COMPLETED`, `CANCELLED`.

## Запуск

Нужны JDK 17+, Node.js 18+ и MySQL.

**1. База данных**

Создать пустую базу:
```sql
CREATE DATABASE hostess_db;
```

Логин и пароль от MySQL лежат в `hostess-backend/src/main/resources/application.properties` (по умолчанию `root` / `root1234`). Если база на другом компьютере, вместо `localhost` в `spring.datasource.url` пишется его IP.

**2. Сервер**

```bash
cd hostess-backend
mvnw.cmd spring-boot:run
```
(или просто запустить `HostessBackendApplication` в IDE). Поднимается на порту `8080`.

**3. Сайт**

```bash
cd hostess-frontend
npm install
npm run dev
```
Открывается на `http://localhost:5173`. Чтобы зайти с телефона или другого ноутбука в той же Wi-Fi сети — `npm run dev -- --host`.

**Вход:** администратор — `1234`, официант — `5555`.

Перед тем как создавать брони, в базе должен быть хотя бы один стол. Можно добавить сразу в MySQL Workbench:
```sql
USE hostess_db;

INSERT INTO `tables` (number, capacity, hall_name) VALUES
(1, 2, 'Основной зал'),
(2, 4, 'Основной зал'),
(3, 6, 'VIP-зал');
```

## API

Все адреса начинаются с `http://localhost:8080/api`.

**Брони**
```text
GET    /reservations?date=2026-12-01          брони на дату (можно добавить &type=BANQUET)
GET    /reservations/{id}                     получить бронь по ID
POST   /reservations?guestId=1&tableId=1      создать бронь
PUT    /reservations/{id}                     изменить бронь
PATCH  /reservations/{id}/status?status=...   сменить статус
PATCH  /reservations/{id}/cancel              отменить бронь
DELETE /reservations/{id}                     удалить бронь
```

**Гости**
```text
GET    /guests                                список всех гостей
GET    /guests/search?name=...  или  ?phone=...
GET    /guests/{id}
POST   /guests
PUT    /guests/{id}
DELETE /guests/{id}
```

**Столы**
```text
GET    /tables
POST   /tables
DELETE /tables/{id}
```

**Банкеты**
```text
GET    /banquets
GET    /banquets/{id}
GET    /banquets/by-reservation/{reservationId}
POST   /banquets?reservationId=1
PUT    /banquets/{id}
DELETE /banquets/{id}
```

Примеры запросов для проверки:
```json
POST /api/tables
{ "number": 1, "capacity": 4, "hallName": "Основной" }

POST /api/guests
{ "name": "Елена", "surname": "Иванова", "phone": "89990001122" }

POST /api/reservations?guestId=1&tableId=1
{ "type": "BANQUET", "date": "2026-12-01", "timeStart": "19:00", "durationHours": 3, "guestsCount": 4 }
```

## Проверка занятости стола

Главная логика на сервере (`TableService.isTableAvailable`). Берутся все брони стола на этот день, отменённые пропускаются, и для каждой проверяется, пересекается ли она по времени с новой:

```text
начало_новой < конец_старой  и  конец_новой > начало_старой
```

Если хоть одна пересекается — стол занят, бронь не сохраняется.
