import Skeleton from "./Skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      {/* Chart */}
      <Skeleton className="h-64" />

      {/* Table */}
      <div className="space-y-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>

    </div>
  );
};

export default DashboardSkeleton;