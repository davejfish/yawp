-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS rest_reviews;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE
);

CREATE TABLE restaurants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE rest_reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rest_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  stars INT NOT NULL,
  review varchar(255) NOT NULL,
  FOREIGN KEY (rest_id) REFERENCES restaurants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO restaurants
(name)
VALUES
('Imagine'),
('CoCoIchibanya'),
('have a good slice');

INSERT INTO users
(username, password_hash, email)
VALUES
('yawper', '$2b$10$GOi9xgKDsVwO8JXRr6jBlOkOm4DaZ3IKopWy6DBJ.BuAX79H1f6Yy', 'yawper@yawp.com'),
('critic', '$2b$10$GOi9xgKDsVwO8JXRr6jBlOkOm4DaZ3IKopWy6DBJ.BuAX79H1f6Yy', 'critic@yawp.com'),
('kev', 'fakehash', 'stuff@yawp.com');

INSERT INTO rest_reviews
(rest_id, user_id, stars, review)
VALUES
('1', '1', '5', 'best miso ramen of all time'),
('1', '1', '5', '15/10 best ever'),
('1', '3', '5', 'karaage so juicy'),
('2', '2', '5', 'COCOICHI LETS GO'),
('2', '1', '5', 'KARAAGE CURRY!!!!'),
('2', '3', '4', 'veggie curry changed my life'),
('3', '1', '3', 'new york style pizza in Japan. 8/10.');
