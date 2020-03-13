package com.hangbokwatch.backend.controller;

import com.hangbokwatch.backend.domain.user.User;
import com.hangbokwatch.backend.dto.CompetitiveDetailDto;
import com.hangbokwatch.backend.dto.PlayerListDto;
import com.hangbokwatch.backend.dto.auth.SessionUser;
import com.hangbokwatch.backend.service.ShowPlayerDetailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mobile.device.Device;
import org.springframework.mobile.device.DeviceUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * WebController : 간단한 화면 이동 매핑을 담당하는 controller (2019.09.24 최초작성)
 * 2019.09.04 - index(), search() 최초작성
 */
@Slf4j
@RequiredArgsConstructor
@Controller
public class WebController {
    private final ShowPlayerDetailService spd;
    private final HttpSession httpSession;

    @GetMapping("/")
    public String goToIndexView(Model model, Device device) {

        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        String result = "index";
        if(device.isMobile()) {
            result = "mobile-" + result;
        }

        log.info("{} >>>>>>>> goToIndexView 호출 | 검색 화면으로 이동", sessionBattleTag);
        return result;
    }

    @GetMapping("/mobile")
    public String goToMobiileIndexView(Model model) {
        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");
        log.info("{} >>>>>>>> goToIndexView 호출 | 검색 화면으로 이동", sessionBattleTag);

        return "mobile-index";
    }

    @GetMapping("/showPlayerDetail/{forUrl}")
    public String showPlayerDetail(@PathVariable String forUrl, Model model, Device device) {
        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> showPlayerDetail 호출 | 조회 url : {}", sessionBattleTag, forUrl);
        CompetitiveDetailDto cdDto = spd.showPlayerDetailService(forUrl, sessionItems);
        String returnUrl = "playerDetail";

        if(cdDto.getPlayer() != null) {
            String battleTag = cdDto.getPlayer().getBattleTag();
            String tag = battleTag.substring(battleTag.indexOf("#"));

            model.addAttribute("tag", tag);
            model.addAttribute("player", cdDto.getPlayer());
            //model.addAttribute("playerDetails", cdDto.getPlayerDetailList());
            model.addAttribute("count", cdDto.getCount());
            model.addAttribute("favorite", cdDto.getFavorite());
            model.addAttribute("messageFromServer", cdDto.getMessage());
//            log.info("like or not : " + cdDto.getFavorite());

            if(device.isMobile()) {
                returnUrl = "mobile-detail";
            }
        }else {

            model.addAttribute("messageFromServer", cdDto.getMessage());
            model.addAttribute("userInput", forUrl);
            log.debug("{} >>>>>>>> showPlayerDetail 진행중 | 갱신중 에러 혹은 프로필 비공개로 메세지 전달 ({})", sessionBattleTag, cdDto.getMessage());

            returnUrl = "index";

            if(device.isMobile()) {
                returnUrl = "mobile-index";
            }

        }

        log.info("{} >>>>>>>> showPlayerDetail 종료 | {}.html 화면 이동", sessionBattleTag, returnUrl);
        log.info("===================================================================");

        return returnUrl;
    }

    @GetMapping("/search/{userInput}")
    public String search(@PathVariable String userInput, Model model, Device device) {
        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> search 호출 | 검색값 : {}", sessionBattleTag, userInput);
        if(userInput.indexOf("-") != -1) {
            userInput = userInput.replace("-", "#");
        }
        model.addAttribute("isFromDetail", "Y");
        model.addAttribute("userInput", userInput);

        String result = "index";

        if(device.isMobile()) {
            result = "mobile-search";
        }

        log.info("{} >>>>>>>> search 종료 | {}.html 화면 이동", sessionBattleTag, result);
        log.info("===================================================================");
        return result;
    }

    @GetMapping("/refreshPlayerDetail/{forUrl}")
    public String refreshPlayerDetail(@PathVariable String forUrl, Model model, Device device) {
        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> refreshPlayerDetail 호출 | 조회 url : {}", sessionBattleTag, forUrl);
        CompetitiveDetailDto cdDto = spd.refreshPlayerDetail(forUrl, sessionItems);
        String returnUrl = "playerDetail";
        if(cdDto.getPlayer() != null) {
            String battleTag = cdDto.getPlayer().getBattleTag();
            String tag = battleTag.substring(battleTag.indexOf("#"));

            model.addAttribute("tag", tag);
            model.addAttribute("player", cdDto.getPlayer());
            //model.addAttribute("playerDetails", cdDto.getPlayerDetailList());
            model.addAttribute("favorite", cdDto.getFavorite());
            model.addAttribute("messageFromServer", cdDto.getMessage());

            if(device.isMobile()) {
                returnUrl = "mobile-detail";
            }

        }else {

            model.addAttribute("messageFromServer", cdDto.getMessage());
            log.debug("{} >>>>>>>> refreshPlayerDetail 진행중 | 갱신중 에러 혹은 프로필 비공개로 메세지 전달 ({})", sessionBattleTag, cdDto.getMessage());
            model.addAttribute("userInput", forUrl);

            returnUrl = "/showPlayerDetail/"+forUrl;
        }
        log.info("{} >>>>>>>> refreshPlayerDetail 종료 | {}.html 화면 이동", sessionBattleTag, returnUrl);
        log.info("===================================================================");

        return returnUrl;
    }

    @GetMapping("/myFavorite")
    public String myFavorite(Model model) {
        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> myFavorite 호출 | 즐겨찾기 페이지 이동을 위해 연관된 데이터를 조회합니다.", sessionBattleTag);


        log.info("{} >>>>>>>> myFavorite 종료 | 즐겨찾기 페이지(favorite.html)로 이동", sessionBattleTag);
        log.info("===================================================================");
        return "favorites";
    }

    @GetMapping("/ranking")
    public String goToRanking(Model model) {
        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> goToRanking 호출 | 랭킹보기 페이지 이동을 위해 연관된 데이터를 조회합니다.", sessionBattleTag);


        log.info("{} >>>>>>>> goToRanking 종료 | 랭킹보기 페이지(ranking.html)로 이동", sessionBattleTag);
        log.info("===================================================================");
        return "ranking";
    }

    @GetMapping("/oNlYAdMIn")
    public String goToManagement(Model model) {
        Map<String, Object> sessionItems = sessionCheck(model);
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> goToManagement 호출 | 관리자 화면으로 이동합니다..", sessionBattleTag);


        log.info("{} >>>>>>>> goToManagement 종료 | 관리자 페이지(management.html)로 이동", sessionBattleTag);
        log.info("===================================================================");
        return "management";
    }

    private Map<String, Object> sessionCheck(Model model) {
        // CustomOAuth2UserService에서 로그인 성공시 세션에 SessionUser를 저장하도록 구성했으므로
        // 세션에서 httpSession.getAttribute("user")를 통해 User 객체를 가져올 수 있다.
        SessionUser user = (SessionUser) httpSession.getAttribute("user");
        String battleTag = "미로그인 유저";
        if(user != null) {
            model.addAttribute("SessionUserId", user.getId());
            model.addAttribute("SessionBattleTag", user.getBattleTag());
            boolean isAdmin = false;
            if("ADMIN".equals(user.getRole().name())) {
                isAdmin = true;
            }
            model.addAttribute("isAdmin", isAdmin);
            model.addAttribute("isLogin", true);
            battleTag = user.getBattleTag();
        }else {
            model.addAttribute("SessionBattleTag", "null");
            model.addAttribute("isLogin", false);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("loginUser", user); map.put("sessionBattleTag", battleTag);
        return map;
    }
}
