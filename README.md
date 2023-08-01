# Nest.js-Shoppingmall-Project

다수의 판매자와 소비자가 온라인상에서 상거래를 할 수 있는 오픈 마켓(C2C) 프로젝트입니다.

-   프로젝트 진행 기간 : 2023.07.10 ~ 2023.07.26
-   팀원 : 1명
-   사용 언어 및 프레임워크 : TypeScript, Nest.JS (9.3.0), TypeORM (0.3.17)
-   Database : MySQL (8.0.33), AWS S3
<br/>

# 🛠 ERD
![ERD - 7](https://github.com/CHEESECHOUX/nest.js-shoppingmall-project/assets/89918678/3d811c69-f89b-4bf1-92fa-b65da8fafc7f)
<br/>
<br/>

# 🔗 프로젝트 구조
<img width="235" alt="스크린샷 2023-08-01 오전 10 33 48" src="https://github.com/CHEESECHOUX/nest.js-shoppingmall-project/assets/89918678/e9d61518-aa8e-43fb-a7d8-b7a4833f699d">

<br/>

# 👩🏻‍💻 기능 설명

**삼각형을 클릭하시면 기능별 상세 내용을 확인하실 수 있습니다.**

<details>
<summary>
<h3 style="font-size: 24px;">1. User</h3>
</summary>
<div markdown="1">

-   **로컬 회원 가입**<br/>
    -   회원가입 시 기본적으로 CUSTOMER 권한
    -   password : 대문자, 소문자, 특수 문자가 하나 이상씩 포함
    -   phone : ex) XXX-XXXX-XXXX
    -   email : ex) example@example.com
    -   zipcode : 5자리 숫자
-   **로컬 로그인**
    -   로그인용 아이디 중복 체크
    -   로그인 시 **login.log 파일(winston)에 로그인 로그 기록 저장**
-   **회원 정보 조회**
    -   내 회원 정보 조회 : JWT 토큰에 담긴 user의 id에 해당하는 사용자 정보만 조회
    -   회원 정보 조회 시 **userinfo.log 파일(winston)에 조회 로그 기록 저장** : 매일 자정에 데이터 초기화
-   **회원 정보 수정**
-   **회원 탈퇴**
    -   회원 탈퇴 시 장바구니도 softDelete
    <br/>
    </div>
    </details>

<details>
<summary>
<h3 style="font-size: 24px;">2. Role</h3>
</summary>
<div markdown="1">

#### 🔑 생성, 수정, 삭제 : ADMIN 권한만 가능 <br/>

#### 🔑 조회 : 모든 회원 로그인 시 가능 <br/>

<br/>

-   **권한명 생성**
    -   동일한 이름의 role(권한명) 생성 불가
-   **권한명 조회**
    -   모든 권한명 조회 : 오름차순으로 20개 조회
-   **권한명 수정**
    -   동일한 이름의 role(권한명)수정 불가
-   **권한명 삭제**
<br/>
</div>
</details>

<details>
<summary>
<h3 style="font-size: 24px;">3. Category</h3>
</summary>
<div markdown="1">

#### 🔑 생성, 수정, 삭제 : ADMIN 권한만 가능 <br/>

#### 🔑 조회 : 모든 회원 로그인 시 가능 <br/>

<br/>

-   **카테고리 생성**
    -   카테고리만 생성 : 동일한 카테고리 명은 생성 불가능
    -   카테고리 생성 시 상품도 함께 생성
-   **카테고리 조회**
    -   categoryId로 조회
    -   categoryName으로 조회
-   **카테고리 수정**
-   **카테고리 삭제**
    -   카테고리 삭제 시, 카테고리와 연결된 상품도 softDelete
    <br/>
    </div>
    </details>

<details>
<summary>
<h3 style="font-size: 24px;">4. Product</h3>
</summary>
<div markdown="1">

#### 🔑 생성, 수정, 삭제 : ADMIN, MANAGER 권한 가능

#### 🔑 조회 : 모든 회원 로그인 시 가능

<br/>

-   **상품 등록**

    -   **brandName & productName 둘 다 동일할 경우 등록 불가**<br/>
        ex) 브랜드명: 나이키, 상품명: 운동화 등록되어 있으면 / 브랜드명: 아디디스, 상품명: 운동화 등록 가능
    -   **상품 등록 시 상품 이미지 최소 1개 이상 함께 등록 (AWS S3)**

-   **상품 조회**

    -   상품 전체 조회 : categoryId로 조회 (카테고리별로 productName 오름차순으로 20개 조회)
    -   상품 단품 조회 : productId 조회, productName 조회

-   **상품 수정**
    -   상품 정보 및 이미지 파일(AWS S3) 수정
-   **상품 삭제**
    -   상품 삭제 시, 상품과 연결된 이미지도 softDelete
    <br/>
    </div>
    </details>

<details>
<summary>
<h3 style="font-size: 24px;">5. ImageUrl (Upload)</h3>
</summary>
<div markdown="1">

