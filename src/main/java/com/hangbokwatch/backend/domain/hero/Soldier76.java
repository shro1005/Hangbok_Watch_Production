package com.hangbokwatch.backend.domain.hero;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Entity(name="soldier76")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Soldier76 {
    /**공통 데이터*/
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "win_game")
    private Integer winGame;

    @Column(name = "lose_game")
    private Integer loseGame;

    //    @Column(name = "draw_game")
//    private Integer drawGame;
//
    @Column(name = "entire_game")
    private Integer entireGame;

    @Column(name = "win_rate")
    private String winRate;

    @Column(name = "play_time")
    private String playTime;

    @Column(name = "kill_per_death")
    private String killPerDeath;

//    @Column(name = "deaths")
//    private Long deaths;

    @Column(name = "spent_on_fire_avg")
    private String spentOnFireAvg;

    @Column(name = "death_avg")
    private String deathAvg;

    @Column(name = "heal_per_life")
    private String healPerLife;

    @Column(name = "last_hit_per_life")
    private String lastHitPerLife;

    @Column(name = "damage_to_hero_per_life")
    private String damageToHeroPerLife;

    @Column(name = "damage_to_shield_per_life")
    private String damageToShieldPerLife;

    /**영웅별 특수 데이터*/
    @Column(name = "helix_rocket_kill_avg")
    private String helixRocketKillAvg;

    @Column(name = "tactical_visor_kill_avg")
    private String tacticalVisorKillAvg;

    @Column(name = "critical_hit_rate")
    private String criticalHitRate;

    @Column(name = "solo_kill_avg")
    private String soloKillAvg;

    /**메달 데이터*/
    @Column(name = "gold_medal")
    private String goldMedal;

    @Column(name = "silver_medal")
    private String silverMedal;

    @Column(name = "bronze_medal")
    private String bronzeMedal;

    @Override
    public String toString() {
        return "Soldier76{" +
                "id=" + id +
                ", winGame=" + winGame +
                ", loseGame=" + loseGame +
                ", winRate='" + winRate + '\'' +
                ", playTime='" + playTime + '\'' +
                ", killPerDeath='" + killPerDeath + '\'' +
                ", spentOnFireAvg='" + spentOnFireAvg + '\'' +
                ", deathAvg='" + deathAvg + '\'' +
                ", healPerLife='" + healPerLife + '\'' +
                ", lastHitPerLife='" + lastHitPerLife + '\'' +
                ", damageToHero='" + damageToHeroPerLife + '\'' +
                ", damageToShieldPerLife='" + damageToShieldPerLife + '\'' +
                ", helixRocketKillAvg='" + helixRocketKillAvg + '\'' +
                ", tacticalVisorKillAvg='" + tacticalVisorKillAvg + '\'' +
                ", criticalHitRate='" + criticalHitRate + '\'' +
                ", soloKillAvg='" + soloKillAvg + '\'' +
                ", goldMedal='" + goldMedal + '\'' +
                ", silverMedal='" + silverMedal + '\'' +
                ", bronzeMedal='" + bronzeMedal + '\'' +
                '}';
    }
}
