package com.hangbokwatch.backend.domain.comunity;

import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
public class BoardTagCdId implements Serializable {
    @EqualsAndHashCode.Include
    @Id
    @Column(name = "category_cd")
    private String categoryCd;

    @EqualsAndHashCode.Include
    @Id
    @Column(name = "board_tag_cd")
    private String boardTagCd;
}
