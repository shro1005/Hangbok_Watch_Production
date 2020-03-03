package com.hangbokwatch.backend.dao.hero;

import com.hangbokwatch.backend.domain.hero.Mercy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MercyRepository extends JpaRepository<Mercy, Long> {
    //Id로 상세정보 조회
    Mercy findMercyById(Long playerId);
}
