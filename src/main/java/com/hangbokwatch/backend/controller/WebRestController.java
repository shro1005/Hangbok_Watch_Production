package com.hangbokwatch.backend.controller;

import com.hangbokwatch.backend.dao.community.BoardTagCdRepository;
import com.hangbokwatch.backend.domain.Season;
import com.hangbokwatch.backend.domain.comunity.Board;
import com.hangbokwatch.backend.domain.comunity.BoardTagCd;
import com.hangbokwatch.backend.domain.hero.BanHero;
import com.hangbokwatch.backend.dto.*;
import com.hangbokwatch.backend.dto.auth.SessionUser;
import com.hangbokwatch.backend.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@RestController
public class WebRestController {

    private final CrawlingPlayerDataService cpl;
    private final SearchPlayerListService spl;
    private final ShowPlayerDetailService spd;
    private final ShowUserFavoriteService suf;
    private final GetRankingDataService grd;
    private final ManagementPageService mps;
    @Autowired
    private BoardTagCdRepository boardTagCdRepository;
    private final HttpSession httpSession;
    @Autowired
    private final CommunityService cs;

    @PostMapping("/showPlayerList")
    public List<PlayerListDto> showPlayerList(@RequestBody PlayerSearchDto playerDto) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        String playerName = playerDto.getPlayerName();
        log.info("{} >>>>>>>> showPlayerList 호출 | 검색값 : {}", sessionBattleTag, playerName);

        List<PlayerListDto> playerList = spl.searchPlayerList(playerName, sessionItems);

        log.info("{} >>>>>>>> showPlayerList 종료 | {}건의 데이터 DB조회 및 회신", sessionBattleTag, playerList.size());
        log.info("===================================================================");
        return playerList;
    }

    @PostMapping("/crawlingPlayerList")
    public List<PlayerListDto> crawlingPlayerList(@RequestBody PlayerSearchDto playerDto) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        String playerName = playerDto.getPlayerName();
        log.info("{} >>>>>>>> crawlingPlayerList 호출 | 검색한 값이 DB에 없어 크롤링합니다. 검색값 : {}", sessionBattleTag, playerName);

        List<PlayerListDto> playerList = cpl.crawlingPlayerList(playerName, sessionItems);

        log.info("{} >>>>>>>> crawlingPlayerList 종료 | {}건의 데이터 크롤링 및 회신", sessionBattleTag, playerList.size());
        log.info("===================================================================");
        return playerList;
    }

    @PostMapping("/getDetailData")
    public Map<String, Object> getDetailData(@RequestBody PlayerSearchDto playerSearchDto) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        Map<String, Object> map = new HashMap<>();
        Long id = playerSearchDto.getId();
        log.info("{} >>>>>>>> getDetailData 호출 | 플레이어의 상세 정보를 조회합니다. 검색값(id) : {}({})", sessionBattleTag, id, playerSearchDto.getBattleTag());
        List<PlayerDetailDto> playerDetailList = spd.selectPlayerHeroDetail(id, sessionItems);
        List<PlayerDetailDto> tierDetailList = spd.getTierDetail(id, sessionItems, playerDetailList);
        List<PlayerDetailDto> rankerDetailList = spd.getRankerDetail(id, sessionItems, playerDetailList);
        List<TrendlindDto> trendlindList = spd.selectPlayerTrendline(id, sessionItems);
        Long nowSeason = spd.getNowSeason(sessionItems);

        map.put("detail", playerDetailList);
        map.put("tierDetail", tierDetailList);
        map.put("rankerDetail", rankerDetailList);
        map.put("trendline", trendlindList);
        map.put("nowSeason", nowSeason);

        log.info("{} >>>>>>>> getDetailData 종료 | detail {}건, trendline {}건 회신", sessionBattleTag, playerDetailList.size(), trendlindList.size());
        log.info("===================================================================");
        return map;
    }

    @PostMapping("/refreshFavorite")
    public String refreshFavorite(@RequestBody PlayerSearchDto favorite) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        Long clickedId = favorite.getId();
        String likeOrNot = favorite.getPlayerName();

        log.info("{} >>>>>>>> refreshFavorite 호출 | 즐겨찾기 버튼 클릭. 클릭한 유저 ID : {}, 좋아요 : {}", sessionBattleTag, clickedId, likeOrNot);

        spd.refreshFavorite(clickedId, likeOrNot, sessionItems);

        log.info("{} >>>>>>>> refreshFavorite 호출 | 즐겨찾기 버튼 클릭 작업 완료", sessionBattleTag);
        log.info("===================================================================");
        return "Success";
    }

    @PostMapping("/myFavorite/getFavoriteData")
    public Map<String, Object> getFavoriteData() {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getFavoriteData 호출 | 즐겨찾기 플레이어 리스트 조회", sessionBattleTag);

        List<PlayerListDto> myFavoritePlayerList = suf.findMyFavoritePlayerList(sessionItems);
        List<PlayerListDto> favoritingMePlayerList = suf.findFavoritingMePlayerList(sessionItems);

        Map<String, Object> map = new HashMap<>();
        map.put("myFavorite", myFavoritePlayerList);
        map.put("favoritingMe", favoritingMePlayerList);

        log.info("{} >>>>>>>> getFavoriteData 호출 | 즐겨찾기 플레이어 리스트 조회 완료", sessionBattleTag);
        log.info("===================================================================");

        return map;
    }

    @PostMapping("/ranking/getRankingData")
    public Map<String, Object> getRankingData() {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getRankingData 호출 | 랭킹 데이터 추출", sessionBattleTag);

        List<PlayerRankingDto> tankRatingRankingList = grd.getTankRatingRankingData(sessionItems);
        List<PlayerRankingDto> dealRatingRankingList = grd.getDealRatingRankingData(sessionItems);
        List<PlayerRankingDto> healRatingRankingList = grd.getHealRatingRankingData(sessionItems);
        List<PlayerRankingDto> playTimeRankingList = grd.getPlayTimeRankingData(sessionItems);
        List<PlayerRankingDto> spentOnFireRankingList = grd.getSpentOnFireRankingData(sessionItems);
        List<PlayerRankingDto> envKillRankingList = grd.getEnvKillRankingData(sessionItems);

        Map<String, Object> map = new HashMap<>();
        map.put("tankRating", tankRatingRankingList);
        map.put("dealRating", dealRatingRankingList);
        map.put("healRating", healRatingRankingList);
        map.put("playTime", playTimeRankingList);
        map.put("spentOnFire", spentOnFireRankingList);
        map.put("envKill", envKillRankingList);

        log.info("{} >>>>>>>> getRankingData 호출 | 랭킹 데이터 추출 완료", sessionBattleTag);
        log.info("===================================================================");

        return map;
    }

    @PostMapping("/ranking/getRankerData")
    public List<PlayerListDto> getRankerData(@RequestBody HashMap<String, Object> recvMap) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        String target = (String) recvMap.get("target");
        int offset = (int) recvMap.get("offset");
        int limit = (int) recvMap.get("limit");

        log.info("{} >>>>>>>> getRankerData 호출 | 랭커 데이터 추출", sessionBattleTag);
        List<PlayerListDto> rankerList = grd.getRankerData(sessionItems, target, offset, limit);
