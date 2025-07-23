# Gmail 무료 이메일 설정 가이드

contact form에서 support@oauth3.io로 이메일을 보내기 위한 Gmail 설정 방법입니다.

## 설정 단계

### 1. Gmail 계정 준비
- Gmail 계정이 필요합니다 (이미 있다면 그것을 사용하세요)
- 새 계정을 만들려면 https://accounts.google.com/signup 로 가세요

### 2. 2단계 인증 활성화
1. Google 계정으로 로그인하세요
2. https://myaccount.google.com/security 로 이동
3. "2단계 인증" 을 찾아서 클릭
4. 화면의 지시에 따라 2단계 인증을 설정하세요

### 3. 앱 비밀번호 생성
1. https://myaccount.google.com/apppasswords 로 이동
2. "Select app" 드롭다운에서 "Mail" 선택
3. "Select device" 드롭다운에서 "Other (Custom name)" 선택
4. "OAuth3 Contact Form" 같은 이름 입력
5. "Generate" 클릭
6. 16자리 앱 비밀번호가 표시됩니다 (예: "abcd efgh ijkl mnop")
7. 이 비밀번호를 복사하세요 (공백 없이)

### 4. 환경 변수 설정
.env 파일에 다음을 추가하세요:

```
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

- `GMAIL_USER`: 당신의 Gmail 이메일 주소
- `GMAIL_APP_PASSWORD`: 위에서 생성한 16자리 앱 비밀번호 (공백 없이)

### 5. 테스트
1. 애플리케이션을 재시작하세요
2. Contact 페이지로 가서 폼을 작성하고 전송하세요
3. support@oauth3.io 이메일로 메시지가 전송됩니다

## 참고사항
- Gmail 무료 계정은 하루에 500개의 이메일을 보낼 수 있습니다
- 앱 비밀번호는 안전하게 보관하세요
- 앱 비밀번호는 언제든지 취소하고 새로 만들 수 있습니다

## 문제 해결
- "Gmail credentials not configured" 오류가 나타나면 환경 변수가 올바르게 설정되었는지 확인하세요
- 2단계 인증이 활성화되어 있어야 앱 비밀번호를 만들 수 있습니다