CREATE TABLE orders (
  id UUID,
  type_id SMALLINT,
  status_id SMALLINT,
  placed_time TIMESTAMPTZ,
  taken_time TIMESTAMPTZ,
  finished_time TIMESTAMPTZ,
  placed_user_id UUID,
  taken_user_id UUID,
  description VARCHAR(200),
  cost NUMERIC(4, 2)
);