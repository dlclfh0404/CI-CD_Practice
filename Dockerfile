FROM nginx:latest

#내가 만든 정적파일들을 nginx가 서빙하는 폴더로 복사한다
COPY ./public/ /usr/share/nginx/html
