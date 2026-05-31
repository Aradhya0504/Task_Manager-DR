const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
    <div className="skeleton h-4 rounded w-3/4"></div>
    <div className="skeleton h-3 rounded w-1/2"></div>
    <div className="flex gap-2 mt-2">
      <div className="skeleton h-5 rounded-full w-14"></div>
      <div className="skeleton h-5 rounded-full w-16"></div>
    </div>
  </div>
);

const LoadingSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;
