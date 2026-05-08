import React, { useState, useEffect } from 'react';
import { workoutApi } from '@/api/workout';
import { EXERCISE_CATALOG } from '@/config/exercise-catalog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Video, List, X, Loader2, Camera, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORIES = Object.keys(EXERCISE_CATALOG).filter(k => k !== 'pack');

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
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    image: '',
    videoUrl: '',
    subExercises: [] as SubExercise[]
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await workoutApi.getAll();
      setWorkouts(res.data?.workouts || []);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading workout image...");
    try {
      const response = await workoutApi.getPresignedUrl({
        ContentType: file.type,
        originalname: file.name
      });

      const { url, Key } = response.data;

      await axios.put(url, file, {
        headers: { 'Content-Type': file.type }
      });

      setFormData(prev => ({ ...prev, image: Key }));
      toast.success("Image uploaded successfully!", { id: toastId });
      return Key; // Return the key so it can be used immediately if needed
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.", { id: toastId });
      return null;
    } finally {
      setIsUploading(false);
    }
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
        image: '',
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
      image: workout.image || '',
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

  const filteredExercises = EXERCISE_CATALOG[formData.category] || [];

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
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Upload Section */}
              <div className="w-full md:w-48 space-y-2">
                <label className="text-sm font-medium">Workout Image</label>
                <div className="relative group aspect-square rounded-xl border-2 border-dashed border-border/60 overflow-hidden bg-accent/5 flex items-center justify-center hover:border-primary/50 transition-colors">
                  {formData.image ? (
                    <>
                      <img
                        src={`${import.meta.env.VITE_API_URL}/upload/${formData.image}`}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs font-medium">Upload Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    accept="image/*"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, name: '' })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workout Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Select or type exercise name"
                    list="workout-names"
                    required
                  />
                  <datalist id="workout-names">
                    {filteredExercises.map(ex => <option key={ex} value={ex} />)}
                  </datalist>
                </div>
              </div>
            </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe the workout goals..."
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
                      <div className="space-y-2">
                        <Input
                          placeholder="Exercise Name"
                          value={sub.name}
                          onChange={(e) => handleSubExerciseChange(index, 'name', e.target.value)}
                          list={`sub-exercise-names-${index}`}
                          required
                        />
                        <datalist id={`sub-exercise-names-${index}`}>
                          {filteredExercises.map(ex => <option key={ex} value={ex} />)}
                        </datalist>
                      </div>
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
                <Button type="submit" className="flex-1" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading Image...
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
                      setFormData({ name: '', category: CATEGORIES[0], description: '', image: '', videoUrl: '', subExercises: [] });
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
              <div className="aspect-video w-full bg-accent/10 relative overflow-hidden">
                {workout.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/upload/${workout.image}`}
                    alt={workout.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white rounded-md border border-white/10">
                    {workout.category}
                  </span>
                </div>
              </div>
              <CardHeader className="p-4 pt-4">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-xl leading-tight">{workout.name}</CardTitle>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
