import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dumbbell01Icon,
  Apple01Icon,
  AlarmClockIcon,
  FlashIcon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  CircleIcon,
  Fire02Icon,
  PlayCircleIcon,
  Activity01Icon,
  Yoga01Icon,
  WeightScaleIcon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ExerciseVideoModal } from "@/components/exercise-video-modal";
import { workoutApi, mealApi } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Exercise {
  name: string;
  sets: string | number;
  reps: string;
  notes?: string;
  videoUrl?: string;
}

interface Meal {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time?: string;
}

export default function DayPage() {
  const { day: workoutId } = useParams<{ day: string }>();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const backLink = isDashboard ? "/dashboard/workouts" : "/workouts";

  const [workout, setWorkout] = useState<any>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState<{
    open: boolean;
    exercise?: Exercise;
  }>({ open: false });

  useEffect(() => {
    const fetchData = async () => {
      if (!workoutId) return;
      try {
        setLoading(true);
        const [workoutRes, mealsRes] = await Promise.all([
          workoutApi.getById(workoutId),
          mealApi.getAll()
        ]);
        setWorkout(workoutRes.data);
        
        // Pick 3 random or first 3 meals for the day's strategy
        const allMeals = mealsRes.data;
        const dayMeals = allMeals.slice(0, 3).map((m: any, idx: number) => ({
          ...m,
          time: idx === 0 ? "08:00 AM" : idx === 1 ? "01:30 PM" : "07:30 PM"
        }));
        setMeals(dayMeals);
      } catch (error) {
        console.error("Failed to fetch protocol data", error);
        toast.error("Failed to load protocol data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workoutId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl w-full flex flex-1 flex-col gap-8 p-4 md:p-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl w-full" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <HugeiconsIcon icon={Dumbbell01Icon} className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Protocol Not Found</h2>
        <Button asChild variant="outline">
          <Link to={backLink}>Go Back to Workouts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full flex flex-1 flex-col gap-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-full shrink-0">
            <Link to={backLink}>
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{workout.name} Protocol</h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base">
              {workout.category} • Professional Grade • High Intensity
            </p>
          </div>
        </div>
        <Button className="rounded-full px-6 font-bold gap-2 w-full md:w-auto">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
          Mark as Completed
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Workout Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon 
                icon={
                  workout.category === "Strength" ? WeightScaleIcon : 
                  workout.category === "Conditioning" ? Activity01Icon :
                  workout.category === "Mobility" ? Yoga01Icon : Dumbbell01Icon
                } 
                className="h-6 w-6 text-primary" 
              />
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Training: {workout.name}</h2>
          </div>

          <div className="space-y-4">
            {workout.subExercises?.map((exercise: any, i: number) => (
              <Card
                key={i}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-card cursor-pointer"
                onClick={() => setVideoModal({ open: true, exercise: {
                  name: exercise.name,
                  sets: exercise.sets,
                  reps: exercise.reps,
                  notes: exercise.notes,
                  videoUrl: exercise.videoUrl
                }})}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black">{exercise.name}</CardTitle>
                    <button
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 duration-200 px-2.5 py-1.5 rounded-lg hover:bg-primary/5"
                    >
                      <HugeiconsIcon icon={PlayCircleIcon} className="h-4 w-4" />
                      Watch Demo
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sets</p>
                      <p className="text-xl font-black">{exercise.sets || 3}</p>
                    </div>
                    <div className="sm:border-x sm:px-8">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reps</p>
                      <p className="text-xl font-black">{exercise.reps || "10-12"}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-muted-foreground font-bold text-sm bg-muted/30 px-3 py-1.5 rounded-xl">
                      <HugeiconsIcon icon={AlarmClockIcon} className="h-4 w-4" />
                      90s Rest
                    </div>
                  </div>
                  {exercise.notes && (
                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed border-t pt-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {exercise.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Meals Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <HugeiconsIcon icon={Apple01Icon} className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Nutrition Strategy</h2>
          </div>

          <div className="space-y-4">
            {meals.length > 0 ? (
              meals.map((meal, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border bg-card/50 hover:border-blue-500/30 transition-colors">
                  <div className="text-center shrink-0 w-16">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{meal.time}</p>
                    <div className="h-8 w-px bg-border mx-auto my-1" />
                    <HugeiconsIcon icon={CircleIcon} className="h-4 w-4 text-muted-foreground mx-auto" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Planned Fuel</p>
                    <h3 className="text-lg font-black tracking-tight">{meal.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 md:gap-4">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="text-blue-500 font-black text-xs">P</span> {meal.protein}g
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="text-green-500 font-black text-xs">C</span> {meal.carbs}g
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="text-yellow-500 font-black text-xs">F</span> {meal.fats}g
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-xs font-black text-primary">
                        <HugeiconsIcon icon={Fire02Icon} className="h-3 w-3" />
                        {meal.calories} KCAL
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="p-10 text-center text-muted-foreground font-medium">
                  No nutritional strategy assigned for this protocol.
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="bg-primary/5 border-primary/20 mt-8">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={FlashIcon} className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Optimization Note</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Today's protocol is focused on maximizing {workout.category?.toLowerCase() || "performance"}. 
                  Ensure you maintain consistent intensity and follow the nutritional timing specified for optimal metabolic response.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Exercise Video Modal */}
      <ExerciseVideoModal
        open={videoModal.open}
        onClose={() => setVideoModal({ open: false })}
        exerciseName={videoModal.exercise?.name ?? ""}
        videoUrl={videoModal.exercise?.videoUrl}
        description={videoModal.exercise?.notes}
      />
    </div>
  );
}
