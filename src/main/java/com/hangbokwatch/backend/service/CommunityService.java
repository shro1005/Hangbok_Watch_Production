package com.hangbokwatch.backend.service;

import com.hangbokwatch.backend.dao.community.BoardImageRepository;
import com.hangbokwatch.backend.domain.comunity.BoardImage;
import com.hangbokwatch.backend.dto.BoardImageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {
    @Autowired
    BoardImageRepository boardImageRepository;
    @Autowired
    S3Service s3Service;

    @Value("${spring.HWresource.HWimages}")
    private String imagePath;

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

        return boardImageDto;

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
