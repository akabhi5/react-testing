import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { navigateTo } from "./utils";
import { db } from "./mocks/db";

describe("Router", () => {
  it("should render the home page for /", () => {
    navigateTo("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("should render the products page for /products", () => {
    navigateTo("/products");

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should render the product details page for /products/:id", async () => {
    const product = db.product.create();

    navigateTo("/products/" + product.id);

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });
});
