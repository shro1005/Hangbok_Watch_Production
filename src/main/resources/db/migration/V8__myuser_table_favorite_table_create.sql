create table if not EXISTS myuser
 (id bigint not null, battle_tag varchar(255) not null, email varchar(255), role varchar(255) ,
 troll_index integer, bad_speaker_index integer, last_login_dtm varchar(14), rgt_dtm timestamp without time zone,
 udt_dtm timestamp without time zone, primary key (id));

 create table if not EXISTS favorite
 (id bigint not null, clicked_id bigint not null, like_or_not varchar(1),
 rgt_dtm timestamp without time zone, udt_dtm timestamp without time zone, primary key (id, clicked_id));