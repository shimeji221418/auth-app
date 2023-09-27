import { textState } from "@/app/atoms/textState";
import { CharCountState } from "@/app/selectors/CharCountState";
import { Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";

const CharacterCount = () => {
  const count = useRecoilValue(CharCountState);
  const text = useRecoilValue(textState);
  return (
    <>
      <Text>文字数：{count}</Text>
      <Text>入力値： {text}</Text>
    </>
  );
};

export default CharacterCount;
