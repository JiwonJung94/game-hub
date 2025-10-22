# 멀티스테이지 빌드를 사용하여 React 앱을 빌드하고 nginx로 서빙

# 1단계: Node.js를 사용하여 React 앱 빌드
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# React 앱 빌드
RUN npm run build

# 2단계: nginx를 사용하여 정적 파일 서빙
FROM nginx:alpine

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 React 앱을 nginx의 웹 루트로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 2080 포트 노출
EXPOSE 2080

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
