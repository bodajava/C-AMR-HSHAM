import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Calendar03Icon, 
  Dumbbell01Icon, 
  Apple01Icon, 
  CheckmarkCircle02Icon,
  Delete02Icon,
  PlusSignIcon,
  FloppyDiskIcon,
  Note01Icon
} from "@hugeicons/core-free-icons";
import { workoutApi, mealApi, weeklyPlanApi } from "@/lib/api-client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function AdminWeeklyPlanPage() {
    const [selectedDay, setSelectedDay] = useState('monday');
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [meals, setMeals] = useState<any[]>([]);
    const [weeklyPlans, setWeeklyPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Current Day Editing State
    const [currentPlan, setCurrentPlan] = useState<{
        workouts: string[];
        meals: string[];
        notes: string;
    }>({
        workouts: [],
        meals: [],
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const plan = weeklyPlans.find(p => p.day === selectedDay);
        if (plan) {
            setCurrentPlan({
                workouts: plan.workouts.map((w: any) => w._id || w),
                meals: plan.meals.map((m: any) => m._id || m),
                notes: plan.notes || ''
            });
        } else {
            setCurrentPlan({ workouts: [], meals: [], notes: '' });
        }
    }, [selectedDay, weeklyPlans]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [workoutRes, mealRes, planRes] = await Promise.all([
                workoutApi.getAll(),
                mealApi.getAll(),
                weeklyPlanApi.getAll()
            ]);
            setWorkouts(workoutRes.data);
            setMeals(mealRes.data);
            setWeeklyPlans(planRes.data);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to load data";
            console.error("Failed to fetch data", error);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await weeklyPlanApi.updateByDay(selectedDay, currentPlan);
            toast.success(`Plan for ${selectedDay} updated successfully`);
            await fetchData(); // Refresh data
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to save plan";
            console.error("Failed to save plan", error);
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const toggleItem = (type: 'workouts' | 'meals', id: string) => {
        setCurrentPlan(prev => {
            const list = [...prev[type]];
            const index = list.indexOf(id);
            if (index > -1) {
                list.splice(index, 1);
            } else {
                list.push(id);
            }
            return { ...prev, [type]: list };
        });
    };

    if (loading) {
        return (
            <div className="p-8 space-y-8">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-7 gap-2">
                    {DAYS.map(d => <Skeleton key={d} className="h-10" />)}
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <HugeiconsIcon icon={Calendar03Icon} className="h-8 w-8 text-primary" />
                        Weekly Strategy Planner
                    </h1>
                    <p className="text-muted-foreground font-medium">Assign elite protocols and nutrition to specific days.</p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={saving} 
                    className="rounded-full px-8 font-bold gap-2 shadow-lg shadow-primary/20"
                >
                    {saving ? <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <HugeiconsIcon icon={FloppyDiskIcon} className="h-5 w-5" />}
                    {saving ? "Deploying..." : "Save Strategy"}
                </Button>
            </header>

            {/* Day Selector */}
            <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-2xl border">
                {DAYS.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-sm transition-all capitalize ${
                            selectedDay === day 
                            ? "bg-primary text-primary-foreground shadow-md scale-105" 
                            : "hover:bg-accent/50 text-muted-foreground"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Workouts Selection */}
                <Card className="lg:col-span-1 border-primary/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <HugeiconsIcon icon={Dumbbell01Icon} className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl font-black">Training Protocols</CardTitle>
                        </div>
                        <CardDescription>Select workouts for {selectedDay}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {workouts.map((w) => (
                                <div 
                                    key={w._id}
                                    onClick={() => toggleItem('workouts', w._id)}
                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                                        currentPlan.workouts.includes(w._id)
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-transparent bg-muted/30 hover:border-primary/30"
                                    }`}
                                >
                                    <div>
                                        <p className="font-black text-sm">{w.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{w.category}</p>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        currentPlan.workouts.includes(w._id)
                                        ? "bg-primary border-primary text-white"
                                        : "border-muted-foreground/30 group-hover:border-primary/50"
                                    }`}>
                                        {currentPlan.workouts.includes(w._id) && <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Meals Selection */}
                <Card className="lg:col-span-1 border-blue-500/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <HugeiconsIcon icon={Apple01Icon} className="h-6 w-6 text-blue-500" />
                            </div>
                            <CardTitle className="text-xl font-black">Nutrition Strategy</CardTitle>
                        </div>
                        <CardDescription>Select meals for {selectedDay}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {meals.map((m) => (
                                <div 
                                    key={m._id}
                                    onClick={() => toggleItem('meals', m._id)}
                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                                        currentPlan.meals.includes(m._id)
                                        ? "border-blue-500 bg-blue-500/5 shadow-sm"
                                        : "border-transparent bg-muted/30 hover:border-blue-500/30"
                                    }`}
                                >
                                    <div>
                                        <p className="font-black text-sm">{m.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{m.calories} KCAL • {m.protein}P</p>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        currentPlan.meals.includes(m._id)
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "border-muted-foreground/30 group-hover:border-blue-500/50"
                                    }`}>
                                        {currentPlan.meals.includes(m._id) && <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes & Summary */}
                <Card className="lg:col-span-1 border-accent/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <HugeiconsIcon icon={Note01Icon} className="h-6 w-6 text-accent" />
                            </div>
                            <CardTitle className="text-xl font-black">Strategy Notes</CardTitle>
                        </div>
                        <CardDescription>Instructions for {selectedDay}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin Notes</Label>
                            <textarea
                                value={currentPlan.notes}
                                onChange={(e) => setCurrentPlan(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Enter specific instructions for this day..."
                                className="w-full min-h-[150px] bg-muted/30 border-2 border-transparent focus:border-primary/50 focus:bg-background rounded-2xl p-4 text-sm font-medium transition-all outline-none resize-none"
                            />
                        </div>

                        <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10 space-y-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-accent">Selected for {selectedDay}</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-muted-foreground">Workouts</span>
                                    <span className="h-6 w-6 rounded-lg bg-primary text-white text-[10px] font-black flex items-center justify-center">{currentPlan.workouts.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-muted-foreground">Meals</span>
                                    <span className="h-6 w-6 rounded-lg bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">{currentPlan.meals.length}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
