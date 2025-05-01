FROM httpd:latest

# To-Do 앱 정적 파일 루트 경로에 복사
COPY ./public/ /usr/local/apache2/htdocs/

# Codee 리포트 복사
COPY ./out/ /usr/local/apache2/htdocs/report/


