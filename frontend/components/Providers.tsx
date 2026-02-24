"use client"; // This tells Next.js this is a browser component

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { configureAmplify } from "@/amplifyConfig"; // Adjust path

configureAmplify();

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
