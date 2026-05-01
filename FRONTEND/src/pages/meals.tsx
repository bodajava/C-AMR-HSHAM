import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Apple01Icon,
  NaturalFoodIcon,
  Fire02Icon,
  Calendar01Icon,
  ArrowRight01Icon,
  Add01Icon,
  ChefHatIcon,
  AlarmClockIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { mealApi, metricsApi } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-600",
  Medium: "bg-blue-500/10 text-blue-600",
  Hard: "bg-red-500/10 text-red-600",
};

export default function MealsPage() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const baseRoute = isDashboard ? "/dashboard/meals" : "/meals";

  const [meals, setMeals] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, metricsRes] = await Promise.all([
          mealApi.getAll(),
          metricsApi.getMetrics()
        ]);
        setMeals(mealsRes.data);
        setMetrics(metricsRes.data);
      } catch (error) {
        console.error("Failed to fetch meals", error);
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
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-3xl w-full" />)}
        </div>
      </div>
    );
  }

  const consumedKcal = meals.reduce((acc, meal) => acc + (meal.macros?.calories || 0), 0);
  const targetKcal = metrics?.dailyFuel || 2850;
  const remainingKcal = targetKcal - consumedKcal;

  const totalProtein = meals.reduce((acc, meal) => acc + parseInt(meal.macros?.protein || "0"), 0);
  const totalCarbs = meals.reduce((acc, meal) => acc + parseInt(meal.macros?.carbs || "0"), 0);
  const totalFats = meals.reduce((acc, meal) => acc + parseInt(meal.macros?.fats || "0"), 0);

  const macros = [
    { label: "Protein", value: `${totalProtein}g`, target: "210g", color: "bg-blue-500" },
    { label: "Carbs", value: `${totalCarbs}g`, target: "320g", color: "bg-green-500" },
    { label: "Fats", value: `${totalFats}g`, target: "85g", color: "bg-yellow-500" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
            <HugeiconsIcon icon={Apple01Icon} className="h-4 w-4" />
            Elite Nutrition
          </div>
          <h1 className="text-4xl font-black tracking-tight">Fuel Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Precision macro distribution optimized for hypertrophy and recovery.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="lg" className="rounded-full px-8 font-bold gap-2">
            <HugeiconsIcon icon={Add01Icon} className="h-5 w-5" />
            Add Food
          </Button>
        </div>
      </div>

      {/* Macro stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Daily Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{targetKcal.toLocaleString()}</div>
            <p className="text-sm font-medium mt-1 opacity-90 text-primary-foreground/80 font-bold">KCAL TOTAL</p>
          </CardContent>
        </Card>
        {macros.map((macro, i) => (
          <Card key={i} className="bg-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{macro.label}</CardTitle>
              <div className={cn("h-1.5 w-1.5 rounded-full", macro.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{macro.value}</div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn("h-full", macro.color)} 
                  style={{ width: `${Math.min((parseInt(macro.value) / parseInt(macro.target)) * 100, 100)}%` }} 
                />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase">Goal: {macro.target}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meal Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Today's Meals</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Remaining</p>
            <p className="text-lg font-black text-primary">{remainingKcal.toLocaleString()} kcal</p>
          </div>
        </div>

        <div className="space-y-4">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <Link
                key={meal._id}
                to={`${baseRoute}/${meal._id}`}
                className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-3xl border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200"
              >
                {/* Image thumbnail */}
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden shrink-0 bg-muted">
                  {meal.image ? (
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HugeiconsIcon icon={ChefHatIcon} className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">{meal.category}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                      <HugeiconsIcon icon={AlarmClockIcon} className="h-3 w-3" />
                      {meal.time || "00:00"}
                    </span>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase", difficultyColor[meal.difficulty || "Easy"])}>
                      {meal.difficulty || "Easy"}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      <HugeiconsIcon icon={ChefHatIcon} className="h-3 w-3 inline mr-1" />
                      {meal.prepTime || "15 min"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{meal.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-1">{meal.description}</p>
                  <div className="flex gap-1.5 pt-1">
                    {meal.tags?.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Macros panel */}
                <div className="flex items-center gap-4 md:gap-6 bg-muted/40 px-5 py-3 rounded-2xl shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">P</p>
                    <p className="text-sm font-bold text-blue-500">{meal.macros?.protein || "0g"}</p>
                  </div>
                  <div className="text-center border-x px-5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">C</p>
                    <p className="text-sm font-bold text-green-500">{meal.macros?.carbs || "0g"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">F</p>
                    <p className="text-sm font-bold text-yellow-500">{meal.macros?.fats || "0g"}</p>
                  </div>
                  <div className="text-center border-l pl-5">
                    <div className="flex items-center gap-1 text-primary font-black">
                      <HugeiconsIcon icon={Fire02Icon} className="h-3 w-3" />
                      <span className="text-sm">{meal.macros?.calories || 0}</span>
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">kcal</p>
                  </div>
                </div>

                {/* View Recipe CTA */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 duration-200">
                    <HugeiconsIcon icon={NaturalFoodIcon} className="h-3 w-3" />
                    View Recipe
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-5 w-5" />
                  </Button>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
              <p className="text-muted-foreground font-bold">No meals planned for today.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hydration Tracker</CardTitle>
            <CardDescription>Target: {metrics?.hydration || "4.5"}L Daily</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-black text-blue-500">2.8L</div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "62%" }} />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-8 flex-1 rounded-lg border flex items-center justify-center font-bold text-xs",
                    i <= 5 ? "bg-blue-500 border-blue-500 text-white" : "bg-card text-muted-foreground"
                  )}
                >
                  {i * 250}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nutrition AI Insights</CardTitle>
            <CardDescription>Optimized by Lumina Engine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <HugeiconsIcon icon={Fire02Icon} className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm font-medium leading-relaxed">
                  Increasing carb intake by 20g pre-workout tomorrow will optimize your Aerobic Engine session.
                </p>
              </div>
              <div className="flex gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                <HugeiconsIcon icon={NaturalFoodIcon} className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-sm font-medium leading-relaxed">
                  Micro-nutrient density is 12% higher than last week. Great focus on variety.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
