"use client";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import InputForm from "../components/atoms/InputForm";
import FormButton from "../components/atoms/FormButton";
import { useFormContext } from "react-hook-form";
import { LoginUserType } from "../types/api/UserType";
import { BaseClientType, BaseClientWithoutAuth } from "../lib/client";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { loginUserState } from "../provider/RecoilRootWrapper";

const Login = () => {
  const [signOnUser, setSignOnUser] = useState<LoginUserType>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setSignOnUser({ ...signOnUser, [name]: value });
    },
    [signOnUser, setSignOnUser]
  );
  const { handleSubmit } = useFormContext();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const props: BaseClientType = {
          method: "get",
          url: "accounts",
          options: "application/json; charset=utf-8",
        };
        const res = await BaseClientWithoutAuth(props);
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
  }, []);

  const handleonSubmit = async () => {
    try {
      const props: BaseClientType = {
        method: "post",
        url: "jwtcookie/create",
        data: { email: signOnUser.email, password: signOnUser.password },
        options: "application/json; charset=utf-8",
      };
      const res = await BaseClientWithoutAuth(props);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      console.log(res.data);
      router.push("/");
    } catch (e: any) {
      console.log(e.response.data.detail);
      alert(e.response.data.detail);
    }
  };
  return (
    <>
      <Flex justify={"center"} align={"center"} h={"100vh"}>
        <Box
          w={"md"}
          bg={"white"}
          borderRadius={"lg"}
          shadow={"lg"}
          px={8}
          pt={6}
          pb={10}
        >
          <Stack spacing={7}>
            <Heading
              as="h1"
              fontSize={"2xl"}
              color={"green.700"}
              textAlign={"center"}
            >
              Login
            </Heading>
            <form onSubmit={handleSubmit(handleonSubmit)}>
              <Stack spacing={5}>
                <InputForm
                  title="email"
                  name="email"
                  required={true}
                  type="email"
                  handleChange={handleChange}
                />
                <InputForm
                  title="password"
                  name="password"
                  required={true}
                  type="password"
                  handleChange={handleChange}
                />
                <FormButton type="submit" color="whatsapp">
                  Login
                </FormButton>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default Login;
