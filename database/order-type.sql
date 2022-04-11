CREATE TABLE order_types (id SERIAL PRIMARY KEY, name VARCHAR(10));
INSERT INTO order_types (name)
VALUES ('外卖');
INSERT INTO order_types (name)
VALUES ('快递');
INSERT INTO order_types (name)
VALUES ('超市');
INSERT INTO order_types (name)
VALUES ('打印');
INSERT INTO order_types (name)
VALUES ('其它');