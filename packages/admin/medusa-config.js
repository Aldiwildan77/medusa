const dotenv = require("dotenv")

let ENV_FILE_NAME = ""
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production"
    break
  case "staging":
    ENV_FILE_NAME = ".env.staging"
    break
  case "test":
    ENV_FILE_NAME = ".env.test"
    break
  case "development":
  default:
    ENV_FILE_NAME = ".env"
    break
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME })
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001"

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000"

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default"

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"

const MIDTRANS = {
  client_key: process.env.MIDTRANS_CLIENT_KEY,
  server_key: process.env.MIDTRANS_SERVER_KEY,
  is_production: process.env.MIDTRANS_IS_PRODUCTION === "true",
  host: process.env.MIDTRANS_HOST || "https://api.sandbox.midtrans.com",
  expiry: process.env.MIDTRANS_EXPIRY || 10,
  expiry_unit: process.env.MIDTRANS_EXPIRY_UNIT || "minutes",
  country_code: process.env.MIDTRANS_CURRENCY || "IDR",
  time_format: "yyyy-MM-dd hh:mm:ss Z",
}

const RAJAONGKIR = {
  host: process.env.RAJAONGKIR_HOST,
  api_key: process.env.RAJAONGKIR_API_KEY,
}

const APPLICATION = {
  host: process.env.APPLICATION_HOST || "http://localhost:8000",
}

// plugins
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
]

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
}

// /** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */

/** @type {import('./src/types/project-config').ProjectConfig } */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  midtrans: MIDTRANS,
  rajaongkir: RAJAONGKIR,
  application: APPLICATION,
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
}

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
}
