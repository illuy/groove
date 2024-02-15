## 1. 프로젝트

- 프로젝트 명 : Groove
- 소개
  - 뉴스피드 만들기
  - 프로젝트 기간 : 2024.2.7 ~ 2024.2.14
  - 내용 : React를 활용하여 뉴스피드 만들기
  - 사이트 : https://groove-alpha.vercel.app/

## 2. 시연 영상 및 정리

- 시연 영상 녹화본 - https://file.notion.so/f/f/83c75a39-3aba-4ba4-a792-7aefe4b07895/526f5652-ced7-44a8-b135-d2d32e34fefc/%E1%84%8B%E1%85%A7%E1%86%AF%E1%84%89%E1%85%B5%E1%86%B7%E1%84%92%E1%85%B5%E1%84%8C%E1%85%A9(10%E1%84%8C%E1%85%A9)_groove_%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%89%E1%85%A1%E1%86%BC.mp4?id=c7a60d7c-c8bc-493a-9514-a5b6279fef80&table=block&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&expirationTimestamp=1708048800000&signature=LpPO7XdR-xvnRQdsUPAWdW2SeiAnppZbZFSfx1ZxqpM&downloadName=%E1%84%8B%E1%85%A7%E1%86%AF%E1%84%89%E1%85%B5%E1%86%B7%E1%84%92%E1%85%B5%E1%84%8C%E1%85%A9%2810%E1%84%8C%E1%85%A9%29_groove_%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%89%E1%85%A1%E1%86%BC.mp4
- 프로젝트 정리 - https://www.notion.so/10-53efa92ebc714f988441e1336c1a50b7

## 3. 필수 구현 기능

- **회원 기능**
  - [x] Authentication 에서 제공하는 api를 사용하여 회원 가입, 로그인 구현할 수 있다.
  - [x] Authentication 과 Storage에서 제공하는 api를 사용하여 마이 페이지 프로필 수정 구현
- **SPA**
  - [x] react-router-dom 적용: path에 따라 렌더링할 페이지 컴포넌트를 지정
  - [x] CSR (Client Side Rendering)적용 : 서버로부터 json 데이터 받아와 새로고침 없이 화면 전환
- **CRUD**
  - [x] 게시글 쓰기 기능 구현
  - [x] 게시글 글 보여주기 구현
  - [x] 게시글 글 수정 구현
  - [x] 게시글 글 삭제 구현
- **스타일링 방식**
  - [x] styled-components 적용
- **상태관리 라이브러리**
  - [ ] Redux 적용
- **GIT**
  - [x] git add / commit / push 활용
  - [x] git 브랜치/ PR / merge 활용
  - [ ] github pull request에서 Code review 활용
- **배포**
  - [x] Vercel 을 이용하여 배포하기
  - [ ] 가비아 또는 고대디 같은 도메인 판매 업체에서 도메인을 구매하여 커스텀 도메인 적용

## 4. 와이어 프레임

### 메인 페이지

![main](https://github.com/illuy/groove/assets/103303516/83b053f8-8ca6-4ae8-b273-2805d1879e1f)

### 로그인 모달

![login](https://github.com/illuy/groove/assets/103303516/c3ee5374-12ad-4a2d-a384-9b1f791a6552)

### 상세 페이지

![detailpage](https://github.com/illuy/groove/assets/103303516/76c4e747-6919-462e-8328-e082d40cd6cc)

### 작성 페이지

![crud](https://github.com/illuy/groove/assets/103303516/8c84399a-7e74-4111-b302-4d24bd28ab7d)

### 마이 페이지

![my](https://github.com/illuy/groove/assets/103303516/a5bdfbbf-3f12-4003-9c28-d3fc0e6e116a)

## 5. 파일구조

```
src
 ┣ assets
 ┃ ┗ defaultImage.jpg
 ┣ components
 ┃ ┗ Groove
 ┃ ┃ ┣ GrooveTotalFeed
 ┃ ┃ ┃ ┣ GrooveFeed.jsx
 ┃ ┃ ┃ ┣ GrooveFeedList.jsx
 ┃ ┃ ┃ ┗ GrooveLikeBtn.jsx
 ┃ ┃ ┣ GrooveAuth.jsx
 ┃ ┃ ┣ GrooveFooter.jsx
 ┃ ┃ ┗ GrooveHeader.jsx
 ┣ dummyData
 ┃ ┣ authdummy.jsx
 ┃ ┣ FileUpload.jsx
 ┃ ┗ FireStoredummy.jsx
 ┣ pages
 ┃ ┣ DetailPage.jsx
 ┃ ┣ Home.jsx
 ┃ ┣ MyPage.jsx
 ┃ ┗ WritePage.jsx
 ┣ shared
 ┃ ┣ GlobalStyle.jsx
 ┃ ┗ Router.js
 ┣ style
 ┃ ┣ GrooveAuthStyle.jsx
 ┃ ┣ GrooveDetailStyle.jsx
 ┃ ┣ GrooveFeedStyle.jsx
 ┃ ┣ GrooveFooterStyle.jsx
 ┃ ┣ GrooveHeaderStyle.jsx
 ┃ ┗ GrooveWriteStyle.jsx
 ┣ App.jsx
 ┣ firebase.js
 ┣ index.js
 ┗ reportWebVitals.js
```
