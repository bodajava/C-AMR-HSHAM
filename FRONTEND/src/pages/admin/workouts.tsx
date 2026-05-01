import React, { useState, useEffect } from 'react';
import { workoutApi } from '@/lib/api-client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Video, List, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORIES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

interface SubExercise {
  name: string;
  videoUrl: string;
  sets: number;
  reps: string;
  notes: string;
}

const AdminWorkoutsPage = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    videoUrl: '',
    subExercises: [] as SubExercise[]
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await workoutApi.getAll();
      setWorkouts(res.data);
    } catch (error) {
      toast.error('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubExercise = () => {
    setFormData({
      ...formData,
      subExercises: [...formData.subExercises, { name: '', videoUrl: '', sets: 0, reps: '', notes: '' }]
    });
  };

  const handleRemoveSubExercise = (index: number) => {
    const subs = [...formData.subExercises];
    subs.splice(index, 1);
    setFormData({ ...formData, subExercises: subs });
  };

  const handleSubExerciseChange = (index: number, field: keyof SubExercise, value: any) => {
    const subs = [...formData.subExercises];
    subs[index] = { ...subs[index], [field]: value };
    setFormData({ ...formData, subExercises: subs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(isEditing ? 'Updating workout...' : 'Creating workout...');
    try {
      if (isEditing && currentId) {
        await workoutApi.update(currentId, formData);
        toast.success('Workout updated successfully', { id: toastId });
      } else {
        await workoutApi.create(formData);
        toast.success('Workout created successfully', { id: toastId });
      }
      setFormData({
        name: '',
        category: CATEGORIES[0],
        description: '',
        videoUrl: '',
        subExercises: []
      });
      setIsEditing(false);
      setCurrentId(null);
      fetchWorkouts();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (workout: any) => {
    setFormData({
      name: workout.name,
      category: workout.category,
      description: workout.description,
      videoUrl: workout.videoUrl || '',
      subExercises: workout.subExercises || []
    });
    setCurrentId(workout._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;
    const toastId = toast.loading('Deleting workout...');
    try {
      await workoutApi.delete(id);
      toast.success('Workout deleted successfully', { id: toastId });
      fetchWorkouts();
    } catch (error) {
      toast.error('Failed to delete workout', { id: toastId });
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workout Management</h1>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Workout' : 'Add New Workout'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workout Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chest Annihilation"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the workout goals..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Demo Video URL</label>
              <Input 
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="YouTube or hosted video link"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <List className="w-5 h-5 text-primary" />
                  Exercises
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSubExercise}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>

              {formData.subExercises.map((sub, index) => (
                <div key={index} className="p-4 border border-border/60 rounded-lg bg-accent/20 relative space-y-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                    onClick={() => handleRemoveSubExercise(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Exercise Name" 
                      value={sub.name}
                      onChange={(e) => handleSubExerciseChange(index, 'name', e.target.value)}
                      required
                    />
                    <Input 
                      placeholder="Video URL" 
                      value={sub.videoUrl}
                      onChange={(e) => handleSubExerciseChange(index, 'videoUrl', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        type="number" 
                        placeholder="Sets" 
                        value={sub.sets}
                        onChange={(e) => handleSubExerciseChange(index, 'sets', parseInt(e.target.value))}
                      />
                      <Input 
                        placeholder="Reps (e.g. 10-12)" 
                        value={sub.reps}
                        onChange={(e) => handleSubExerciseChange(index, 'reps', e.target.value)}
                      />
                    </div>
                    <Input 
                      placeholder="Optional Notes" 
                      value={sub.notes}
                      onChange={(e) => handleSubExerciseChange(index, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Workout' : 'Create Workout'
                )}
              </Button>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentId(null);
                    setFormData({ name: '', category: CATEGORIES[0], description: '', videoUrl: '', subExercises: [] });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(workouts) && workouts.length > 0 ? (
          workouts.map((workout) => (
            <Card key={workout._id} className="group overflow-hidden border-border/40 hover:border-primary/50 transition-all">
              <CardHeader className="bg-accent/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{workout.category}</span>
                    <CardTitle className="mt-1">{workout.name}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(workout)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(workout._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{workout.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <List className="w-3 h-3" />
                    {workout.subExercises?.length || 0} Exercises
                  </span>
                  {workout.videoUrl && (
                    <span className="flex items-center gap-1 text-primary">
                      <Video className="w-3 h-3" />
                      Video
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-accent/5 rounded-3xl border-2 border-dashed border-border">
            <p className="text-muted-foreground">No workouts found. Create your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkoutsPage;
