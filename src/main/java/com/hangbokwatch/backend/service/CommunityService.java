package com.hangbokwatch.backend.service;

import com.hangbokwatch.backend.dao.community.BoardImageRepository;
import com.hangbokwatch.backend.dao.community.BoardRepository;
import com.hangbokwatch.backend.domain.comunity.Board;
import com.hangbokwatch.backend.domain.comunity.BoardImage;
import com.hangbokwatch.backend.dto.BoardDto;
import com.hangbokwatch.backend.dto.BoardImageDto;
import com.hangbokwatch.backend.dto.auth.SessionUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {
    @Autowired
    BoardImageRepository boardImageRepository;
    @Autowired
    BoardRepository boardRepository;
    @Autowired
    S3Service s3Service;

    @Value("${spring.HWresource.HWimages}")
    private String imagePath;

    public Page<Board> getContentDataService(Map<String, Object> sessionItems, String target, Integer pageNum, String clickButton) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getContentDataService 호출 | 게시판 리스트 조합니다.", sessionBattleTag);

        Pageable pageable = PageRequest.of(pageNum-1, 40);
        if(target.equals("mypage")) {
            SessionUser user = (SessionUser) sessionItems.get("loginUser");
            Long playerId = user.getId();
            log.info("{} >>>>>>>> getContentDataService 호출 | 게시판 회리스트 조회 완료.", sessionBattleTag);
            return boardRepository.findAllByPlayerIdAndDelYNOrderByBoardIdDesc(playerId, "N", pageable);
        }else {
            if (target.equals("free")) {
                target = "01";
            } else if (target.equals("party")) {
                target = "02";
            }
            if(clickButton.equals("전체") || clickButton.equals("all") || clickButton.equals("00")) {
                log.info("{} >>>>>>>> getContentDataService 호출 | 게시판 회리스트 조회 완료.", sessionBattleTag);
                return boardRepository.findAllByCategoryCdAndDelYNOrderByBoardIdDesc(target, "N", pageable);
            }else if (clickButton.equals("10추글") || clickButton.equals("99") || clickButton.equals("like")) {
                log.info("{} >>>>>>>> getContentDataService 호출 | 게시판 회리스트 조회 완료.", sessionBattleTag);
                return boardRepository.findAllByCategoryCdAndDelYNAndSeeCountGreaterThanEqualOrderByBoardIdDesc(target, "N", 10l, pageable);
            } else {
                log.info("{} >>>>>>>> getContentDataService 호출 | 게시판 회리스트 조회 완료.", sessionBattleTag);
                return boardRepository.findAllByCategoryCdAndBoardTagCdAndDelYNOrderByBoardIdDesc(target, clickButton, "N", pageable);
            }
        }
    }

    public BoardImageDto saveBoardImageService(Map<String, Object> sessionItems,  MultipartFile mFile) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");
        BoardImageDto boardImageDto;
        log.info("{} >>>>>>>> saveBoardImageService 호출 | 게시판 이미지를 저장합니다.", sessionBattleTag);

        /** AWS S3에 이미지 저장*/
        try {
            String imgUrl = s3Service.upload(mFile, "bbs");

//            BoardImage boardImage = new BoardImage(mFile.getOriginalFilename(), mFile.getSize());
//            boardImageRepository.save(boardImage);

            boardImageDto = new BoardImageDto("ok", imgUrl, "nonError");

        }catch (IOException e) {
            log.error("{} | saveBoardImageService 에러 발생 | 이미지 저장중 에러 발생", sessionBattleTag);
            log.error("====================================================\n" + e + "\n====================================================");
            e.printStackTrace();

            boardImageDto = new BoardImageDto("fail", "", "서버 문제로 이미지 업로드에 실패했습니다. 다시 시도해 주세요. \n같은 현상이 지속될 시 문의 부탁드립니다.");

        }

        /**내 서버에 저장하기*/
//        Integer lastId = boardImageRepository.selectLastId(0,1);
//        if(lastId == null || lastId == 0) {
//            lastId = 1;
//        }else {
//            lastId++;
//        }
//
//        try {
//            BufferedImage image = ImageIO.read(mFile.getInputStream());
//            ImageIO.write(image, "png", new File(imagePath + "bbs/" + lastId + ".png"));
//            String imgUrl = "/HWimages/bbs/"+ lastId + ".png";
//
//            BoardImage boardImage = new BoardImage(mFile.getOriginalFilename(), mFile.getSize());
//            boardImageRepository.save(boardImage);
//
//            boardImageDto = new BoardImageDto("ok", imgUrl, "nonError");
//
//        }catch (IOException e) {
//            log.error("{} | saveBoardImageService 에러 발생 | 이미지 저장중 에러 발생", sessionBattleTag);
//            log.error("====================================================\n" + e + "\n====================================================");
//            e.printStackTrace();
//
//            boardImageDto = new BoardImageDto("fail", "", "서버 문제로 이미지 업로드에 실패했습니다. 다시 시도해 주세요. \n같은 현상이 지속될 시 문의 부탁드립니다.");
//        }
        log.info("{} >>>>>>>> saveBoardImageService 호출 | 게시판 이미지를 저장완료!", sessionBattleTag);
        return boardImageDto;

    }

    public String saveBoardContent(Map<String, Object> sessionItems, String title, String content, String playerId,
                                   String battleTag, String categoryCd, String boardTagCd) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> saveBoardContent 호출 | 게시판 글을 저장합니다.", sessionBattleTag);
        String rgtDtm = new SimpleDateFormat("yyyyMMddHHmmss").format(System.currentTimeMillis());
        Board board = new Board(title, content, Long.parseLong(playerId), battleTag, "Y", 0l ,0l ,
                boardTagCd, categoryCd, rgtDtm, rgtDtm);
        String message = "success";
        try {
            boardRepository.save(board);
        }catch (Exception e) {
            message = "게시물 저장에 실패했습니다. 다시 시도해 주세요.\n지속적으로 저장에 실패할 경우 문의 부탁드립니다.";
        }

        log.info("{} >>>>>>>> saveBoardContent 호출 | 게시판 글을 저장완료! 게시판 목록으로 돌아갑니다.", sessionBattleTag);
        return message;
    }


    public File convert(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

}
