app.use((err, req, res, next) => {
    // 오류 로깅
    console.error(err);
  
    // 클라이언트에게 오류 응답을 보내기
    res.status(err.status ?? 500).json({ error: err.message });
  });

  /**주의: 에러 처리 미들웨어는 반드시 네 개의 매개변수를 가져야 하며, 반드시 next 함수를 호출하여 다음 미들웨어로 제어를 넘겨야 합니다. 이것이 중요한 역할을 합니다. */