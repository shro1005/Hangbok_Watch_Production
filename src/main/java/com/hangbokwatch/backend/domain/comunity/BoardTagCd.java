package com.hangbokwatch.backend.domain.comunity;

import com.hangbokwatch.backend.domain.player.PlayerForRankingId;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.time.LocalDateTime;

@Entity(name = "board_tag_cd")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(BoardTagCdId.class)
@Builder
public class BoardTagCd {

    @Id
    @Column(name = "category_cd")
    private String categoryCd;

    @Id
    @Column(name = "board_tag_cd")
    private String boardTagCd;

    @Column(name = "category_val")
    private String categoryVal;

    @Column(name = "board_tag_val")
    private String boardTagVal;

    @Column(name = "use_yn")
    private String useYN;

    @CreationTimestamp
    @Column(name="rgt_dtm", nullable = true)
    private LocalDateTime rgtDtm;

    @UpdateTimestamp
    @Column(name="udt_dtm", nullable = true)
    private LocalDateTime udtDtm;
}
