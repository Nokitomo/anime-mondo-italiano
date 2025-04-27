import { render, screen } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading component", () => {
  it("mostra lo spinner e il testo nascosto per screen reader", () => {
    render(<Loading />);
    
    // L'icona ha aria-label="Loading"
    const spinner = screen.getByLabelText("Loading");
    expect(spinner).toBeInTheDocument();
    
    // Il testo per screen reader è presente ma nascosto
    const srText = screen.getByText("Caricamento in corso...");
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass("sr-only");
  });
});
