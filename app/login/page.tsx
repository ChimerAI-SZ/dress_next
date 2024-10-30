
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Field,
  Input,
  Text,
  VStack,
  Fieldset,
  Stack,
} from "@chakra-ui/react";
import axios from "../../lib/axios";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { username, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("用户名或密码不正确");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="20" p="8" borderWidth="1px" borderRadius="lg">
  <Fieldset.Root size="lg" maxW="md">
      <Stack>
        <Fieldset.Legend>Contact details</Fieldset.Legend>
        <Fieldset.HelperText>
          Please provide your contact details below.
        </Fieldset.HelperText>
      </Stack>

      <Fieldset.Content>
          <Input name="name" />

          <Input name="email" type="email" />

      </Fieldset.Content>

      <Button type="submit" alignSelf="flex-start">
        Submit
      </Button>
    </Fieldset.Root>
    </Box>
  );
};

export default Login;
