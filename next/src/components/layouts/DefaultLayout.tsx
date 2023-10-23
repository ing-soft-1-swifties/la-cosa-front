import { ReactElement } from "react";

interface IProps {  // Propiedades del layout
  children: ReactElement;
}

export default function DefaultLayout({ children }: IProps) {  
  return ( // Crea un div con los hijos
    <div>
      {children}
    </div>
  );
}
