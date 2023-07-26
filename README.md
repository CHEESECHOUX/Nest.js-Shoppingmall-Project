# Nest.js-Shoppingmall-Project
- 프로젝트 진행 기간 : 2023.07.10 ~ 
- 사용 언어 및 프레임워크 : TypeScript, Nest.js, TypeORM 
- Database : MySQL (8.0.33)
<br/>

# 🛠 ERD
<img width="1158" alt="스크린샷 2023-07-26 오후 2 52 35" src="https://github.com/CHEESECHOUX/nest.js-shoppingmall-project/assets/89918678/97caf261-cbd5-4923-8f7f-4091e6b9b53a">

- user의 role은 ADMIN, MANAGER, CUSTOMER 총 세 가지로 분했습니다. 추후 서비스 확장을 고려해 ENUM이 아닌 VARCHAR로 지정했습니다.

<br/>

# 📡 API
|기능|EndPoint|메소드|
|:---|:---|:---:|
|나의 회원 정보 가져오기|/users/myinfo|GET|
|회원가입|/users/signup|POST|
|로그인|/users/login|POST|
|내 회원 정보 삭제|/users/:id|Delete|
|상품 id로 가져오기|/products/:id|GET|
|상품 productName으로 가져오기|/products/?productName=""|GET|
|상품 카테고리별로 가져오기|/products/category/:categoryId|GET|
|상품 생성 (ADMIN, MANAGER 권한만)|/products|POST|
|상품 부분 수정|/products/:id|PATCH|
|상품 삭제|/products/:id|DELETE|
|카테고리 id로 가져오기|/categories/:id|GET|
|카테고리 name으로 가져오기|/categories/?name=""|GET|
|카테고리 생성(ADMIN, MANAGER 권한만)|/categories|POST|
|카테고리 상품과 같이 생성(ADMIN, MANAGER 권한만)|/categories/product|POST|
|카테고리 부분 수정(ADMIN, MANAGER 권한만)|/categories/:id|PATCH|
|카테고리 삭제 시 상품도 삭제(ADMIN, MANAGER 권한만)|/categories/:id|DELETE|
|AWS S3 이미지 파일 업로드|/uploads|POST|
|내 장바구니 가져오기|/carts|GET|
|내 장바구니 생성|/carts/:userId|POST|
|내 장바구니 부분 수정|/carts/:userId|PATCH|
|내 장바구니 삭제|/carts/:userId|DELETE|
|orderId로 주문 가져오기(ADMIN, MANAGER 권한만)|/orders/:orderId|GET|
|내 주문 가져오기|/orders/:orderId|GET|
|주문 생성(토스 결제까지)|/orders|POST|
|주문 취소(토스 결제 취소까지)|/orders/cancel|POST|
|내 주문 배송지 수정|/orders/:orderId|PATCH|
|주문 상태 수정(ADMIN, MANAGER 권한만)|/orders/:orderId/status|PATCH|
|토스 결제 생성|/payments/toss|POST|
|토스 결제 취소|/payments/toss/cancel|POST|
|리뷰 reviewId로 가져오기|/products/reviews:reviewId|GET|
|리뷰 productId로 가져오기|/products/:productId/reviews|GET|
|내가 주문한 상품의 리뷰 생성|/reviews|POST|
|내가 작성한 리뷰 수정|/reviews/:reviewId|PATCH|
|내가 작성한 리뷰 삭제(ADMIN 권한도 가능)|/reviews/:reviewId|DELETE|



<br/>

## ⚙️ 설치 및 실행 방법
**1. Project Clone**
<details>
<summary>.env 파일 (포트폴리오 프로젝트이기 때문에 .env 파일을 올립니다)</summary>
<div markdown="1">

- .env
```
NODE_ENV=development
LOG_DIR=src/logs/
```

- src/config/.development.env
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_PASSWORD=MySQL비밀번호
DB_NAME=shoppingmall
DB_USERNAME=root

JWT_SECRET=MYSECRETKEY
JWT_EXP=1h

APP_NAME=nest-shoppingmall
LOG_FILE_PATH=/Users/jisoochoi/project/logs/login.log (로그인시 로그가 저장될 PATH)
GETUSERINFO_LOG_FILE_PATH=/Users/jisoochoi/project/logs/userinfo.log (user정보 조회시 로그가 저장될 PATH)

AWS_ACCESS_KEY=AWS계정의 ACCESS KEY
AWS_SECRET_KEY=AWS계정의 SECRET KEY

TOSS_TEST_SECRET_KEY=토스 페이먼츠 계정의 SECRET KEY
```
<br/>
</div>
</details>

```
git clone https://github.com/CHEESECHOUX/nest.js-shoppingmall-project.git
```

**2. Project Setup**
<details>
<summary>설치한 패키지 목록</summary>
<div markdown="2">

    1. 환경변수
    $ npm i @nestjs/config
    
    2. validationpipe (클라이언트에서 들어오는 데이터 유효성 검사)
    $ npm i class-validator class-transformer

    3. joi (환경 변수 유효성 검사)
    $ npm install joi
    
    4. winston (로그 파일 관리)
        winston 설치
        $ npm i nest-winston winston
        
        파일로 남기기 위해 추가 설치
        $ npm i winston-daily-rotate-file
        
    5. TypeORM
        Nest.js에서 TypeORM을 연동시켜주기 위해 사용하는 모듈
        $ npm i --save @nestjs/typeorm
        
        TypeORM 모듈
        $ npm i --save typeorm
        
        애플리케이션 코드 명명 규칙(Camelcase)과 Database 컬럼 명명 규칙(Snake case) 불일치 해소 위한 패키지 설치
        $ npm i --save typeorm-naming-strategies
        
        MySQL 연동
        $ npm i --save mysql
        
    6. bcrypt
        $ npm i --save bcrypt
        
    7. JWT
        $ npm i --save @nestjs/jwt

    8. Passport
        $ npm i --save @nestjs/passport
        $ npm i --save -dev @types/passport-jwt

    9. 로그 파일 스케줄 관리
        $ npm i --save @nestjs/schedule
        
    10. AWS S3 파일(이미지) 저장
        $ npm i -D @types/multer
        $ npm i --save aws-sdk
        
    11. 토스페이먼츠 결제
        $ npm i --save @nestjs/axios
<br/>
</div>
</details>

```
npm install
```

**3. Project Start For Development**
```
npm run start:dev
```



