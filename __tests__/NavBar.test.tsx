/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { getPage, initTestHelpers } from "next-page-tester";
import { setupServer } from "msw/node";
import { handlers } from "../mock/handlers";
import "setimmediate";

// next-page-testerを使う場合、まずは初期化する必要がある
initTestHelpers();

// setupServerを使って、handlersの内容でテスト用のモックサーバーを作る
const server = setupServer(...handlers);

// 最初にモックサーバーを起動する
beforeAll(() => {
  server.listen();
});

// 各テストケースが終わるたびに、サーバーのリセットとテスティングライブラリのクリーンナップを行う
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// 全てのテストが終わったら、サーバーをクローズする
afterAll(() => {
  server.close();
});

// NavBarのテストケースを書く
// getPageでindexページを取得する
describe("Navigation Test Cases", () => {
  it("Should route to selected page in navbar", async () => {
    const { page } = await getPage({
      route: "/",
    });
    render(page);
    expect(await screen.findByText("Next.js + GraphQL")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("makevar-nav"));
    expect(screen.getByText("makeVar")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("fetchpolicy-nav"));
    expect(await screen.findByText("Hasura main page")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("crud-nav"));
    expect(await screen.findByText("Hasura CRUD")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("ssg-nav"));
    expect(await screen.findByText("SSG+ISR")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("memo-nav"));
    expect(
      await screen.findByText("Custom Hook + useCallback + memo")
    ).toBeInTheDocument();
    userEvent.click(screen.getByTestId("home-nav"));
    expect(await screen.findByText("Next.js + GraphQL")).toBeInTheDocument();
  });
});
