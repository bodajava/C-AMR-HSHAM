import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Fire02Icon, 
  DropletIcon, 
  Moon02Icon, 
  Dumbbell01Icon, 
  Apple01Icon,
  ArrowUpRight01Icon,
  FlashIcon,
  Activity01Icon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { metricsApi, workoutApi } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

function StatIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    activity: <HugeiconsIcon icon={Activity01Icon} className="text-red-500" />,
    flash: <HugeiconsIcon icon={FlashIcon} className="text-primary" />,
    fire: <HugeiconsIcon icon={Fire02Icon} className="text-orange-500" />,
    droplet: <HugeiconsIcon icon={DropletIcon} className="text-blue-500" />,
  };
  return <>{iconMap[name] ?? null}</>;
}

const StatCard = memo(function StatCard({ stat }: { stat: any }) {
  return (
    <Card className={cn("bg-gradient-to-br border-muted shadow-sm", stat.color)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center">
          <StatIcon name={stat.iconName} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black">{stat.value}</div>
        <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{stat.description}</p>
      </CardContent>
    </Card>
  );
});

const WorkoutRow = memo(function WorkoutRow({ workout }: { workout: any }) {
  return (
    <Link to={`/dashboard/workouts/${workout._id}`} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-muted/50 transition-all border border-transparent hover:border-border">
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary"
        )}>
          <HugeiconsIcon icon={Dumbbell01Icon} className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-black leading-none">{workout.name}</p>
          <p className="text-xs text-muted-foreground font-bold mt-1 uppercase">{workout.category} • {workout.description?.substring(0, 30)}...</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest bg-primary text-primary-foreground"
        )}>
          Active
        </span>
        <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all" />
      </div>
    </Link>
  );
});

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, workoutsRes] = await Promise.all([
          metricsApi.getMetrics(),
          workoutApi.getAll()
        ]);
        setMetrics(metricsRes.data);
        setWorkouts(workoutsRes.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { 
      label: "Live Pulse", 
      value: metrics?.livePulse.toLocaleString() || "0", 
      iconName: "activity",
      color: "from-red-500/10",
      description: metrics?.performanceLevel || "Elite Performance Level"
    },
    { 
      label: "Intensity", 
      value: `${metrics?.intensity || 0}%`, 
      iconName: "flash",
      color: "from-primary/10",
      description: metrics?.targetThreshold || "Target Threshold Met"
    },
    { 
      label: "Daily Fuel", 
      value: metrics?.dailyFuel.toLocaleString() || "0", 
      iconName: "fire",
      color: "from-orange-500/10",
      description: "KCAL Target: Active"
    },
    { 
      label: "Hydration", 
      value: `${metrics?.hydration || 0}L`, 
      iconName: "droplet",
      color: "from-blue-500/10",
      description: metrics?.goalAchievement || "Goal: 100% Achieved"
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 pt-0">
        <Skeleton className="h-20 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-7">
          <Skeleton className="col-span-4 h-96 rounded-3xl" />
          <Skeleton className="col-span-3 h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 pt-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Performance Overview</h1>
          <p className="text-muted-foreground text-lg">
            {user ? `${user.firstName} ${user.lastName}` : "Athlete"} • ID: {user?.email.split('@')[0] || "Guest"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-2xl border">
           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-xs font-bold uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Active Program Preview */}
        <Card className="col-span-4 shadow-xl shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
                <HugeiconsIcon icon={FlashIcon} className="h-3 w-3" />
                Active Protocol
              </div>
              <CardTitle className="text-2xl font-black">Training Schedule</CardTitle>
              <CardDescription className="font-medium">Active workouts for your current cycle</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full font-bold shadow-sm">
              <Link to="/dashboard/workouts">View Full Plan</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {workouts.length > 0 ? (
                workouts.map((workout, idx) => (
                  <WorkoutRow key={idx} workout={workout} />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground font-bold italic">
                  No active workouts found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Macro Breakdown */}
        <Card className="col-span-3 shadow-xl shadow-blue-500/5">
          <CardHeader className="border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black">Macro Balance</CardTitle>
                <CardDescription className="font-medium">Target: {metrics?.dailyFuel || 2850} kcal</CardDescription>
              </div>
              <Button asChild variant="ghost" size="icon" className="rounded-xl bg-blue-500/10 hover:bg-blue-500/20">
                <Link to="/dashboard/meals">
                  <HugeiconsIcon icon={Apple01Icon} className="h-6 w-6 text-blue-500" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            {[
              { 
                label: "Protein", 
                current: `${metrics?.protein || 0}g`, 
                goal: `${metrics?.proteinGoal || 210}g`, 
                pct: Math.min(((metrics?.protein || 0) / (metrics?.proteinGoal || 210)) * 100, 100), 
                color: "bg-blue-500" 
              },
              { 
                label: "Carbohydrates", 
                current: `${metrics?.carbs || 0}g`, 
                goal: `${metrics?.carbsGoal || 320}g`, 
                pct: Math.min(((metrics?.carbs || 0) / (metrics?.carbsGoal || 320)) * 100, 100), 
                color: "bg-green-500" 
              },
              { 
                label: "Healthy Fats", 
                current: `${metrics?.fats || 0}g`, 
                goal: `${metrics?.fatsGoal || 85}g`, 
                pct: Math.min(((metrics?.fats || 0) / (metrics?.fatsGoal || 85)) * 100, 100), 
                color: "bg-yellow-500" 
              },
            ].map((macro) => (
              <div key={macro.label} className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span>{macro.label}</span>
                  <span className="text-muted-foreground">{macro.current} / {macro.goal}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", macro.color)} style={{ width: `${macro.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-6 border-t">
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30">
                 <div className="h-8 w-8 rounded-lg bg-white dark:bg-black/40 flex items-center justify-center shrink-0">
                   <HugeiconsIcon icon={Moon02Icon} className="h-4 w-4 text-indigo-500" />
                 </div>
                 <p className="text-xs font-bold leading-tight">Sleep Score: {metrics?.sleepScore || 88}/100. Recovery is optimal for today's high-intensity block.</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
