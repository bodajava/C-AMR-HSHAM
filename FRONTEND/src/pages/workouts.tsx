import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Dumbbell01Icon, 
  FlashIcon, 
  Analytics01Icon, 
  ArrowRight01Icon,
  PlayIcon,
  Yoga01Icon,
  Activity01Icon,
  WeightScaleIcon
} from "@hugeicons/core-free-icons";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { metricsApi, workoutApi } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutsPage() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const baseRoute = isDashboard ? "/dashboard/workouts" : "/workouts";

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutsRes, metricsRes] = await Promise.all([
          workoutApi.getAll(),
          metricsApi.getMetrics()
        ]);
        setWorkouts(workoutsRes.data);
        setMetrics(metricsRes.data);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 rounded-2xl w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
            <HugeiconsIcon icon={FlashIcon} className="h-4 w-4" />
            Active Program
          </div>
          <h1 className="text-4xl font-black tracking-tight">Training Protocol</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Foundational strength protocol mixed with high-intensity interval clusters for elite performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{metrics?.livePulse?.toLocaleString() || "0"}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Live Pulse</p>
          </div>
          <Button size="lg" className="rounded-full px-8 font-bold gap-2">
            <HugeiconsIcon icon={PlayIcon} className="h-5 w-5 fill-current" />
            Start Today's Session
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary">{metrics?.intensity || 0}%</div>
            <p className="text-sm text-muted-foreground mt-1">{metrics?.targetThreshold || "Target Threshold"}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary">{workouts.length * 6}</div>
            <p className="text-sm text-muted-foreground mt-1">Sets Per Cycle</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary">8.5/10</div>
            <p className="text-sm text-muted-foreground mt-1">Expert Protocol</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Training Plan</h2>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-500/10 text-green-600">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              In Progress
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          {workouts.length > 0 ? (
            workouts.map((item, idx) => (
              <Link 
                key={idx} 
                to={`${baseRoute}/${item._id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <HugeiconsIcon 
                      icon={
                        item.category === "Strength" ? WeightScaleIcon : 
                        item.category === "Conditioning" ? Activity01Icon :
                        item.category === "Mobility" ? Yoga01Icon : Dumbbell01Icon
                      } 
                      className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.category}</span>
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">{item.subExercises?.length || 0} Exercises</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.category}</p>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
              <p className="text-muted-foreground font-bold">No training programs available at this time.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Program Insights</CardTitle>
            <CardDescription>Your performance trends over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center border-t border-dashed bg-muted/20 m-6 rounded-lg">
             <div className="text-center space-y-2">
               <HugeiconsIcon icon={Analytics01Icon} className="h-8 w-8 text-muted-foreground mx-auto" />
               <p className="text-sm text-muted-foreground font-medium">Strength Progression Chart</p>
             </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Protocol Rules</CardTitle>
            <CardDescription>Guidelines for maximum efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                "Maintain 90-120s rest between compound sets.",
                "Log every rep and RPE value immediately.",
                "Hydrate with 500ml water + electrolytes pre-session.",
                "Strict adherence to tempo (3-1-1-0) for eccentric focus."
              ].map((rule, i) => (
                <li key={i} className="flex gap-3 text-sm font-medium">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary text-[10px] font-bold">
                    {i + 1}
                  </div>
                  {rule}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
