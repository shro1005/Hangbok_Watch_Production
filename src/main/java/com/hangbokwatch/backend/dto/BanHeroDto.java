package com.hangbokwatch.backend.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BanHeroDto {
    private String heroNameTank;
    private String heroNameKRTank;
    private String heroNameDeal1;
    private String heroNameKRDeal1;
    private String heroNameDeal2;
    private String heroNameKRDeal2;
    private String heroNameHeal;
    private String heroNameKRHeal;
}
