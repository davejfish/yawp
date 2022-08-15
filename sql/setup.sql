-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE
);

INSERT INTO users
(username, password_hash, email)
VALUES
('yawper', 'fakehash', 'yawper@yawp.com'),
('critic', 'fakehash', 'critic@yawp.com'),
('kev', 'fakehash', 'stuff@yawp.com');
