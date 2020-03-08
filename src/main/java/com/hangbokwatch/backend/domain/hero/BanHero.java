package com.hangbokwatch.backend.domain.hero;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Entity(name = "banhero")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BanHero {

    @Id
    @Column (name = "role")
    private String role;

    @Column (name = "hero_name")
    private String heroName;

    @Column (name = "hero_name_KR")
    private String heroNameKR;

    @Column (name = "start_date")
    private String startDate;

    @Column (name = "end_date")
    private String endDate;

    @Column (name = "use_yn")
    private String useYN;

}
