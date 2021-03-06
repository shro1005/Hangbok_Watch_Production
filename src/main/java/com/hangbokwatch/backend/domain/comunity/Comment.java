package com.hangbokwatch.backend.domain.comunity;

import lombok.*;
import lombok.extern.apachecommons.CommonsLog;
import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "comment")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer commentId;

    @Column(name = "contents")
    private String contents;

    @Column(name = "player_id")
    private Long playerId;

    @Column(name = "battle_tag")
    private String battleTag;

    @Column(name = "like_count")
    private Long likeCount;

    @Column(name = "del_YN")
    private String delYN;

    @Column(name = "rgt_dtm")
    private String rgtDtm;

    @Column(name = "udt_dtm")
    private String udtDtm;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Comment> commentList = new ArrayList<Comment>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    @JsonIgnore
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
        if(this.commentList != null && this.commentList.size() > 0) {
            for (Comment c : commentList) {
                c.setComment(this);
            }
        }
    }
}
