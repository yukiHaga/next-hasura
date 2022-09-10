import { makeVar } from "@apollo/client";

// 複数のタスクを管理するstateを定義する

type Task = {
  title: string;
};

// makeVarを使ってstateを作る
// makeVarを実行した結果がstateとなる
// todoVarがstate名になる。
// makeVarの引数の値がstateの初期値になる
// ジェネリクスの形でstateに型を定義できる
// todoVarの値を更新する場合、todoVar(引数)で更新できる
export const todoVar = makeVar<Task[]>([]);
