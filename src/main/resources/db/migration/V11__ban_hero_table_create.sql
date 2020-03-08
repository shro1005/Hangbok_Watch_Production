create table if not EXISTS banhero
(role varchar(10) not null, hero_name varchar(50), hero_name_KR varchar(50), start_date varchar(14),
end_date varchar(14), use_yn varchar(1), primary key(role));
