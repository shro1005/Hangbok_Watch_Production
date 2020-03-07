#!/usr/bin/env bash

#쉬고 있는 profile 찾기 : pro1 이 사용중이면 pro2가 쉬는 중
function find_idle_profile() {
    RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/profile)

    if [ ${RESPONSE_CODE} -ge 400 ] # 400 보다 크면 모두 에러에 포함 되므로
    then
      CURRENT_PROFILE=pro2
    else
      CURRENT_PROFILE=$(curl -s http://localhost/profile)
    fi

    if [ ${CURRENT_PROFILE} == pro1 ]
    then
      IDLE_PROFILE=pro2
    else
      IDLE_PROFILE=pro1
    fi

    echo "${IDLE_PROFILE}"
}

#쉬고있는 profile의 port 찾기
function find_idle_port() {
    IDLE_PROFILE=$(find_idle_profile)

    if [ ${IDLE_PROFILE} == pro1 ]
    then
      echo "8081"
    else
      echo "8082"
    fi
}