#### 🔑 생성 : ADMIN, MANAGER 권한 가능

<br/>

-   **상품 이미지 업로드**
    -   상품 이미지는 AWS S3에 저장 & imageUrl은 데이터베이스에 저장
    <br/>
    </div>
    </details>

<details>
<summary>
<h3 style="font-size: 24px;">6. Cart</h3>
</summary>
<div markdown="1">

#### 🔑 수정, 삭제 : ADMIN 권한 & 해당 회원 가능

#### 🔑 조회, 생성 : 해당 회원 가능

<br/>

-   **장바구니 생성(장바구니에 상품 추가)**

    -   회원당 장바구니는 1개
    -   상품 추가 시 각 상품 id, 상품 수량(CartItem 테이블), 상품 총 수량, 총 주문금액(Cart테이블) 데이터베이스에 저장

-   **장바구니 조회**
-   **장바구니 수정**
    -   상품 선택 삭제 및 추가 가능
    -   선택 삭제 시 제거할 상품의 수량이 원래 수량보다 작으면 에러 발생
    -   장바구니 상품의 총 수량이 0이 되면 softDelete
-   **장바구니 삭제**
<br/>
</div>
</details>

<details>
<summary>
<h3 style="font-size: 24px;">7. Order</h3>
</summary>
<div markdown="1">

#### 🔑 생성 : 장바구니에 상품을 담은 회원(주문 생성), 주문한 내역이 있는 회원(주문 취소) 가능

#### 🔑 조회 : ADMIN, MANAGER 권한(모든 주문 조회), 해당 회원(내 주문 조회) 가능

#### 🔑 수정 : ADMIN, MANAGER 권한(주문 상태 수정), 해당 회원(주문 배송지 수정) 가능

<br/>

-   **주문 생성**
    -   UUID
    -   **주문 생성 시, 장바구니에 담긴 상품 가격 업데이트**(상품 가격이 변경되었을 수도 있으므로)
    -   장바구니에 담긴 총가격과 결제 금액이 같은지 확인
    -   **주문 생성 시, 토스 페이먼츠 결제까지 완료**
-   **주문 조회**

    -   orderId로 조회 : ADMIN, MANAGER 권한
    -   내 주문 조회 : 해당 회원

-   **주문 수정**

    -   주문 상태 변경 : ADMIN, MANAGER 권한<br/>
        (PENDING | PREPARE_DELIVER | DELIVER | COMPLETE_DELIVER | CONFIRM_PURCHASE | CANCELED)

    -   주문 배송지 수정 : 해당 회원

-   **주문 취소**
    -   주문 취소 시, 토스 페이먼츠 결제 취소까지 완료
    <br/>
    </div>
    </details>

<details>
<summary>
<h3 style="font-size: 24px;">8. Review</h3>
</summary>
<div markdown="1">

#### 🔑 생성 : 해당 상품을 구매했다면 모든 회원 가능

#### 🔑 조회 : 모든 회원 가능

#### 🔑 수정 : 내가 작성한 리뷰만 가능

#### 🔑 삭제 : ADMIN 권한 (모든 리뷰), MANAGER, CUSTOMER 권한 (내가 작성한 리뷰) 가능

<br/>

-   **리뷰 생성**
-   **리뷰 조회**

    -   reviewId로 조회
    -   productId로 조회 : 최근 리뷰 업데이트된 순으로 정렬(updatedAt 내림차순)

-   **리뷰 수정**
-   **리뷰 삭제**
<br/>
</div>
</details>

# 📡 API
### [API Documentation](https://documenter.getpostman.com/view/20782433/2s9XxvRthE)
<details>
<summary>상품(& AWS S3 이미지) 생성, 수정 캡처본 (터미널 curl 명령어)</summary>
<div markdown="1">
    
- 생성
<img width="1415" alt="스크린샷 2023-08-01 오전 11 16 30" src="https://github.com/CHEESECHOUX/nest.js-shoppingmall-project/assets/89918678/aba234f3-4463-4fb4-8752-aa0e474046ce">

- 수정
<img width="1420" alt="스크린샷 2023-08-01 오전 10 57 56" src="https://github.com/CHEESECHOUX/nest.js-shoppingmall-project/assets/89918678/f9c37166-f385-4a0f-82aa-20abf3ea3ebe">

<br/>
</div>
</details>
<br/>

