"use client";
import {
  Button,
  Input,
  Container,
  VStack,
  Text,
  Image,
  Fieldset,
} from "@chakra-ui/react";
import { Field } from "@components/ui/field";
import { InputGroup } from "@components/ui/input-group";
import { useForm } from "react-hook-form";
import Book from "@img/login/book.svg";
import Lock from "@img/login/lock.svg";
import { useRouter } from "next/navigation";
interface FormValues {
  email: string;
  userName: string;
}

// 模拟检查邮箱是否已注册的函数
const checkEmailRegistered = async (email: string) => {
  // 模拟一个API请求，这里可以替换为实际的API调用
  const registeredEmails = ["test@example.com", "user@domain.com"];
  return registeredEmails.includes(email);
};

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();
  const naviRegister = () => {
    router.push("/register");
  };
  const navPassword = () => {
    router.push("/retrieve-password");
  };
  const onSubmit = async (data: FormValues) => {
    const emailRegistered = await checkEmailRegistered(data.email);
    if (emailRegistered) {
      setError("email", {
        type: "manual",
        message: "This email is already registered",
      });
    } else {
      console.log("Form Data:", data);
      // 提交逻辑
    }
  };

  return (
    <Container maxW="md" px="1.8rem">
      <VStack align="stretch" minH="100vh">
        <Text
          fontFamily="Arial"
          fontSize="1.5rem"
          fontWeight="400"
          pt="10rem"
          textAlign="center"
        >
          Trouble logging in?
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack pt="4rem" pb="4rem" w="100%">
            <Fieldset.Root w="100%">
              <Fieldset.Content w="100%">
                <Field
                  label="Email"
                  fontFamily="Arial"
                  fontSize="0.75rem"
                  fontWeight="400"
                  w="100%"
                  invalid={!!errors.email}
                >
                  <InputGroup
                    w="100%"
                    startElement={
                      <Image src={Book.src} alt="Book" boxSize="0.75rem" />
                    }
                    bg={!!errors.email ? "#ffe0e0" : ""}
                  >
                    <Input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Invalid email format",
                        },
                      })}
                      maxW="md"
                      name="email"
                      type="email"
                      variant="flushed"
                      placeholder="Email, Phone"
                      borderBlockEnd="1px solid #A2A2A2"
                      _focusVisible={{
                        borderColor: "#A2A2A2",
                        boxShadow: "none",
                      }}
                    />
                  </InputGroup>
                  {errors.email && (
                    <Text color="red.500" fontSize="0.75rem">
                      {errors.email.message}
                    </Text>
                  )}
                </Field>
              </Fieldset.Content>
            </Fieldset.Root>
          </VStack>
          <VStack pb="4rem" w="100%">
            <Text
              fontFamily="Arial"
              fontSize="0.75rem"
              fontWeight="400"
              color="#A2A2A2"
              textAlign="center"
            >
              Enter you email, phone, or username and we’ll send you a link to
              get back into your account.
            </Text>
            <Button w="100%" type="submit" py="1.75rem">
              Send login link
            </Button>
            <Text
              fontFamily="Arial"
              fontSize="0.75rem"
              fontWeight="400"
              color="#A2A2A2"
              textAlign="center"
            >
              Create new account
            </Text>
            <Text
              fontFamily="Arial"
              fontSize="0.75rem"
              fontWeight="700"
              color="#FA8929"
              textAlign="center"
              cursor="pointer"
              onClick={naviRegister}
            >
              LOGIN
            </Text>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default Page;
