import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Fire02Icon,
  AlarmClockIcon,
  ChefHatIcon,
  NaturalFoodIcon,
  BookOpen01Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { mealApi } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-600",
  Medium: "bg-blue-500/10 text-blue-600",
  Hard: "bg-red-500/10 text-red-600",
};

export default function MealDetailPage() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const backLink = isDashboard ? "/dashboard/meals" : "/meals";

  const { mealId } = useParams<{ mealId: string }>();
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!mealId) return;
      try {
        const res = await mealApi.getById(mealId);
        setMeal(res.data);
      } catch (error) {
        console.error("Failed to fetch meal", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [mealId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl w-full flex flex-1 flex-col gap-8 p-4 md:p-8">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="w-full aspect-[16/7] rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid gap-8 lg:grid-cols-5">
           <div className="lg:col-span-2"><Skeleton className="h-96 rounded-2xl" /></div>
           <div className="lg:col-span-3"><Skeleton className="h-96 rounded-2xl" /></div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="mx-auto max-w-6xl w-full flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <HugeiconsIcon icon={ChefHatIcon} className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Recipe not found</h1>
        <p className="text-muted-foreground">This meal doesn't exist yet in our database.</p>
        <Button asChild className="rounded-full px-8">
          <Link to={backLink}>Back to Meals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full flex flex-1 flex-col gap-8 p-4 md:p-8">
      {/* Back */}
      <Button asChild variant="outline" size="sm" className="w-fit rounded-full gap-2">
        <Link to={backLink}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
          Back to Meals
        </Link>
      </Button>

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
        <img
          src={meal.image || "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=900&q=80"}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              {meal.category}
            </span>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", difficultyColor[meal.difficulty || "Easy"])}>
              {meal.difficulty || "Easy"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{meal.name}</h1>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary border-primary text-primary-foreground">
          <CardContent className="p-4 text-center">
            <HugeiconsIcon icon={Fire02Icon} className="h-5 w-5 mx-auto mb-1 opacity-80" />
            <p className="text-2xl font-black">{meal.macros?.calories || 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Calories</p>
          </CardContent>
        </Card>
        {[
          { label: "Protein", value: meal.macros?.protein || "0g", color: "text-blue-500" },
          { label: "Carbs", value: meal.macros?.carbs || "0g", color: "text-green-500" },
          { label: "Fats", value: meal.macros?.fats || "0g", color: "text-yellow-500" },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 text-center">
              <p className={cn("text-2xl font-black", m.color)}>{m.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl">
          <HugeiconsIcon icon={AlarmClockIcon} className="h-4 w-4" />
          {meal.prepTime || "15 min"}
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl">
          <HugeiconsIcon icon={NaturalFoodIcon} className="h-4 w-4" />
          {meal.servingSize || "1 serving"}
        </div>
        {meal.macros?.fiber && (
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl">
            Fiber: {meal.macros.fiber}
          </div>
        )}
        {meal.tags?.map((tag: string) => (
          <span key={tag} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl bg-primary/5 text-primary border border-primary/10">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Ingredients */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <HugeiconsIcon icon={NaturalFoodIcon} className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Ingredients</h2>
          </div>
          <Card>
            <CardContent className="p-5 space-y-3">
              {meal.ingredients?.map((ing: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary text-[10px] font-black">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium">{ing}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={BookOpen01Icon} className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Instructions</h2>
          </div>
          <div className="space-y-4">
            {meal.instructions?.map((step: string, i: number) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl border bg-card group hover:border-primary/30 transition-all">
                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shrink-0 text-primary-foreground text-xs font-black">
                  {i + 1}
                </div>
                <p className="text-sm font-medium leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>

          {/* Chef Tip */}
          {meal.tips && (
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <HugeiconsIcon icon={FavouriteIcon} className="h-4 w-4 text-amber-500" />
                  Chef's Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{meal.tips}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
