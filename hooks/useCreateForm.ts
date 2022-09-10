import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../queries/queries";
import { CreateUserMutation } from "../types/generated/graphql";

export const useCreateForm = () => {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");

  // CREATEとDELETEの場合、処理が終わった後にキャッシュが自動的に更新されない仕様になっている。
  // UPDATEは自動でアポロがキャッシュを更新してくれる
  // CREATEとDELETEの場合、自分でキャッシュを更新する後処理を書く必要がある。
  // 処理が終了した後に、updateという関数を使う
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    // @ts-ignore
    update(cache, { data: { insert_users_one } }) {
      const cacheId = cache.identify(insert_users_one);
      cache.modify({
        // fieldsには更新したいフィールドを指定する
        // usersのフィールドのキャッシュを書き換えたいので、usersを指定する
        // 第一引数には既存のキャッシュの配列を取得できる
        fields: {
          users(existingUsers, { toReference }) {
            // toReferenceにidを指定すると、そのidを表すデータ(insert_users_one)を参照できる
            // @ts-ignore
            return [toReference(cacheId), ...existingUsers];
          },
        },
      });
    },
  });

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const usernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  // カスタムフックの中で定義する関数は基本的には、useCallbackが適用されていることを推奨されている
  // カスタムフックはメンバー間で再利用できるようにすべき
  const printMsg = useCallback(() => {
    console.log("Hello");
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await insert_users_one({
          variables: {
            name: username,
          },
        });
      } catch (err) {
        // @ts-ignore
        alert(err.message);
      }
      setUsername("");
    },
    [username]
  );

  return {
    text,
    handleSubmit,
    username,
    usernameChange,
    printMsg,
    handleTextChange,
  };
};
