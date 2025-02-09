interface InputProps {
  placeholder: string;
  reference: React.RefObject<HTMLInputElement>;
  className?: string;
}

export function Input({ placeholder, reference, className }: InputProps) {
  return (
    <div>
      <input
        className={`w-full border rounded border-gray-300 p-2 ${
          className || ""
        }`}
        ref={reference}
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
}
