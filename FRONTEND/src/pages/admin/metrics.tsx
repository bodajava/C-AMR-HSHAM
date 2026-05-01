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
                  onChange={(e) => setFormData({ ...formData, livePulse: parseInt(e.target.value) })}
                  className="font-mono text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Intensity (%)</label>
                <Input 
                  type="number" 
                  value={formData.intensity} 
                  onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
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
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fuel Target (KCAL)</label>
                <Input 
                  type="number" 
                  value={formData.dailyFuel} 
                  onChange={(e) => setFormData({ ...formData, dailyFuel: parseInt(e.target.value) })}
                  className="font-mono text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Hydration (L)</label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={formData.hydration} 
                  onChange={(e) => setFormData({ ...formData, hydration: parseFloat(e.target.value) })}
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
                  <Input type="number" value={formData.protein} onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Goal</label>
                  <Input type="number" value={formData.proteinGoal} onChange={(e) => setFormData({ ...formData, proteinGoal: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-green-500 uppercase">Carbohydrates (g)</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Current</label>
                  <Input type="number" value={formData.carbs} onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Goal</label>
                  <Input type="number" value={formData.carbsGoal} onChange={(e) => setFormData({ ...formData, carbsGoal: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-yellow-500 uppercase">Fats (g)</h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Current</label>
                  <Input type="number" value={formData.fats} onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Goal</label>
                  <Input type="number" value={formData.fatsGoal} onChange={(e) => setFormData({ ...formData, fatsGoal: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="space-y-2 max-w-xs">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sleep Score (0-100)</label>
                <Input type="number" value={formData.sleepScore} onChange={(e) => setFormData({ ...formData, sleepScore: parseInt(e.target.value) })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Status Labels</CardTitle>
            <CardDescription>Textual status indicators shown across the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Performance Level</label>
                <Input 
                  value={formData.performanceLevel} 
                  onChange={(e) => setFormData({ ...formData, performanceLevel: e.target.value })}
                  placeholder="e.g. Elite Performance Level"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Threshold</label>
                <Input 
                  value={formData.targetThreshold} 
                  onChange={(e) => setFormData({ ...formData, targetThreshold: e.target.value })}
                  placeholder="e.g. Target Threshold Met"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Goal Status</label>
                <Input 
                  value={formData.goalAchievement} 
                  onChange={(e) => setFormData({ ...formData, goalAchievement: e.target.value })}
                  placeholder="e.g. Goal: 100% Achieved"
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
