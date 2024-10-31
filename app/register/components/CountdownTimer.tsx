import { useEffect, useState } from "react";
import { Button, Text, HStack } from "@chakra-ui/react";

interface CountdownTimerProps<T> {
  initialCountdown?: number;
  onResend: (params: T) => Promise<void>; // onResend 接收一个参数
  isActive?: boolean;
  resendParams: T; // 新增，提供给 onResend 的参数
}

const CountdownTimer = <T,>({
  initialCountdown = 40,
  onResend,
  isActive = false,
  resendParams, // 需要传递的参数
}: CountdownTimerProps<T>) => {
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (isActive) {
      setCountdown(initialCountdown); // 初次加载时激活倒计时
    }
  }, [isActive, initialCountdown]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // 处理异步的重发逻辑
  const handleResend = async () => {
    setCountdown(initialCountdown); // 重置倒计时
    await onResend(resendParams); // 将参数传递给 onResend
  };

  return (
    <HStack>
      {countdown > 0 && (
        <Text
          fontFamily="Arial"
          fontSize="0.75rem"
          fontWeight="400"
          color="#000000"
          mr="12px"
        >
          {countdown}s
        </Text>
      )}
      <Button
        size="sm"
        colorScheme={countdown > 0 ? "gray" : "blue"}
        onClick={handleResend}
        disabled={countdown > 0}
      >
        {countdown > 0 ? "Send again" : "Send"}
      </Button>
    </HStack>
  );
};

export default CountdownTimer;
