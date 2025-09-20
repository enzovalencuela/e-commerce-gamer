import "./Button.css";

interface ButtonProps {
  child: string;
  disabled?: boolean;
}

export default function Button({ child, disabled }: ButtonProps) {
  return (
    <>
      <button type="submit" className="submit-button" disabled={disabled}>
        {child}
      </button>
    </>
  );
}
