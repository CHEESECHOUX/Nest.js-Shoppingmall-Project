# 설치한 패키지

-   환경변수
    $ npm i @nestjs/config

-   validationpipe (클라이언트에서 들어오는 데이터 유효성 검사)
    $ npm i class-validator class-transformer

-   joi (환경 변수 유효성 검사)
    $ npm install joi

-   winston (로그 파일 관리)

    -   winston 설치
        $ npm i nest-winston winston
    -   파일로 남기기 위해 추가 설치
        $ npm i winston-daily-rotate-file

-   TypeORM

    -   Nest.js에서 TypeORM을 연동시켜주기 위해 사용하는 모듈
        $ npm i --save @nestjs/typeorm

    -   TypeORM 모듈
        $ npm i --save typeorm

    -   애플리케이션 코드 명명 규칙(Camelcase)과 Database 컬럼 명명 규칙 (snake) 불일치 해소 위한 패키지 설치
        $ npm i typeorm-naming-strategies

    -   MySQL 연동
        $ npm i mysql --save
