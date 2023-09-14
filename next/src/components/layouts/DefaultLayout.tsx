import { ReactElement } from "react";

interface IProps {
  children: ReactElement;
}

export default function DefaultLayout({ children }: IProps) {
  return (
    <div>
      {children}
    </div>
  );
}
