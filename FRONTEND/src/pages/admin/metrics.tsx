import React, { useState, useEffect } from 'react';
import { metricsApi } from '@/lib/api-client';
import { toast } from 'sonner';
import { Save, Loader2, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AdminMetricsPage = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    livePulse: 0,
    intensity: 0,
    dailyFuel: 0,
    hydration: 0,
    performanceLevel: '',
    targetThreshold: '',
    goalAchievement: '',
    protein: 0,
    proteinGoal: 210,
    carbs: 0,
    carbsGoal: 320,
    fats: 0,
    fatsGoal: 85,
    sleepScore: 88
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  // ── Automated Calculations ───────────────────────────────────────────────────
  useEffect(() => {
    // 1. Calculate Daily Fuel (KCAL)
    const calculatedFuel = (formData.protein * 4) + (formData.carbs * 4) + (formData.fats * 9);
    
    // 2. Calculate Goal Achievement Status
    const proteinPct = formData.proteinGoal > 0 ? (formData.protein / formData.proteinGoal) * 100 : 0;
    const carbsPct = formData.carbsGoal > 0 ? (formData.carbs / formData.carbsGoal) * 100 : 0;
    const fatsPct = formData.fatsGoal > 0 ? (formData.fats / formData.fatsGoal) * 100 : 0;
    const avgPct = Math.min(100, Math.round((proteinPct + carbsPct + fatsPct) / 3));
    const goalStatus = `Goal: ${avgPct}% Achieved`;

    // 3. Determine Performance Level based on Intensity
    let pLevel = 'Rest Day / Recovery';
    if (formData.intensity > 85) pLevel = 'Elite Performance Level';
    else if (formData.intensity > 70) pLevel = 'High Intensity Training';
    else if (formData.intensity > 50) pLevel = 'Moderate Activity';
    else if (formData.intensity > 0) pLevel = 'Active Recovery';

    // 4. Determine Target Threshold based on Hydration
    let tThreshold = 'Hydration Needed';
    if (formData.hydration >= 3.5) tThreshold = 'Optimal Hydration Met';
    else if (formData.hydration >= 2.5) tThreshold = 'Target Threshold Met';
    else if (formData.hydration >= 1.5) tThreshold = 'Baseline Reached';

    setFormData(prev => ({
      ...prev,
      dailyFuel: calculatedFuel,
      goalAchievement: goalStatus,
      performanceLevel: pLevel,
      targetThreshold: tThreshold
    }));
  }, [formData.protein, formData.carbs, formData.fats, formData.intensity, formData.hydration, formData.proteinGoal, formData.carbsGoal, formData.fatsGoal]);

  const fetchMetrics = async () => {
    try {
      const res = await metricsApi.getMetrics();
      if (res.data) {
        setFormData({
          livePulse: res.data.livePulse || 0,
          intensity: res.data.intensity || 0,
          dailyFuel: res.data.dailyFuel || 0,
          hydration: res.data.hydration || 0,
          performanceLevel: res.data.performanceLevel || '',
          targetThreshold: res.data.targetThreshold || '',
          goalAchievement: res.data.goalAchievement || '',
          protein: res.data.protein || 0,
          proteinGoal: res.data.proteinGoal || 210,
          carbs: res.data.carbs || 0,
          carbsGoal: res.data.carbsGoal || 320,
          fats: res.data.fats || 0,
          fatsGoal: res.data.fatsGoal || 85,
          sleepScore: res.data.sleepScore || 88
        });
      }
    } catch (error) {
      toast.error('Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Updating dashboard metrics...');
    try {
      await metricsApi.updateMetrics(formData);
      toast.success('Metrics updated successfully', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update metrics', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Dashboard Metrics</h1>
        <p className="text-muted-foreground">Manage the global performance indicators shown on the user dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Vital Signs</CardTitle>
              </div>
              <CardDescription>Live tracking indicators for the community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Pulse (BPM)</label>
                <Input 
                  type="number" 
                  value={formData.livePulse} 
                  onChange={(e) => setFormData({ ...formData, livePulse: parseInt(e.target.value) || 0 })}
                  className="font-mono text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Intensity (%)</label>
                <Input 
                  type="number" 
                  value={formData.intensity} 
                  onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) || 0 })}
                  className="font-mono text-lg"
                  max="100"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-lg">Daily Fuel</CardTitle>
              </div>
              <CardDescription>Nutrition and hydration targets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fuel Target (KCAL) <span className="text-[10px] text-primary italic">(Auto-calculated)</span></label>
                <Input 
                  type="number" 
                  value={formData.dailyFuel} 
                  readOnly
                  className="font-mono text-lg bg-accent/20 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Hydration (L)</label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={formData.hydration} 
                  onChange={(e) => setFormData({ ...formData, hydration: parseFloat(e.target.value) || 0 })}
                  className="font-mono text-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Macro Balance & Recovery</CardTitle>
            <CardDescription>Configure the target and current macro distribution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-500 uppercase">Protein (g)</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Current</label>
                  <Input type="number" value={formData.protein} onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Goal</label>
                  <Input type="number" value={formData.proteinGoal} onChange={(e) => setFormData({ ...formData, proteinGoal: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-green-500 uppercase">Carbohydrates (g)</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Current</label>
                  <Input type="number" value={formData.carbs} onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Goal</label>
                  <Input type="number" value={formData.carbsGoal} onChange={(e) => setFormData({ ...formData, carbsGoal: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-yellow-500 uppercase">Fats (g)</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Current</label>
                  <Input type="number" value={formData.fats} onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Goal</label>
                  <Input type="number" value={formData.fatsGoal} onChange={(e) => setFormData({ ...formData, fatsGoal: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="space-y-2 max-w-xs">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sleep Score (0-100)</label>
                <Input type="number" value={formData.sleepScore} onChange={(e) => setFormData({ ...formData, sleepScore: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Status Labels <span className="text-[10px] text-primary italic font-normal ml-2">(Auto-updating based on metrics)</span></CardTitle>
            <CardDescription>Textual status indicators shown across the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Performance Level</label>
                <Input 
                  value={formData.performanceLevel} 
                  readOnly
                  className="bg-accent/10 italic"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Threshold</label>
                <Input 
                  value={formData.targetThreshold} 
                  readOnly
                  className="bg-accent/10 italic"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Goal Status</label>
                <Input 
                  value={formData.goalAchievement} 
                  readOnly
                  className="bg-accent/10 italic font-bold text-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="rounded-full px-8 font-bold gap-2" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Dashboard Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminMetricsPage;
