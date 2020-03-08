package com.hangbokwatch.backend.dao.hero;

import com.hangbokwatch.backend.domain.hero.BanHero;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BanHeroRepository extends JpaRepository<BanHero, String> {
    List<BanHero> findAllByUseYN(String useYN);
}
