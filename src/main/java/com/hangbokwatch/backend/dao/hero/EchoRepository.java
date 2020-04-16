package com.hangbokwatch.backend.dao.hero;

import com.hangbokwatch.backend.domain.hero.Echo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EchoRepository extends JpaRepository<Echo, Long> {
    //Id로 상세정보 조회
    Echo findAnaById(Long playerId);
}
