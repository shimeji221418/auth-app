"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import InputForm from "../components/atoms/InputForm";
import FormButton from "../components/atoms/FormButton";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import {
  BaseClientType,
  BaseClientWithoutAuth,
  BaseClientWithoutAuthType,
} from "../lib/client";
import { NewUserType } from "../types/api/UserType";

const signup = () => {
  const router = useRouter();
  const { handleSubmit } = useFormContext();
  const [newUser, setNewUser] = useState<NewUserType>({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewUser({ ...newUser, [name]: value });
    },
    [newUser, setNewUser]
  );

  const handleonSubmit = () => {
    const request = async () => {
      try {
        await handleSignUp();
        const props: BaseClientType = {
          method: "post",
          url: "jwtcookie/create",
          data: { email: newUser.email, password: newUser.password },
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
    request();
  };

  const handleSignUp = async () => {
    try {
      const props: BaseClientWithoutAuthType = {
        method: "post",
        url: "accounts/",
        options: "application/json; charset=utf-8",
        data: {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
      };
      const res = await BaseClientWithoutAuth(props);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Flex justify="center" align={"center"} h={"100vh"}>
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
              as={"h1"}
              fontSize={"2xl"}
              textAlign={"center"}
              color={"green.700"}
            >
              SignUp
            </Heading>
            <form onSubmit={handleSubmit(handleonSubmit)}>
              <Stack spacing={5}>
                <InputForm
                  title="name"
                  name="name"
                  required={true}
                  type="text"
                  handleChange={handleChange}
                />
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
                <FormButton color="whatsapp" type={"submit"}>
                  SignUp
                </FormButton>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default signup;
