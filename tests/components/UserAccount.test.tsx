import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name", () => {
    const user: User = {
      id: 1,
      name: "Abhi",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should not render edit button for non admin", () => {
    const user: User = {
      id: 1,
      name: "Abhi",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should render edit button for admin", () => {
    const user: User = {
      id: 1,
      name: "Abhi",
      isAdmin: true,
    };
    render(<UserAccount user={user} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });
});
