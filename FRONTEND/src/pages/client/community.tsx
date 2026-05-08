import { memo } from "react";

const CommunityPage = memo(function CommunityPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 pt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Feed</h1>
        <p className="text-muted-foreground">Connect with others and share your journey.</p>
      </div>
      <div className="flex-1 rounded-xl bg-muted/50 border-2 border-dashed flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Community features coming soon.</p>
      </div>
    </div>
  );
});

export default CommunityPage;
