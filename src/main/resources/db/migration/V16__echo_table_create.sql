create table if not EXISTS echo
(id bigint not null, win_game int, lose_game int, entire_game int, win_rate varchar(7), play_time varchar(10), kill_per_death varchar(10),
 spent_on_fire_avg varchar(10), death_avg varchar(10), last_hit_per_life varchar(10), damage_to_hero_per_life varchar(10), damage_to_shield_per_life varchar(10),
 forcusing_beam_kill_avg varchar(10), sticky_bombs_kill_avg varchar(10), duplicate_kill_avg varchar(10), solo_kill_avg varchar(10),
 gold_medal varchar(10), silver_medal varchar(10), bronze_medal varchar(10), primary key (id));
