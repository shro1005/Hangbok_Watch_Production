create table if not EXISTS playerdetail
(id bigint not null, season bigint not null, hero_order int not null, hero_name varchar(30) , hero_name_kr varchar(30), kill_per_death varchar(10),
 win_rate varchar(10), play_time varchar(10), death_avg varchar(10), heal_per_life varchar(10),
 block_damage_per_life varchar(10), damage_to_hero_per_life varchar(10), damage_to_shield_per_life varchar(10), index1 varchar(10),
 index2 varchar(10), index3 varchar(10), index4 varchar(10), index5 varchar(10), spent_on_fire_avg varchar(10), last_hit_per_life varchar(10),
 title1 varchar(30), title2 varchar(30), title3 varchar(30), title4 varchar(30), title5 varchar(30), primary key (id, season, hero_order));