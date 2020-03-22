create table if not EXISTS board
(id SERIAL PRIMARY KEY, title varchar(250), contents varchar(10000), player_id bigint not null,
battle_tag varchar(50), del_YN varchar(1), see_count bigint default 0, like_count bigint default 0,
rgt_dtm varchar(14), udt_dtm varchar(14));


create table if not EXISTS comment
(id SERIAL PRIMARY KEY, contents varchar(2000), player_id bigint not null,
battle_tag varchar(50), like_count bigint default 0, del_YN varchar(1),
rgt_dtm varchar(14), udt_dtm varchar(14), board_id integer, comment_id integer,
foreign key(board_id) references board (id),
foreign key(comment_id) references comment(id));
