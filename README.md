# AceOT-Editor
오픈소스 에디터인 ACE와 협업을 가능하게 하는 라이브러리인 구글 OT(Operational Transformation)을 활용하여 개발한 실시간 협업 에디터

## 1.서비스 환경
- Ubuntu 14.04 LTS<br>
- Node.js 0.10.38<br>
- JXcore 0.10.40<br>

## 2.사용한 라이브러리
- OT.js (0.0.15)
- Bootstrap (3.3.1)
- Socket.io (1.2.1)
- Ace (1.2.2)
- jQuery (2.1.1)

## 3.참고한 라이브러리
- firepad.js
- codemirror.js

### 4.프론트엔드
#### 4.1 사용한 라이브러리
- OT : CodeMirror 에디터 4.0 버젼 이상에서 실시간 협업을 가능하게 하도록 하는 라이브러리로, 본 팀에서는 codemirror-adapter(ot와 codemirror을 연결하는 부분)을 firepad를 참고하여 ACE-adapter로 수정해서 실시간 협업 서비스가 동작하도록 개발함.
- Bootstrap : 이 프레임워크를 통해 UI 중 탭 목록, 선택 및 추가 부분 디자인
- Socket.io (클라이언트) : JavaScript를 이용하여 브라우저 종류에 상관없이 실시간 웹을 구현할 수 있도록 한 기술인 socket.io를 통하여 클라이언트는 필요한 요청을 하고 서버는 처리하도록 함
- jQuery : js와 html의 상호작용을 간결화한 라이브러리, 가볍고 빠르게 개발할 수 있도록 한다.
- Ace : 협업 모듈에 사용되는 에디터

### 5.백엔드
#### 5.1사용한 라이브러리
- ot.js
- socket.io.js : 클라이언트와 요청을 주고 받으며 처리하면서 통신을 하게한다.

![Alt text](/Title_Image.png)
