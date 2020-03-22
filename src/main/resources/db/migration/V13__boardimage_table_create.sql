create table if not EXISTS boardimage
(id SERIAL PRIMARY KEY, original_name varchar (2000), size bigint,
rgt_dtm timestamp without time zone, udt_dtm timestamp without time zone);