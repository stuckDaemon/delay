# Freight Delay Notification System

A NestJS-based notification system that monitors freight delivery traffic and notifies customers of delays using Mapbox, OpenAI, and Twilio.

---

## 🧱 Tech Stack

- **Backend Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (via Docker)
- **ORM**: Sequelize + sequelize-typescript
- **Scheduler**: `@nestjs/schedule` with cron jobs
- **Traffic API**: Mapbox Directions API
- **AI API**: OpenAI GPT-4o-mini
- **Notifications**: Twilio (SMS)
- **Logging**: Winston with structured function-aware logs

---

## 🐳 Running Locally

### 1. Clone and install

```bash
yarn install
````

### 2. Set up `.env`

Create a `.env` file in the root:

```env
DATABASE_URL=postgres://user:pass@localhost:5432/freightdb
MAPBOX_TOKEN=your-mapbox-token
OPENAI_API_KEY=your-openai-key
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
USE_MOCK_TRAFFIC=false
CHECK_INTERVAL_MINUTES=5
```

### 3. Start Postgres with Docker

```bash
docker-compose up -d
```

### 4. Run migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Start the app

```bash
yarn start:dev
```

---

## 🚦 Delivery Monitoring Logic

The app checks every N minutes (cron job):

* Fetches all pending deliveries (`delivered: false`)
* Uses Mapbox to calculate estimated delay
* Based on `lastKnownDelay`:

    * Sends first-time delay message
    * Sends updated message if delay increases
    * Notifies if delay improves or clears
* Updates the delay in the DB
* Uses OpenAI GPT-4o-mini for message generation
* Sends SMS via Twilio

---

## 📬 API Endpoints

### ✅ Create a new delivery

```bash
curl -X POST http://localhost:3000/deliveries \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Alice Johnson",
    "contact": "+393278513007",
    "origin": "13.388860,52.517037",
    "destination": "13.397634,52.529407"
  }'
```

---

### ✏️ Update a delivery (e.g. mark as delivered)

```bash
curl -X PUT http://localhost:3000/deliveries \
  -H "Content-Type: application/json" \
  -d '{
    "id": "your-delivery-id",
    "delivered": true
  }'
```

---

### 🚀 Trigger traffic check manually

```bash
curl -X POST http://localhost:3000/scheduler/check
```

(If `SchedulerController` is exposed for manual triggers)

---

## 🗃 Database Schema

**Table:** `deliveries`

| Column         | Type    | Description                         |
| -------------- | ------- | ----------------------------------- |
| id             | UUID    | Primary key                         |
| customerName   | string  | Customer full name                  |
| contact        | string  | Phone number or email               |
| origin         | string  | Origin coordinates (lng,lat)        |
| destination    | string  | Destination coordinates (lng,lat)   |
| lastKnownDelay | number  | Delay in minutes                    |
| delivered      | boolean | Whether the delivery is completed   |
| createdAt      | date    | Timestamp of creation               |
| updatedAt      | date    | Timestamp of last update            |
| deletedAt      | date    | Timestamp of deletion (soft delete) |

---

## 🧪 Testing

Run the following after starting the app:

```bash
curl -X POST http://localhost:3000/deliveries ...
curl -X PUT  http://localhost:3000/deliveries ...
```

You should receive notifications and logs in the console confirming status.

---

## 📈 Logging

Logs are printed to stdout with:

* Timestamp
* Log level
* Calling function name
* Structured error details on failure

Set `DEBUG_LOGS_ACTIVE=true` in `.env` to enable debug logs.

---

## 📦 Notes

* This project uses `paranoid: true` (soft deletes)
* All calls are logged with structured metadata
* Works with real or mocked traffic data (`USE_MOCK_TRAFFIC=true`)
* Includes resilience fallback for AI failures (static message)

---