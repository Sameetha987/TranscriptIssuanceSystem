const Skeleton = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-lg ${className}`}
    ></div>
  );
};

export default Skeleton;