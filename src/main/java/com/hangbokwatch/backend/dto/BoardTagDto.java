package com.hangbokwatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardTagDto {
    private String categoryCd ;
    private String boardTagCd ;
    private String categoryVal;
    private String boardTagVal;
}
