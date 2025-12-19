import { forwardRef, useState } from "react";

const RadioGroup = forwardRef(
  ({ label, options, defaultValue, onChange, name, ...props }, ref) => {
    const [selected, setSelected] = useState(defaultValue || "");

    const handleSelect = (option, e) => {
      // Prevent any default behavior
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      setSelected(option);
      // Trigger the react-hook-form onChange
      if (onChange) {
        onChange({ target: { value: option, name } });
      }
    };

    return (
      <div>
        <p className="text-sm text-textLight mb-2">{label}</p>
        <div className="flex gap-3">
          {options.map((o, index) => (
            <div key={o}>
              <input
                type="radio"
                ref={index === 0 ? ref : undefined}
                name={name}
                value={o}
                checked={selected === o}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelect(e.target.value, e);
                }}
                className="sr-only"
                id={`${name}-${o}`}
              />
              <label
                htmlFor={`${name}-${o}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(o, e);
                }}
                className={`inline-block px-4 py-2 rounded-full text-sm cursor-pointer transition-colors select-none ${
                  selected === o
                    ? "bg-primary text-white"
                    : "bg-chipBlue hover:bg-blue-200"
                }`}
              >
                {o}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
