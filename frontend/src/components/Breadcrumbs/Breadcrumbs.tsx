import { Routes } from "@/lib/types/route";
import { Link, ReactNode } from "@tanstack/react-router";
import React, {
  FC,
  PropsWithChildren,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

type Item = {
  to: Routes;
  element: ReactElement | string;
};

type Context = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

const BreadcrumbsContext = createContext<Context>({
  items: [],
  setItems: () => {}
});

export const BreadcrumbProvider: FC<PropsWithChildren> = (x) => {
  const [items, setItems] = useState<Item[]>([]);
  return (
    <BreadcrumbsContext.Provider value={{ items, setItems }}>
      {x.children}
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumb = (element: ReactElement | string, to: Routes, level: number) => {
  const { items, setItems } = useContext(BreadcrumbsContext);

  useEffect(() => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[level] = {
        element,
        to
      };
      return newItems;
    });

    // Cleanup function
    return () => {
      setItems((prevItems) => prevItems.filter((_, index) => index !== level));
    };
  }, [element, to, level, setItems]);
  return null;
};

export const Breadcrumbs = () => {
  const ctx = useContext(BreadcrumbsContext);

  return (
    <ol className="flex section gap-2 text-text-secondary items-center min-h-8 overflow-y-hidden overflow-x-auto text-nowrap">
      {ctx.items.map((v, i) => (
        <React.Fragment key={i}>
          <li>
            <Link to={v.to}>{v.element}</Link>
          </li>
          {i < ctx.items.length - 1 && (
            <li className="size-1 min-w-1 bg-text-secondary rounded-full" aria-hidden />
          )}
        </React.Fragment>
      ))}
    </ol>
  );
};
