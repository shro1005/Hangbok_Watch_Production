package com.hangbokwatch.backend.dao.community;

import com.hangbokwatch.backend.domain.comunity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {
    Page<Board> findAllByPlayerIdAndDelYNOrderByBoardIdDesc(Long playerId, String delYN, Pageable pageable);

    Page<Board> findAllByCategoryCdAndDelYNOrderByBoardIdDesc(String categoryCd, String delYN, Pageable pageable);

    Page<Board> findAllByCategoryCdAndBoardTagCdAndDelYNOrderByBoardIdDesc(String categoryCd, String boardTagCd, String delYN, Pageable pageable);

    Page<Board> findAllByCategoryCdAndDelYNAndSeeCountGreaterThanEqualOrderByBoardIdDesc(String categoryCd, String boardTagCd, Long count, Pageable pageable);

}
