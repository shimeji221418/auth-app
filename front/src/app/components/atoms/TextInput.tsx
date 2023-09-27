"use client";
import { textState } from "@/app/atoms/textState";
import { Box, Input, Text } from "@chakra-ui/react";
import React, { ChangeEvent } from "react";
import { useRecoilState } from "recoil";

const TextInput = () => {
  const [text, setText] = useRecoilState(textState);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return (
    <>
      <Input onChange={handleChange} />
      <Text>{text}</Text>
    </>
  );
};

export default TextInput;
