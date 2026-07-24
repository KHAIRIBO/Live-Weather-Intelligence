CREATE TABLE IF NOT EXISTS weather_comments (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)     NOT NULL,
  comment    TEXT             NOT NULL,
  city       VARCHAR(100)     NOT NULL,
  country    VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
