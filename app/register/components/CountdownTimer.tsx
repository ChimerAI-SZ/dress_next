import { useEffect, useState } from "react";
import { Button, Text, HStack } from "@chakra-ui/react";

interface CountdownTimerProps {
  initialCountdown?: number;
  onResend: () => void;
  isActive?: boolean; // 新增，用于控制倒计时是否立即激活
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialCountdown = 40,
  onResend,
  isActive = false,
}) => {
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

  const handleResend = () => {
    setCountdown(initialCountdown); // 重置倒计时
    onResend(); // 触发发送验证码的回调
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
