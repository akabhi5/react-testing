import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
import { describe, expect, it } from "vitest";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render the product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render the message product not found", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it("should render the error id product id is invalid", async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message when there is an error", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading indicator after data is fetched", async () => {
    render(<ProductDetail productId={1} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove loading indicator after data fetching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
