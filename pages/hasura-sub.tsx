import { VFC } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_USERS, GET_USERS_LOCAL } from "../queries/queries";
import { GetUsersQuery } from "../types/generated/graphql";
import Layout from "../components/Layout";

const FetchSub: VFC = () => {
  // useQueryはオプションでフェッチポリシーを設定できる
  // 何もオプションを設定しない場合、キャッシュファーストというオプションが有効になる
  // キャッシュファーストは、キャッシュが存在する場合は、常にそのキャッシュの値を見に行く
  // @clientがクエリについていたら、フェッチポリシー自体は意味がなくなる
  // @clientが常にローカルのキャッシュを見に行くから
  const { data } = useQuery<GetUsersQuery>(GET_USERS);
  return (
    <Layout title="Hasura fetchPolicy read cache">
      <p className="mb-6 font-bold">Direct read out from cache</p>
      {data?.users.map((user) => {
        return (
          <p className="my-1" key={user.id}>
            {user.name}
          </p>
        );
      })}
      <Link href="/hasura-main">
        <a className="mt-6">Back</a>
      </Link>
    </Layout>
  );
};

export default FetchSub;
