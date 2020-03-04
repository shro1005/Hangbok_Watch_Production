package com.hangbokwatch.backend.service;

import com.hangbokwatch.backend.dao.player.PlayerRepository;
import com.hangbokwatch.backend.domain.player.Player;
import com.hangbokwatch.backend.dto.PlayerListDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class SearchPlayerListService {
    @Autowired
    PlayerRepository playerRepository;

    public List<PlayerListDto> searchPlayerList(String playerName, Map<String, Object> sessionItems) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} | searchPlayerList 호출 | 검색값 : {}", sessionBattleTag, playerName);
        List<PlayerListDto> playerListDtos = new ArrayList<PlayerListDto>();
        List<Player> searchResult = new ArrayList<Player>();
        if(playerName.indexOf("#") == -1) {  // 검색 유형이 배틀태그가 아닌경우 (그냥 유저명)
            playerName = playerName.toUpperCase();
            log.debug("{} | searchPlayerList 진행 | {}에 해당하는 플레이어들을 DB조회(플레이어명)", sessionBattleTag, playerName);
            searchResult = playerRepository.findByPlayerNameIgnoreCase(playerName);
        }else{
            log.debug("{} | searchPlayerList 진행 | {}에 해당하는 플레이어를 DB조회(배틀태그)", sessionBattleTag, playerName);
            searchResult = playerRepository.findByBattleTag(playerName);
        }

        log.debug("{} | searchPlayerList 진행 | {}에 해당하는 플레이어 데이터({}건)", sessionBattleTag, playerName, searchResult.size());
        for (Player player : searchResult) {
            Integer wingame = player.getWinGame(); Integer losegame = player.getLoseGame();
            Double winRate = 0d; Integer winRateInt = 0;
            if(wingame != null && losegame != null) {
                winRate = (new Double(player.getWinGame()) / new Double(player.getWinGame() + player.getLoseGame()) * 100);
                winRateInt = (int) (double) winRate;
            }

            PlayerListDto playerListDto = new PlayerListDto(player.getId(), player.getBattleTag(), player.getPlayerName(), player.getForUrl(), player.getPlayerLevel()
            , player.getIsPublic(), player.getPlatform(), player.getPortrait(), player.getTankRatingPoint(), player.getDealRatingPoint(), player.getHealRatingPoint()
            , player.getTankRatingImg(), player.getDealRatingImg(), player.getHealRatingImg()
            , player.getWinGame(), player.getLoseGame(), player.getDrawGame(), Integer.toString(winRateInt)
            , player.getMostHero1(), player.getMostHero2(), player.getMostHero3(), player.getUdtDtm().format(DateTimeFormatter.ISO_DATE));

            log.debug("{} | searchPlayerList 진행 | {}에 해당하는 플레이어 데이터 : {}", sessionBattleTag, playerName, playerListDto.toString());

            int cnt = 3;
            if(playerListDto.getTankRatingPoint() == 0) {cnt--;}
            if(playerListDto.getDealRatingPoint() == 0) {cnt--;}
            if(playerListDto.getHealRatingPoint() == 0) {cnt--;}
            if(cnt == 0 ) {cnt = 1;}
            playerListDto.setCnt(cnt);
            playerListDtos.add(playerListDto);
        }
        Collections.sort(playerListDtos);

        log.info("{} | searchPlayerList 종료 | 검색값 : {}", sessionBattleTag, playerName);
        return playerListDtos;
    }
}
