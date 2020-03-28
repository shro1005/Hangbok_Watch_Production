package com.hangbokwatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardDto {
    private Integer boardId;
    private String title;
    private String contents;
    private Long playerId;
    private String battleTag;
    private Long seeCount;
    private Long likeCount;
    private String rgtDtm;
}
