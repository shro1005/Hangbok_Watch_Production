ABSDIR=$(dirname $ABSPATH)
source ${ABSDIR}/profile.sh    # 현재 stop.sh의 경로를 찾고 같은 경로에 있는 profile.sh를  찾는다.

IDLE_PORT=${find_idle_port}

echo "> $IDLE_PORT 에서 구동중인 애플리케이션 pid 확인"
IDLE_PID=$(lsof -ti tcp:${IDLE_PORT})

if [ -z ${IDLE_PID} ]
then
  echo "> 현재 구동중인 애플리케이션이 없으므로 종료하지 않는다."
else
  echo "> kill -15 $IDLE_PID"
  kill -15 ${IDLE_PID}
  sleep 5
fi