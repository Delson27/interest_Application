export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-10 text-textLight">
      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-3" />
      {label}
    </div>
  );
}
