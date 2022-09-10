import { VFC, useState, FormEvent } from "react";
// 新規作成、更新、削除はmutationなので、useMutationを使う
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_USERS,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from "../queries/queries";

import {
  GetUsersQuery,
  CreateUserMutation,
  DeleteUserMutation,
  UpdateUserMutation,
} from "../types/generated/graphql";

import Layout from "../components/Layout";
import { UserItem } from "../components/UserItem";

// HasuraCRUDには、useMutationなどの通信関係の処理
// Submitボタンのロジックの処理
// レンダリングするUIの部分が混在している。コーディング的に読みづらいので、カスタムフックを使う
const HasuraCRUD: VFC = () => {
  const [editedUser, setEditedUser] = useState({ id: "", name: "" });
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: "cache-and-network",
  });

  // useMutationの返り値には、updateを実行するための関数が返ってくる
  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER);

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

  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    // @ts-ignore
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(existingUsers, { readField }) {
            return existingUsers.filter(
              // @ts-ignore
              (user) => delete_users_by_pk.id !== readField("id", user)
            );
          },
        },
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedUser.id) {
      try {
        await update_users_by_pk({
          variables: {
            id: editedUser.id,
            name: editedUser.name,
          },
        });
      } catch (err) {
        // @ts-ignore
        alert(err.message);
      }
      setEditedUser({ id: "", name: "" });
    } else {
      try {
        await insert_users_one({
          variables: {
            name: editedUser.name,
          },
        });
      } catch (err) {
        // @ts-ignore
        alert(err.message);
      }
      setEditedUser({ id: "", name: "" });
    }
  };

  if (error) return <Layout title="Hasura CRUD">Error: {error.message}</Layout>;
  return (
    <Layout title="Hasura CRUD">
      <p className="mb-3 font-bold">Hasura CRUD</p>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="px-3 py-2 border border-gray-300"
          placeholder="New user ?"
          type="text"
          value={editedUser.name}
          onChange={(e) =>
            setEditedUser({ ...editedUser, name: e.target.value })
          }
        />
        <button
          disabled={!editedUser.name}
          className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
          data-testid="new"
          type="submit"
        >
          {editedUser.id ? "Update" : "Create"}
        </button>
      </form>
      {data?.users.map((user) => {
        return (
          // @ts-ignore
          <UserItem
            key={user.id}
            {...{ user, setEditedUser, delete_users_by_pk }}
          />
        );
      })}
    </Layout>
  );
};

export default HasuraCRUD;
