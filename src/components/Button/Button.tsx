import "./Button.css";

interface ButtonProps {
  child: string;
}

export default function Button({ child }: ButtonProps) {
  return (
    <>
      <button type="submit" className="submit-button">
        {child}
      </button>
    </>
  );
}
