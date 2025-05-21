import React from "react";

// export default function CustomSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
//   return (
//     <select
//       {...props}
//       className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900"
//     >
//       {props.children}
//     </select>
//   );
// }
const CustomSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ ...props }, ref) => {
  return (
    <select
      className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900"
      ref={ref}
      {...props}
    >
      {props.children}
    </select>
  );
});
CustomSelect.displayName = 'CustomSelect';
export default CustomSelect;
