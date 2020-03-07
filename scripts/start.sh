#!/usr/bin/env bash

ABSPATH=$(readlink -f $0)
ABSDIR=$(dirname $ABSPATH)
source ${ABSDIR}/profile.sh

REPOSITORY=/home/ec2-user/app/pro

echo "> build 파일 복사"
echo "> cp $REPOSITORY/real-build/*.jar $REPOSITORY/"
cp $REPOSITORY/real-build/*.jar $REPOSITORY/

echo "> 새 애플리케이션 배포"
JAR_NAME=$(ls -tr $REPOSITORY/*.jar | tail -n 1)

echo "> JAR name : $JAR_NAME"

echo "> $JAR_NAME 에 실행권한 추가"

chmod +x $JAR_NAME

echo "> $JAR_NAME 실행"

IDLE_PROFILE=$(find_idle_profile)

echo "> $JAR_NAME 을 profile=$IDLE_PROFILE 로 실행합니다."
nohup java -jar \
        -Dspring.config.location=classpath:/application.yml \
        -Dspring.profiles.active=$IDLE_PROFILE,real-db,oauth \
        $JAR_NAME > $REPOSITORY/nohup.out 2>&1 &