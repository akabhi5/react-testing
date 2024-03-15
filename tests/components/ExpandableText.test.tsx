import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render full text if less than 255 chars", () => {
    const text = "Short text";
    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should truncate the text if longer than 255 chars", () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });

  it("should exapnd the text when show more button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it("should collapse text when show less button is clicked", async () => {
    render(<ExpandableText text={longText} />);
    const showMorebutton = screen.getByRole("button", { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMorebutton);

    const showLessbutton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessbutton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMorebutton).toHaveTextContent(/more/i);
  });
});
