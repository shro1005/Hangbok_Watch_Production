package com.hangbokwatch.backend.domain.comunity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "board")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreeBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer boardId;

    @Column(name = "title")
    private String title;

    @Column(name = "contents")
    private String contents;

    @Column(name = "player_id")
    private Long playerId;

    @Column(name = "battle_tag")
    private String battleTag;

    @Column(name = "del_YN")
    private String delYN;

    @Column(name = "see_count")
    private Long seeCount;

    @Column(name = "like_count")
    private Long likeCount;

    @Column(name = "rgt_dtm")
    private String rgtDtm;

    @Column(name = "udt_dtm")
    private String udtDtm;

    @OneToMany(mappedBy = "freeBoard", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Comment> commentList = new ArrayList<Comment>();

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
        if(this.commentList != null && this.commentList.size() > 0) {
            for (Comment c : commentList) {
                c.setFreeBoard(this);
            }
        }
    }
}
