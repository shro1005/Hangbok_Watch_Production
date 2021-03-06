package com.hangbokwatch.backend.service;

import com.hangbokwatch.backend.dao.JobExecutionRepository;
import com.hangbokwatch.backend.dao.JobInstanceRepository;
import com.hangbokwatch.backend.dao.SeasonRepository;
import com.hangbokwatch.backend.dao.hero.BanHeroRepository;
import com.hangbokwatch.backend.domain.Season;
import com.hangbokwatch.backend.domain.hero.BanHero;
import com.hangbokwatch.backend.domain.job.JobExecution;
import com.hangbokwatch.backend.domain.job.JobInstance;
import com.hangbokwatch.backend.dto.BanHeroDto;
import com.hangbokwatch.backend.dto.JobDto;
import com.hangbokwatch.backend.dto.SeasonDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerException;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.configuration.JobLocator;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.NoSuchJobException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManagementPageService {
    @Autowired
    SeasonRepository seasonRepository;
    @Autowired
    JobInstanceRepository jobInstanceRepository;
    @Autowired
    JobExecutionRepository jobExecutionRepository;
    @Autowired
    BanHeroRepository banHeroRepository;

    private final HttpSession httpSession;

    public List<Season> getSeasonListInService(Map<String, Object> sessionItems) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getSeasonList 호출 | 시즌 종료 날짜가 현재 날짜보다 큰 시즌을 조회", sessionBattleTag);

        List<Season> seasonList = seasonRepository.findSeasonsByEndDateGreaterThanEqualOrderBySeasonDesc(new SimpleDateFormat("yyyyMMdd").format(System.currentTimeMillis())+ "000000");

        log.info("{} >>>>>>>> getSeasonList 종료 | 시즌 정보 조회 완료", sessionBattleTag);
        return seasonList;
    }

    public SeasonDto saveSeasonDataInService(Map<String, Object> sessionItems, Long seasonNum, String startDate, String endDate) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> saveSeasonData 호출 | 시즌 데이터 수정 or 등록 ", sessionBattleTag);

        Season season = new Season(seasonNum, startDate, endDate);
        SeasonDto seasonDto = new SeasonDto(seasonNum, startDate, endDate);

        try {
            seasonRepository.save(season);
        }catch (Exception e) {
            seasonDto.setIsSuccess("N");
            log.info("{} >>>>>>>> saveSeasonData 종료 | 시즌 데이터 수정 or 등록 실패", sessionBattleTag);
            return seasonDto;
        }

        seasonDto.setIsSuccess("Y");
        log.info("{} >>>>>>>> saveSeasonData 종료 | 시즌 데이터 수정 or 등록 성공", sessionBattleTag);
        return seasonDto;
    }

    public BanHeroDto getBanHeroListService(Map<String, Object> sessionItems) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getBanHeroListService 호출 | 밴 영웅 리스트 조회", sessionBattleTag);
        BanHeroDto banHeroDto = new BanHeroDto();

        List<BanHero> banHeroList = banHeroRepository.findAllByUseYN("Y");

        for (BanHero banHero : banHeroList) {
            switch (banHero.getRole()) {
                case "Tank":
                    banHeroDto.setHeroName1(banHero.getHeroName());
                    banHeroDto.setHeroNameKR1(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole1("tank");
                    break;
                case "Tank2":
                    banHeroDto.setHeroName2(banHero.getHeroName());
                    banHeroDto.setHeroNameKR2(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole2("tank");
                    break;
                case "Deal1":
                    banHeroDto.setHeroName2(banHero.getHeroName());
                    banHeroDto.setHeroNameKR2(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole2("deal");
                    break;
                case "Deal2":
                    banHeroDto.setHeroName3(banHero.getHeroName());
                    banHeroDto.setHeroNameKR3(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole3("deal");
                    break;
                case "Deal3":
                    banHeroDto.setHeroName4(banHero.getHeroName());
                    banHeroDto.setHeroNameKR4(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole4("deal");
                    break;
                case "Deal4":
                    banHeroDto.setHeroName5(banHero.getHeroName());
                    banHeroDto.setHeroNameKR5(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole5("deal");
                    break;
                case "Heal2":
                    banHeroDto.setHeroName3(banHero.getHeroName());
                    banHeroDto.setHeroNameKR3(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole3("heal");
                    break;
                case "Heal":
                    banHeroDto.setHeroName4(banHero.getHeroName());
                    banHeroDto.setHeroNameKR4(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole4("heal");
                    break;
                case "Heal3":
                    banHeroDto.setHeroName5(banHero.getHeroName());
                    banHeroDto.setHeroNameKR5(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole5("heal");
                    break;
                case "Heal4":
                    banHeroDto.setHeroName6(banHero.getHeroName());
                    banHeroDto.setHeroNameKR6(banHero.getHeroNameKR());
                    banHeroDto.setHeroRole6("heal");
                    break;
                default:
                    break;
            }
        }

        log.info("{} >>>>>>>> getBanHeroListService 종료 | 밴 영웅 리스트 조회 완료", sessionBattleTag);
        return banHeroDto;
    }

    public BanHero saveBanHeroService(Map<String, Object> sessionItems, Map<String, Object> recvMap) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> saveBanHeroService 호출 | 시즌 데이터 수정 or 등록 ", sessionBattleTag);

        String role = (String) recvMap.get("role");
        String heroNameKR = (String) recvMap.get("heroNameKR");
        String heroName = (String) recvMap.get("heroName");
        String startDate = (String) recvMap.get("startDate");
        String endDate = (String) recvMap.get("endDate");
        String useYN = (String) recvMap.get("useYN");

        log.info("{} >>>>>>>> saveBanHeroService 호출 | 영웅 밴 정보 등록 및 수정 | role : {} , heroNameKR : {}, heroName : {}, startDate : {}, endDate : {} useYn : {}",
                sessionBattleTag , role, heroNameKR, heroName, startDate, endDate, useYN);


        BanHero banHero = new BanHero(role, heroName, heroNameKR, startDate, endDate,useYN);

        try {
            banHeroRepository.save(banHero);
        }catch (Exception e) {
            log.info("{} >>>>>>>> saveBanHeroService 종료 | 시즌 데이터 수정 or 등록 실패", sessionBattleTag);

        }

        log.info("{} >>>>>>>> saveBanHeroService 종료 | 시즌 데이터 수정 or 등록 성공", sessionBattleTag);
        return banHero;
    }

    public List<BanHero> getBanHeroFromMgtServie(Map<String, Object> sessionItems) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");

        log.info("{} >>>>>>>> getBanHeroFromMgtServie 호출 | 밴 영웅 리스트 조회", sessionBattleTag);

        List<BanHero> banHeroList = banHeroRepository.findAllByUseYN("Y");

        log.info("{} >>>>>>>> getBanHeroFromMgtServie 종료 | 밴 영웅 리스트 조회 완료", sessionBattleTag);
        return banHeroList;
    }

    public List<JobDto> getJobDataInService(Map<String, Object> sessionItems) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");
        List<JobDto> jobDtoList = new ArrayList<>();

        log.info("{} >>>>>>>> getJobDataInService 호출 | 배치 정보 호출 ", sessionBattleTag);

        log.debug("{} >>>>>>>> getJobDataInService 진행중 | 먼저 job별로 가장 최금 JobInstanceId를 가져온다. ", sessionBattleTag);
        jobDtoList = jobInstanceRepository.selectLastJobInstanceIdGroupByJobName();

        for (JobDto jobDto : jobDtoList) {
            log.debug("{} >>>>>>>> getJobDataInService 진행중 | {} 의 jobExecution 정보를 가져온다. ", sessionBattleTag, jobDto.getJobName());
            JobExecution jobExecution = jobExecutionRepository.selectJobExecutionByJobInstanceId(jobDto.getJobInstanceId(), 0, 1);

            String lastStartTime = jobExecution.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            String lastEndTime = "배치 작동중...";
            if(jobExecution.getEndTime() != null) {
                lastEndTime = jobExecution.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            }
            jobDto.setStatus(jobExecution.getStatus());
            jobDto.setLastStartTime(lastStartTime);
            jobDto.setLastEndTime(lastEndTime);
            log.debug("{} >>>>>>>> getJobDataInService 진행중 | 화면으로 넘길 JobDto로 파싱한다. {} ", sessionBattleTag, jobDto.toString());
        }
        log.info("{} >>>>>>>> getJobDataInService 종료 | 배치 정보 호출 완료", sessionBattleTag);
        return jobDtoList;
    }

    @Autowired
    private JobLocator jobLocator;
    @Autowired
    private JobLauncher jobLauncher;

    public JobDto resumeJobInService(Map<String, Object> sessionItems, String jobName) {
        String sessionBattleTag = (String) sessionItems.get("sessionBattleTag");
        JobDto jobDto = new JobDto();

        try {
            log.info("{} >>>>>>>> resumeJobInService 호출 | {} 배치 재기동 시작 ", sessionBattleTag, jobName);
            JobParameter parameter = new JobParameter(seasonRepository.selectSeason(new SimpleDateFormat("yyyyMMddHHmmss").format(System.currentTimeMillis())));
            Map<String, JobParameter> map = new HashMap<>();
            map.put("season", parameter);
            jobLauncher.run(jobLocator.getJob(jobName), new JobParametersBuilder(new JobParameters())
                    .addString("InstanceId","Resume_Job")
                    .addLong("timestamp", System.currentTimeMillis())
                    .addLong("season", seasonRepository.selectSeason(new SimpleDateFormat("yyyyMMddHHmmss").format(System.currentTimeMillis())))
                    .toJobParameters());

            jobDto = jobInstanceRepository.selectLastJobInstanceIdWhereJobName(jobName);
            jobDto.setIsNormal("Y");
            log.info("{} >>>>>>>> resumeJobInService 종료 | 배치 재기동 완료 ", sessionBattleTag);
        }catch (NoSuchJobException | JobInstanceAlreadyCompleteException | JobRestartException | JobParametersInvalidException | JobExecutionAlreadyRunningException e) {
            log.error("{} >>>>>>>> resumeJobInService 종료 | 배치 재기동시 에러 발생 {}", sessionBattleTag, e.getCause());
            log.error("====================================================\n" + e + "\n====================================================");

            jobDto = jobInstanceRepository.selectLastJobInstanceIdWhereJobName(jobName);
            jobDto.setIsNormal("N");
        }

        JobExecution jobExecution = jobExecutionRepository.selectJobExecutionByJobInstanceId(jobDto.getJobInstanceId(), 0, 1);
        jobDto.setStatus(jobExecution.getStatus());
        jobDto.setLastStartTime(jobExecution.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        jobDto.setLastEndTime(jobExecution.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        jobDto.setStatus(jobExecution.getStatus());

        return jobDto;
    }
}
