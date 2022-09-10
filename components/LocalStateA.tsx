import { ChangeEvent, FormEvent, useState, VFC } from "react";
import { todoVar } from "../cache";
import { useReactiveVar } from "@apollo/client";
import Link from "next/link";

// ユーザーが新しいタスクを追加できるようにする
// タスクはtodoVarの配列の要素として追加される
const LocalStateA: VFC = () => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // submitボタンはデフォルトだとページがリロードしちゃう
    // e.preventDefault()でそれを防げる
    e.preventDefault();
    todoVar([...todoVar(), { title: input }]);
    setInput("");
  };

  // useReactiveVarの引数にはmakeVarで作ったstateを指定する
  const todos = useReactiveVar(todoVar);
  return (
    <>
      <p className="mb-3 font-bold">makeVar</p>
      {todos?.map((task, i) => {
        return (
          <p className="mb-3 y-1" key={i}>
            {task.title}
          </p>
        );
      })}
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="mb-3 px-3 py-2 border border-gray-300"
          placeholder="New task ?"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
        <button
          disabled={!input}
          className="disabled:opacity-40 mb-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
          type="submit"
        >
          Add new state
        </button>
      </form>
      <Link href="/local-state-b">
        <a>Next</a>
      </Link>
    </>
  );
};

export default LocalStateA;
