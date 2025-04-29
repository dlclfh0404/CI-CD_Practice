FROM nginx:latest

# 1. 기본 static 파일 복사 -> To-Do 앱
COPY ./public/ /usr/share/nginx/html/

# 2. Codee 리포트 복사 (덮어쓰기 또는 하위 경로로 복사 가능)
COPY ./out/ /usr/share/nginx/html/report/

