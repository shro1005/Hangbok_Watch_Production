package com.hangbokwatch.backend.dao.community;

import com.hangbokwatch.backend.domain.comunity.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BoardImageRepository extends JpaRepository<BoardImage, Integer> {
    @Query(value = "SELECT i.id FROM boardimage i ORDER BY i.id DESC offset ?1 limit ?2", nativeQuery = true)
    Integer selectLastId(int offset, int limit);
}