//        List<PlayerListDto> dealRankerList = grd.getDealRankerData(sessionItems, offset, limit);
//        List<PlayerListDto> healRankerList = grd.getHealRankerData(sessionItems, offset, limit);
//        List<PlayerListDto> totalAvgRankerList = grd.getTotalAvgRankerData(sessionItems, offset, limit);

//        Map<String, Object> map = new HashMap<>();
//
//        map.put("rankerList", tankRankerList);
//        map.put("dealRanker", dealRankerList);
//        map.put("healRanker", healRankerList);
//        map.put("totalAvgRanker", totalAvgRankerList);

        log.info("{} >>>>>>>> getRankerData 호출 | 랭커 데이터 추출 완료", sessionBattleTag);
        log.info("===================================================================");

        return rankerList;
    }

    @PostMapping("/oNlYAdMIn/getSeasonData")
    public List<Season> getSeasonData() {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getSeasonData 호출 | 관리자 화면에서 시즌 정보 추출", sessionBattleTag);

        List<Season> seasonList = mps.getSeasonListInService(sessionItems);

        log.info("{} >>>>>>>> getSeasonData 호출 | 시즌 정보 추출 완료", sessionBattleTag);
        log.info("===================================================================");

        return seasonList;
    }

    @PostMapping("/oNlYAdMIn/saveSeasonData")
    public SeasonDto saveSeassonData(@RequestBody HashMap<String, Object> recvMap) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        Long season =  Long.parseLong((String)recvMap.get("season"));
        String startDate = (String) recvMap.get("startDate");
        String endDate = (String) recvMap.get("endDate");

        log.info("{} >>>>>>>> saveSeassonData 호출 | 관리자 화면에서 시즌 정보 등록 및 수정 | season : {} , startDate : {}, endDate : {}", sessionBattleTag , season, startDate, endDate);

        SeasonDto seasonDto = mps.saveSeasonDataInService(sessionItems, season, startDate, endDate);

        log.info("{} >>>>>>>> saveSeassonData 호출 | 시즌 정보 등록 및 수정 완료", sessionBattleTag);
        log.info("===================================================================");

        return seasonDto;
    }

    @PostMapping("/oNlYAdMIn/getJobData")
    public List<JobDto> getJobData() {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getJobData 호출 | 관리자 화면에서 배치 잡 정보 추출 ", sessionBattleTag);

        List<JobDto> jobDtoList = mps.getJobDataInService(sessionItems);

        log.info("{} >>>>>>>> getJobData 호출 | 배치 잡 정보 추출 완료", sessionBattleTag);
        log.info("===================================================================");

        return jobDtoList;
    }

    @PostMapping("/oNlYAdMIn/resumeJob")
    public JobDto resumeJob(@RequestBody HashMap<String, Object> recvMap) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        String jobName = (String) recvMap.get("jobName");

        log.info("{} >>>>>>>> resumeJob 호출 | 관리자 화면에서 {} 배치 수동 재기동 ", sessionBattleTag , jobName);

        JobDto jobDto = mps.resumeJobInService(sessionItems, jobName);

        log.info("{} >>>>>>>> resumeJob 호출 | 배치 수동 재기동 완료", sessionBattleTag);
        log.info("===================================================================");

        return jobDto;
    }

    @PostMapping("/oNlYAdMIn/getBanHeroList")
    public List<BanHero> getBanHeroList() {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> resumeJob 호출 | 관리자 화면에서 밴 영웅 조회 ", sessionBattleTag);

        List<BanHero> banHeroList = mps.getBanHeroFromMgtServie(sessionItems);

        log.info("{} >>>>>>>> resumeJob 호출 | 관리자 화면에서 밴 영웅 조회 완료", sessionBattleTag);
        log.info("===================================================================");

        return banHeroList;
    }

    @PostMapping("/oNlYAdMIn/saveBanHeroData")
    public BanHero saveBanHeroData(@RequestBody HashMap<String, Object> recvMap) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> saveSeassonData 호출 | 관리자 화면에서 시즌 정보 등록 및 수정 ", sessionBattleTag);

        BanHero banHero = mps.saveBanHeroService(sessionItems, recvMap);

        log.info("{} >>>>>>>> saveSeassonData 호출 | 시즌 정보 등록 및 수정 완료", sessionBattleTag);
        log.info("===================================================================");

        return banHero;
    }

    @PostMapping("/getBanHero")
    public BanHeroDto getBanHero() {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> resumeJob 호출 | 초기 화면에서 밴 영웅 조회 ", sessionBattleTag);

        BanHeroDto banHeroDto = mps.getBanHeroListService(sessionItems);

        log.info("{} >>>>>>>> resumeJob 호출 | 초기 화면에서 밴 영웅 조회 완료", sessionBattleTag);
        log.info("===================================================================");

        return banHeroDto;
    }

    @PostMapping("/community/getContentData")
    public Page<Board> getContentData(@RequestBody HashMap<String, Object> recvMap) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        String target = (String) recvMap.get("target");
        Integer pageNum = (Integer) recvMap.get("pageNum");
        String boardTagCd = (String) recvMap.get("boardTagCd");
        boolean isFirst = (boolean) recvMap.get("isFirst");

        log.info("{} >>>>>>>> getContentData 호출 | {} 게시글 리스트 {} 페이지 조회 / 게시글 종류 : {} / 최초 조회 여부 : {}", sessionBattleTag, target, pageNum, boardTagCd, isFirst);

        Page<Board> boardList = cs.getContentDataService(sessionItems, target, pageNum, boardTagCd, isFirst);
        log.info("총 element 수 : {}, 전체 page 수 : {}, 페이지에 표시할 element 수 : {}, 현재 페이지 index : {}, 현재 페이지의 element 수 : {}",
                boardList.getTotalElements(), boardList.getTotalPages(), boardList.getSize(),
                boardList.getNumber(), boardList.getNumberOfElements());

        log.info("{} >>>>>>>> getContentData 호출 | {} 게시글 리스트 {} 페이지 조회 완료 ", sessionBattleTag, target, pageNum);

        return boardList;
    }

    @PostMapping("/community/saveImage")
    public BoardImageDto saveImage(@RequestParam(value = "file") MultipartFile file) throws IOException {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> saveImage 호출 | 신규 게시글 등록 ", sessionBattleTag);

        log.info("{} >>>>>>>> saveImage 호출 | file : {} ", sessionBattleTag, file);
        log.info("{} >>>>>>>> saveImage 호출 | fileName : {} ", sessionBattleTag, file.getName());
        log.info("{} >>>>>>>> saveImage 호출 | orginalFileName : {} ", sessionBattleTag, file.getOriginalFilename());
        log.info("{} >>>>>>>> saveImage 호출 | getResource : {} ", sessionBattleTag, file.getResource());
//        log.info("{} >>>>>>>> saveImage 호출 | getByte : {} ", sessionBattleTag, file.getBytes());
        log.info("{} >>>>>>>> saveImage 호출 | getSize : {} ", sessionBattleTag, file.getSize());


        BoardImageDto boardImageDto =cs.saveBoardImageService(sessionItems, file);

        log.info("{} >>>>>>>> saveImage 호출 | 신규 게시글 등록 완료", sessionBattleTag);
        log.info("===================================================================");

        return boardImageDto;
    }

    @PostMapping("/community/saveContent")
    public void saveContent(@RequestParam(value = "title") String title,
                            @RequestParam(value = "editordata") String editordata,
                            @RequestParam(value = "playerId") String playerId,
                            @RequestParam(value = "battleTag") String battleTag,
                            @RequestParam(value = "saveCategory") String category,
                              @RequestParam(value = "boardTag") String boardTag) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> saveContent 호출 | 신규 게시글 등록 ", sessionBattleTag);

        log.info("{} >>>>>>>> saveContent 호출 | 제목 : {} / 작성자 {} / id {} / 저장할 게시판 : {} / 게시판 유형 : {}", sessionBattleTag, title, battleTag, playerId, category, boardTag);
        log.info("{} >>>>>>>> saveContent 호출 | 게시글 : \n{}\n ============================================================= ", sessionBattleTag, editordata);
        if (category.equals("익명게시판")) {
            category = "01";
        }else if (category.equals("듀오/파티 모집")) {
            category = "02";
        }
        String message = cs.saveBoardContent(sessionItems, title, editordata, playerId, battleTag, category, boardTag);

        log.info("{} >>>>>>>> saveContent 호출 | 신규 게시글 등록 완료", sessionBattleTag);
        log.info("===================================================================");

        return;
    }

    @PostMapping("/community/getBoardTag")
    public List<BoardTagDto> getBoardTag(@RequestBody HashMap<String, Object> recvMap) {
        Map<String, Object> sessionItems = sessionCheck();
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");
        log.info("{} >>>>>>>> getBoardTag 호출 | 게시글 태그 리스트 추출 ", sessionBattleTag);

        List<BoardTagDto> boardTagDtoList = new ArrayList<>();

        String category = (String) recvMap.get("category");
        if (category.equals("익명게시판")) {
            category = "01";
        }else if (category.equals("듀오/파티 모집")) {
            category = "02";
        }
        List<BoardTagCd> boardTagCdList = boardTagCdRepository.findBoardTagCdsByUseYNAndCategoryCdOrderByBoardTagCdAsc("Y", category);
        for(BoardTagCd boardTagCd : boardTagCdList) {
            BoardTagDto boardTagDto = new BoardTagDto(boardTagCd.getCategoryCd(), boardTagCd.getBoardTagCd(),
                    boardTagCd.getCategoryVal(), boardTagCd.getBoardTagVal());

            boardTagDtoList.add(boardTagDto);
        }

        log.info("{} >>>>>>>> saveContent 호출 | 게시글 태그 리스트 추출 완료", sessionBattleTag);
        log.info("===================================================================");

        return boardTagDtoList;
    }

    private Map<String, Object> sessionCheck() {
        // CustomOAuth2UserService에서 로그인 성공시 세션에 SessionUser를 저장하도록 구성했으므로
        // 세션에서 httpSession.getAttribute("user")를 통해 User 객체를 가져올 수 있다.
        SessionUser user = (SessionUser) httpSession.getAttribute("user");
        String battleTag = "미로그인 유저";
        if (user != null) {
            battleTag = user.getBattleTag();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("loginUser", user);
        map.put("sessionBattleTag", battleTag);
        return map;
    }

    /**현재 미사용 2019.12.12 */
    @PostMapping("/showUserProfile")
    public List<PlayerListDto> getPlayerProfile(@RequestBody List<PlayerListDto> playerList) {
        List<PlayerListDto> resultPlayerList = new ArrayList<PlayerListDto>();
        for(PlayerListDto playerDto : playerList) {
            if("Y".equals(playerDto.getIsPublic())) {
                playerDto = cpl.crawlingPlayerProfile(playerDto);
            }
            System.out.println(playerDto.toString());
            resultPlayerList.add(playerDto);
        }
        System.out.println("15개 조회 끝");
        Collections.sort(resultPlayerList);
        return resultPlayerList;
    }
}

