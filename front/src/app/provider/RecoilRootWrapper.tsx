"use client";

import React, { FC, ReactNode } from "react";
import { RecoilRoot, atom } from "recoil";

type Props = {
  children: ReactNode;
};
type LoginUserType = {
  id: number;
  name: string;
  isStaff: boolean;
  email: string;
};
export const loginUserState = atom<LoginUserType>({
  key: "loginUserState",
  default: { id: 0, name: "", isStaff: false, email: "" },
});

const RecoilRootWrapper: FC<Props> = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default RecoilRootWrapper;
