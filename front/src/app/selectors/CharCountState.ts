import React from "react";
import { selector } from "recoil";
import { textState } from "../atoms/textState";

export const CharCountState = selector({
  key: "CharCountState",
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  },
});
