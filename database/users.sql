CREATE TABLE users (
  id UUID,
  role_id SMALLINT,
  phone CHAR(11),
  hashed_password CHAR(60),
  nick_name VARCHAR(40),
  real_name VARCHAR(40),
  qq VARCHAR(12),
  avatar_url VARCHAR(100),
  balance NUMERIC(8, 2),
  credit NUMERIC(2, 1)
);