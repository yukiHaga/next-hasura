import { VFC } from "react";
import Link from "next/link";

// Apollo Clientでクエリを使ってhasuraからデータを取得するためには、フックスのuseQueryが必要
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../queries/queries";

// クエリの型
import { GetUsersQuery } from "../types/generated/graphql";
import Layout from "../components/Layout";

const FetchMain: VFC = () => {
  // GET_USERSを実行したいので、useQueryを定義する
  // 引数に実行したいクエリ
  // ジェネリックスでクエリの型を指定する
  // 返り値に取得したデータ。通信中にエラーが出たら、errorがtrueになる
  // loadingというのもあって、通信中はloadingがtrueになる
  // 4つのフェッチポリシーが存在する
  // fetchPolicyを設定しない場合、デフォルトではcache-firstというfetchPolicyが設定される
  // cache-firstは一旦取得したデータがキャッシュにある場合、そのキャッシュを常に読みにいく。
  // データがサーバー側で頻繁に変わるなら、cache-firstはお勧めできない。キャッシュのデータを常に使ってしまうから。
  // cache-firstは変わらないデータなどに向いている。
  // no-cacheはキャッシュを使わない
  // network-onlyはuseQueryが呼び出されるたびに必ずサーバにアクセスする。なので、キャッシュが常に最新の状態になる
  // リアルタイムでサーバーと同期したかったり、サーバーのデータが頻繁に変わるなら、network-onlyを使った方が良い
  // cache-and-networkはnetwork-onlyとほぼ挙動は同じだが、network-onlyはサーバーからデータが返ってくるまで何も画面に表示しない。
  // cache-and-networkは、サーバーからデータが返ってくるまでの間、既存のキャッシュのデータを表示する。データが返ってきたらキャッシュを上書きして、画面の表示を変える
  // 多くのアプリケーションでは、cache-and-networkにしておけば大丈夫
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    // fetchPolicy: "network-only"
    fetchPolicy: "cache-and-network",
    // fetchPolicy: "cache-first"
    // fetchPolicy: "no-cache"
  });

  if (error) {
    return (
      <Layout title="Hasura fetchPolicy">
        <p>Error: {error.message}</p>
      </Layout>
    );
  }

  return (
    <Layout title="Hasura fetchPolicy">
      <p className="mb-6 font-bold">Hasura main page</p>
      {data?.users.map((user) => {
        return (
          <p className="my-1" key={user.id}>
            {user.name}
          </p>
        );
      })}
      <Link href="/hasura-sub">
        <a className="mt-6">Next</a>
      </Link>
    </Layout>
  );
};

export default FetchMain;
