import { forwardRef } from "react";

const Field = forwardRef(({ label, ...props }, ref) => {
  return (
    <div>
      <label className="text-sm text-textLight mb-1 block">{label}</label>
      <input
        ref={ref}
        autoComplete="off"
        {...props}
        className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
});

Field.displayName = "Field";

export default Field;
