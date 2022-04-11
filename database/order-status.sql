CREATE TABLE order_status (id SMALLSERIAL PRIMARY KEY, name VARCHAR2(10));
INSERT INTO order_status (name)
VALUES ('待接单');
INSERT INTO order_status (name)
VALUES ('已接单');
INSERT INTO order_status (name)
VALUES ('已完成');