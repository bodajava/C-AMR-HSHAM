import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics02Icon, Target01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { memo } from "react";

const ProgressPage = memo(function ProgressPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 pt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
        <p className="text-muted-foreground">Visualize your journey and celebrate your milestones.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Body Weight</CardTitle>
            <HugeiconsIcon icon={Analytics02Icon} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.4 kg</div>
            <p className="text-xs text-muted-foreground">-1.2 kg from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Body Fat %</CardTitle>
            <HugeiconsIcon icon={Target01Icon} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2%</div>
            <p className="text-xs text-muted-foreground">-0.8% since start</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Muscle Mass</CardTitle>
            <HugeiconsIcon icon={UserMultipleIcon} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38.2 kg</div>
            <p className="text-xs text-muted-foreground">+0.5 kg lean gains</p>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Historical data across all metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground">Detailed charts and analytics coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
});

export default ProgressPage;
