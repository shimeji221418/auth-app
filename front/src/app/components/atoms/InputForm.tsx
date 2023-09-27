"use client";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import React, { ChangeEvent, FC, memo } from "react";

type Props = {
  title: string;
  required: boolean;
  name: string;
  type: string;
  value?: string;
  width?: string;
  fontSize?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  color?: string;
};

const InputForm: FC<Props> = memo((props) => {
  const {
    title,
    required,
    name,
    type,
    value,
    width,
    fontSize,
    handleChange,
    color = "green.500",
  } = props;
  return (
    <InputGroup>
      <InputLeftAddon
        children={title}
        bg={color}
        fontWeight="bold"
        color="white"
        w="100px"
        justifyContent="center"
      />
      <Input
        value={value}
        id={name}
        name={name}
        placeholder={title}
        type={type}
        width={width}
        fontSize={fontSize}
        required={required}
        onChange={handleChange}
      />
    </InputGroup>
  );
});

export default InputForm;
