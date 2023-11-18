import Pool from 'pg'

export const db = new Pool.Pool({
  user: 'postgres',
  host: 'monorail.proxy.rlwy.net',
  database: 'railway',
  password: 'FBEgAf-52F3GG2F6ef6gd2CbAd15eDE5',
  port: 41965,
})
