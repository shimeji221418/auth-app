"use client";
import { Button } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  type: "submit";
  color: string;
  fontColor?: string;
  size?: string;
  onClose?: () => void;
};

const FormButton: FC<Props> = (props) => {
  const { children, type, color, fontColor = "white", size, onClose } = props;
  return (
    <>
      <Button
        type={type}
        colorScheme={color}
        color={fontColor}
        size={size}
        onClick={onClose}
      >
        {children}
      </Button>
    </>
  );
};

export default FormButton;
