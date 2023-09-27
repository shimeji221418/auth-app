"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {
  BaseClientType,
  BaseClientWithAuth,
  BaseClientWithoutAuth,
  BaseClientWithoutAuthType,
} from "./lib/client";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import PrimaryButton from "./components/atoms/PrimaryButton";
import { useRouter } from "next/navigation";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import InputForm from "./components/atoms/InputForm";
import FormButton from "./components/atoms/FormButton";
import TextInput from "./components/atoms/TextInput";
import CharacterCount from "./components/atoms/CharacterCount";
import { useRecoilState } from "recoil";
import { loginUserState } from "./provider/RecoilRootWrapper";

export default function Home() {
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);
  const router = useRouter();
  const { handleSubmit } = useFormContext();
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    user_id: 1,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          await getUsers(token);
        }
        const user = await tokenToUser();
        setLoginUser(user);
        console.log(user);
        return user;
      } catch (e: any) {
        // tokenの有効期限が切れていたら refreshを試みる
        if (e.response.data.error == "Activations link expired") {
          const refresh = await getRefreshToken();
          const refreshRet = await newToken(refresh);
          console.log(e.response.data.error);
          if (refreshRet.access) {
            const user = await tokenToUser();
            const token = localStorage.getItem("access_token");
            if (token) {
              await getUsers(token);
            }
            return user;
          }
          // refresh に成功したら再度 access tokenでのユーザー取得を試みる
        }
      }
    };
    fetchCurrentUser();
  }, []);

  // tokenからuser情報を取得
  const tokenToUser = async () => {
    const props: BaseClientType = {
      method: "get",
      url: "loginuser/",
      options: "application/json; charset=utf-8",
    };
    const res = await BaseClientWithoutAuth(props);
    // console.log(res.data);
    if (res.status === 400) {
      throw res;
    }
    return res.data;
  };

  // refresh tokenをもらう #refresh_get
  const getRefreshToken = async () => {
    try {
      const props: BaseClientType = {
        method: "get",
        url: "jwtcookie/refresh",
        options: "application/json; charset=utf-8",
      };
      const res = await BaseClientWithoutAuth(props);
      console.log(res.data);
      const ret = await res.data;
      return ret;
    } catch (e: any) {
      console.log(e);
    }
  };

  // refresh tokenから 新しい access tokenを生成 #TokenRefresh
  const newToken = async (refresh: any) => {
    try {
      const props: BaseClientType = {
        method: "post",
        url: "jwtcookie/newtoken",
        options: "application/json; charset=utf-8",
        data: JSON.stringify(refresh),
      };
      const res = await BaseClientWithoutAuth(props);
      console.log(res.data);
      localStorage.setItem("access_token", res.data.access);
      //refresh_tokenは一回で使い捨て　→　blacklist()へ
      localStorage.setItem("refresh_token", res.data.refresh);
      const ret = await res.data;
      return ret;
    } catch (e: any) {
      console.log(e.response.data.detail);
      alert(e.response.data.detail);
    }
  };
  const getUsers = async (token: string) => {
    try {
      const props: BaseClientType = {
        method: "get",
        url: "accounts",
        options: "application/json; charset=utf-8",
        token: token,
      };
      const res = await BaseClientWithAuth(props);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    try {
      const props: BaseClientType = {
        method: "post",
        url: "logout/",
        options: "application/json; charset=utf-8",
        data: { refresh_token: localStorage.getItem("refresh_token") },
      };
      const res = await BaseClientWithoutAuth(props);
      localStorage.clear();
      console.log(res.data);
      router.push("/login");
    } catch (e: any) {
      console.log(e.response.data.detail);
    }
  };

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewPost({ ...newPost, [name]: value });
    },
    [newPost, setNewPost]
  );

  const handleonSubmit = async () => {
    try {
      const data = {
        title: newPost.title,
        content: newPost.content,
        user_id: newPost.user_id,
      };
      const props: BaseClientWithoutAuthType = {
        method: "post",
        url: "posts/",
        data: data,
      };
      const res = await BaseClientWithoutAuth(props);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <>Home</>
      <PrimaryButton onClick={handleLogout} size="md" color="yellow">
        Logout
      </PrimaryButton>
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
            NewPost
          </Heading>
          <form onSubmit={handleSubmit(handleonSubmit)}>
            <Stack spacing={5}>
              <InputForm
                title="title"
                name="title"
                required={true}
                type="text"
                handleChange={handleChange}
              />
              <InputForm
                title="content"
                name="content"
                required={true}
                type="text"
                handleChange={handleChange}
              />
              <FormButton type="submit" color="whatsapp">
                Save
              </FormButton>
            </Stack>
          </form>
        </Stack>
      </Box>
      <Box bg={"white"} width={"md"} borderRadius={"md"}>
        <TextInput />
        <CharacterCount />
      </Box>
    </>
  );
}
