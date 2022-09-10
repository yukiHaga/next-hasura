import { VFC } from "react";
import { todoVar } from "../cache";
import { useReactiveVar } from "@apollo/client";
import Link from "next/link";

const LocalStateB: VFC = () => {
  const todos = useReactiveVar(todoVar);
  return (
    <>
      {todos.map((task, i) => {
        return (
          <p className="mb-3" key={i}>
            {task.title}
          </p>
        );
      })}
      <Link href="/local-state-a">
        <a>Back</a>
      </Link>
    </>
  );
};

export default LocalStateB;
