package com.hangbokwatch.backend.dao.community;

import com.hangbokwatch.backend.domain.comunity.BoardTagCd;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardTagCdRepository extends JpaRepository<BoardTagCd, String> {
    List<BoardTagCd> findBoardTagCdsByUseYNAndCategoryCdOrderByBoardTagCdAsc(String useYN, String categoryCd);
}
