import api from "@/api";

// 계정 등록 API
export const registerAccount = async (accountData) => {
  try {
    console.log("🚀 API 호출 시작:", accountData);
    const response = await api.post("/auth/api/account/register", accountData);
    console.log("✅ API 응답 성공:", response);
    console.log("📊 응답 전체 구조:", JSON.stringify(response, null, 2));
    console.log("🔍 response.data:", response.data);
    console.log("🔍 response.status:", response.status);
    console.log("🔍 response.headers:", response.headers);
    console.log("🔍 response.data.data:", response.data?.data);
    console.log("🔍 response.data.data.accessToken:", response.data?.data?.accessToken);
    console.log("🔍 response.data.data.refreshToken:", response.data?.data?.refreshToken);
    console.log("🔍 response.data.data.conntectedIdCreateRes:", response.data?.data?.conntectedIdCreateRes);
    console.log(
      "🔍 response.data.data.conntectedIdCreateRes.connectedId:",
      response.data?.data?.conntectedIdCreateRes?.connectedId
    );

    // 응답값 구조에 맞춰 success 판단
    const isSuccess = response.data?.code === "GEN-000" && response.data?.status === "OK";
    console.log("🎯 성공 여부:", isSuccess);

    return {
      success: isSuccess,
      data: response.data,
      status: response.status,
      connectedId: response.data?.data?.conntectedIdCreateRes?.connectedId,
      accessToken: response.data?.data?.accessToken,
      refreshToken: response.data?.data?.refreshToken,
    };
  } catch (error) {
    console.error("❌ API 에러:", error);
    console.error("❌ 에러 응답:", error.response);
    console.error("❌ 에러 상태:", error.response?.status);
    console.error("❌ 에러 데이터:", error.response?.data);
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};

// 여러 계정 일괄 등록
export const registerMultipleAccounts = async (id, password, banks = [], securities = [], organization = "0088") => {
  const results = [];
  let completedCount = 0;
  const totalAccounts = banks.length + securities.length;

  if (totalAccounts === 0) {
    return {
      success: true,
      completedCount: 0,
      totalCount: 0,
      results: [],
    };
  }

  // 모든 계정을 순차적으로 등록
  let currentIndex = 0;

  // 은행 계정 등록
  for (const bankName of banks) {
    currentIndex++;
    const isLast = currentIndex === totalAccounts;

    try {
      const accountData = {
        accountDto: {
          countryCode: "KR",
          businessType: "BK",
          organization: organization,
          clientType: "P",
          loginType: "1",
          id: id,
          password: password,
          birthDate: "000816",
        },
        last: isLast,
      };

      const result = await registerAccount(accountData);
      if (result.success) {
        completedCount++;
        results.push({
          type: "bank",
          name: bankName,
          success: true,
          connectedId: result.connectedId,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      } else {
        results.push({ type: "bank", name: bankName, success: false, error: result.error });
      }
    } catch (error) {
      results.push({ type: "bank", name: bankName, success: false, error: error.message });
    }
  }

  // 증권사 계정 등록
  for (const securityName of securities) {
    currentIndex++;
    const isLast = currentIndex === totalAccounts;

    try {
      const accountData = {
        accountDto: {
          countryCode: "KR",
          businessType: "ST",
          organization: organization,
          clientType: "P",
          loginType: "1",
          id: id,
          password: password,
          birthDate: "000816",
        },
        last: isLast,
      };

      const result = await registerAccount(accountData);
      if (result.success) {
        completedCount++;
        results.push({
          type: "security",
          name: securityName,
          success: true,
          connectedId: result.connectedId,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      } else {
        results.push({ type: "security", name: securityName, success: false, error: result.error });
      }
    } catch (error) {
      results.push({ type: "security", name: securityName, success: false, error: error.message });
    }
  }

  // 성공한 결과에서 토큰 정보 찾기
  const successfulResult = results.find((r) => r.success);

  return {
    success: results.every((r) => r.success),
    completedCount,
    totalCount: totalAccounts,
    results,
    // 토큰 정보 추가 (첫 번째 성공한 응답에서)
    accessToken: successfulResult?.accessToken,
    refreshToken: successfulResult?.refreshToken,
    connectedId: successfulResult?.connectedId,
  };
};
