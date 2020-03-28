ALTER TABLE board ADD COLUMN board_tag_cd varchar(2);

create table if not EXISTS board_tag_cd
(category_cd varchar(2) , board_tag_cd varchar(2) , category_val varchar(10),
board_tag_val varchar(10), use_yn varchar(1), rgt_dtm timestamp without time zone, udt_dtm timestamp without time zone,
primary key(category_cd, board_tag_cd));

insert into board_tag_cd values ('01', '01', '익명게시판', '공지', 'Y', null, null);
insert into board_tag_cd values ('01', '02', '익명게시판', '잡담', 'Y', null, null);
insert into board_tag_cd values ('01', '03', '익명게시판', '리그', 'Y', null, null);
insert into board_tag_cd values ('01', '04', '익명게시판', '워크숍', 'Y', null, null);
insert into board_tag_cd values ('02', '01', '듀오/파티 모집', '공지', 'Y', null, null);
insert into board_tag_cd values ('02', '02', '듀오/파티 모집', '파티모집', 'Y', null, null);
insert into board_tag_cd values ('02', '03', '듀오/파티 모집', '탱커모집', 'Y', null, null);
insert into board_tag_cd values ('02', '04', '듀오/파티 모집', '딜러모집', 'Y', null, null);
insert into board_tag_cd values ('02', '05', '듀오/파티 모집', '힐러모집', 'Y', null, null);
insert into board_tag_cd values ('02', '06', '듀오/파티 모집', '빠대모집', 'Y', null, null);