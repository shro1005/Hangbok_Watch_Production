package com.hangbokwatch.backend.dao.hero;

import com.hangbokwatch.backend.domain.hero.Widowmaker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WidowmakerRepository extends JpaRepository<Widowmaker, Long> {
    //Id로 상세정보 조회
    Widowmaker findWidowmakerById(Long playerId);
}