|기능|EndPoint|메소드|
|:---|:---|:---:|
|나의 회원 정보 가져오기|/users/myinfo|GET|
|회원가입|/users/signup|POST|
|로그인|/users/login|POST|
|내 회원 정보 삭제|/users/:id|DELETE|
|권한명 가져오기|/roles|GET|
|권한명 생성(ADMIN 권한만)|/roles|POST|
|권한명 수정, 삭제(ADMIN 권한만)|/roles/:id|PATCH, DELETE|
|카테고리 id로 가져오기|/categories/:id|GET|
|카테고리 name으로 가져오기|/categories/?name=""|GET|
|카테고리 생성(ADMIN 권한만)|/categories|POST|
|카테고리 상품과 같이 생성(ADMIN 권한만)|/categories/product|POST|
|카테고리 부분 수정, 카테고리 삭제 시 상품도 삭제(ADMIN 권한만)|/categories/:id|PATCH, DELETE|
|상품 id로 가져오기|/products/:id|GET|
|상품 productName으로 가져오기|/products/?productName=""|GET|
|상품 카테고리별로 가져오기|/products/category/:categoryId|GET|
|상품 생성 (ADMIN, MANAGER 권한만)|/products|POST|
|상품 부분 수정, 삭제(ADMIN, MANAGER 권한만)|/products/:id|PATCH, DELETE|
|AWS S3 이미지 파일 업로드 (ADMIN, MANAGER 권한만)|/uploads|POST|
|내 장바구니 가져오기|/carts|GET|
|내 장바구니 생성|/carts/:userId|POST|
|내 장바구니 부분 수정, 삭제(ADMIN 권한도 가능)|/carts/:userId|PATCH, DELETE|
|orderId로 주문 가져오기 (ADMIN, MANAGER 권한만)|/orders/:orderId|GET|
|내 주문 가져오기, 내 주문 배송지 수정|/orders/:orderId|GET, PATCH|
|주문 생성(토스 결제까지)|/orders|POST|
|주문 취소(토스 결제 취소까지)|/orders/cancel|POST|
|주문 상태 수정(ADMIN, MANAGER 권한만)|/orders/:orderId/status|PATCH|
|토스 결제 생성|/payments/toss|POST|
|토스 결제 취소|/payments/toss/cancel|POST|
|리뷰 reviewId로 가져오기|/products/reviews:reviewId|GET|
|리뷰 productId로 가져오기|/products/:productId/reviews|GET|
|내가 주문한 상품의 리뷰 생성|/reviews|POST|
|내가 작성한 리뷰 수정|/products/reviews/:reviewId|PATCH|
|내가 작성한 리뷰 삭제(ADMIN 권한도 가능)|/products/reviews/:reviewId|DELETE|
<br/>

# 🙌🏻 기술적 도전
#### 1. GetUserSession
- JWT로 로그인 구현 후, 모든 요청은 인증된 사용자만 접근 가능
- request안에 있는 사용자의 정보에 접근해, 해당 사용자가 라우터에 접근 권한이 있는지 확인<br/>
     - ex) 해당 사용자의 장바구니, 해당 사용자의 주문 배송지 수정

#### 2. RolesGuard, @Roles
- ADMIN, MANAGER, CUSTOMER 권한 중 RolesGuard가 각 라우트마다 허용되는 권한을 가진 사용자만 액세스 할 수 있도록 제어

#### 3. LoggerService
- 로그인 로그(login.log), 사용자 정보조회 로그(userinfo.log)를 각각 파일에 기록
- 사용자 정보조회 로그는 서울 시간 기준으로 매일 자정에 초기화

#### 4. Uploads
- AWS S3를 이용해 상품 이미지 관리 (등록, 수정, 삭제)

#### 5. Payments
- 토스 페이먼츠 결제 기능 구현
<br/>

# 💡 트러블 슈팅
#### 1. 테이블 반정규화
주문 요청시 장바구니에 저장되어있는 **장바구니 총 금액과 주문 총 금액(현재 상품 가격 기준)이 같은지 비교**하려면, **장바구니에 담긴 각 상품의 수량이 필요**했습니다.
Cart와 Product의 중간 테이블인 **CartItem 테이블을 반정규화**해 각 상품 수량 필드 값을 추가했습니다.
CartItem에 있는 각 상품(productId)과 각 상품 수량(quantity)의 정보로 장바구니에 담긴 상품의 현재 가격을 기준으로 주문 총 금액을 업데이트 후, 주문을 생성하도록 구현 했습니다.

#### 2. Soft Delete & Hard Delete
처음에는 데이터 보존 및 데이터 복구 가능성, 관계 데이터의 안정성 유지 때문에 모든 데이터를 soft delete 처리했습니다. 그러나 **모든 데이터를 soft delete 처리하게 될 경우 서비스 확장시 일부 쿼리의 성능 저하 가능성**이 있기 때문에 **데이터 보존 및 추적이 필요한 데이터만 soft delete 처리**, 그 외 **다른 데이터들은 hard delete 처리** 했습니다.
<br/>
<br/>

# ⚙️ 설치 및 실행 방법

**1. Project Clone**

<details>
<summary>.env 파일 (포트폴리오 프로젝트라서 파일을 올립니다)</summary>
<div markdown="1">

-   .env

```
NODE_ENV=development
LOG_DIR=src/logs/
```

-   src/config/.development.env

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_PASSWORD=MySQL비밀번호
DB_NAME=shoppingmall
DB_USERNAME=root

JWT_SECRET=MYSECRETKEY
JWT_EXP=1h

APP_NAME=nest-shoppingmall

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

    12. winston timezone 서울 시간으로 설정
        $ npm i --save moment-timezone

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
