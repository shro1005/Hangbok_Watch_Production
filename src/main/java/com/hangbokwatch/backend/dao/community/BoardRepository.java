package com.hangbokwatch.backend.dao.community;

import com.hangbokwatch.backend.domain.comunity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {
    Page<Board> findAllByPlayerIdAndDelYNOrderByBoardIdDesc(Long playerId, String delYN, Pageable pageable);

    Page<Board> findAllByCategoryCdAndDelYNAndBoardTagCdNotOrderByBoardIdDesc(String categoryCd, String delYN, String boardTagCd, Pageable pageable);

    Page<Board> findAllByCategoryCdAndBoardTagCdAndDelYNAndBoardTagCdNotOrderByBoardIdDesc(String categoryCd, String boardTagCd, String delYN, String boardTagCd2, Pageable pageable);

    Page<Board> findAllByCategoryCdAndDelYNAndSeeCountGreaterThanEqualAndBoardTagCdNotOrderByBoardIdDesc(String categoryCd, String delYN, Long count, String boardTagCd,Pageable pageable);

    @Query(value="SELECT * FROM board b WHERE b.player_id LIKE ?1 AND b.del_yn = ?2 ORDER BY b.id DESC offset ?4 limit ?3", nativeQuery = true)
    List<Board> findListByPlayerIdAndDelYNOrderByBoardIdDesc(Long playerId, String delYN, int limit, int offset);

    @Query(value="SELECT * FROM board b WHERE b.category_cd = ?1 AND b.del_yn = ?2 AND b.board_tag_cd != '01' ORDER BY b.id DESC offset ?4 limit ?3", nativeQuery = true)
    List<Board> findListByCategoryCdAndDelYNOrderByBoardIdDesc(String categoryCd, String delYN, int limit, int offset);

    @Query(value="SELECT * FROM board b WHERE b.category_cd = ?1 AND b.board_tag_cd = ?2 AND b.del_yn = ?3 AND b.board_tag_cd != '01' ORDER BY b.id DESC offset ?5 limit ?4", nativeQuery = true)
    List<Board> findListByCategoryCdAndBoardTagCdAndDelYNOrderByBoardIdDesc(String categoryCd, String boardTagCd, String delYN, int limit, int offset);

    @Query(value="SELECT * FROM board b WHERE b.category_cd = ?1 AND b.del_yn = ?2 AND b.like_count >= ?3 AND b.board_tag_cd != '01' ORDER BY b.id DESC offset ?5 limit ?4", nativeQuery = true)
    List<Board> findListByCategoryCdAndDelYNAndSeeCountGreaterThanEqualOrderByBoardIdDesc(String categoryCd, String delYN, Long count, int limit, int offset);

    @Query(value="SELECT * FROM board b WHERE b.category_cd = ?1 AND b.board_tag_cd = ?2 AND b.del_yn = ?3 ORDER BY b.id DESC offset ?5 limit ?4", nativeQuery = true)
    List<Board> findNoticeListByCategoryCdAndBoardTagCdAndDelYNOrderByBoardIdDesc(String categoryCd, String boardTagCd, String delYN, int limit, int offset);

}
