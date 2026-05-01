import React, { useState, useEffect } from 'react';
import { mealApi } from '@/lib/api-client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Camera, Clock, Flame, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

const AdminMealsPage = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    ingredients: [] as string[],
    instructions: [] as string[],
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    prepTime: '',
    image: '',
    videoUrl: ''
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await mealApi.getAll();
      setMeals(res.data);
    } catch (error) {
      toast.error('Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setIsUploading(true);
    const toastId = toast.loading('Uploading image...');
    try {
      const response = await mealApi.getPresignedUrl({
        ContentType: file.type,
        originalname: file.name
      });

      const { url, Key } = response.data;

      await axios.put(url, file, {
        headers: { 'Content-Type': file.type }
      });

      setFormData({ ...formData, image: Key });
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', { id: toastId });
      setPreviewUrl(null); // Reset on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    setFormData({ ...formData, ingredients: [...formData.ingredients, newIngredient.trim()] });
    setNewIngredient('');
  };

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setFormData({ ...formData, instructions: [...formData.instructions, newInstruction.trim()] });
    setNewInstruction('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(isEditing ? 'Updating meal...' : 'Creating meal...');
    try {
      if (isEditing && currentId) {
        await mealApi.update(currentId, formData);
        toast.success('Meal updated successfully', { id: toastId });
      } else {
        await mealApi.create(formData);
        toast.success('Meal created successfully', { id: toastId });
      }
      resetForm();
      fetchMeals();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      ingredients: [],
      instructions: [],
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      prepTime: '',
      image: '',
      videoUrl: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleEdit = (meal: any) => {
    setFormData({
      name: meal.name,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions || [],
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      prepTime: meal.prepTime,
      image: meal.image || '',
      videoUrl: meal.videoUrl || ''
    });
    setCurrentId(meal._id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Meal Management</h1>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Meal' : 'Add New Meal'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Grilled Salmon Salad"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preparation Time</label>
                <Input 
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  placeholder="e.g. 20-30 mins"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Calories</label>
                <Input type="number" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Protein (g)</label>
                <Input type="number" value={formData.protein} onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Carbs (g)</label>
                <Input type="number" value={formData.carbs} onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fats (g)</label>
                <Input type="number" value={formData.fats} onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) })} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Ingredients</label>
                <div className="flex gap-2">
                  <Input value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} placeholder="Add ingredient..." />
                  <Button type="button" size="sm" onClick={handleAddIngredient}><Plus className="w-4 h-4" /></Button>
                </div>
                <ul className="space-y-2">
                  {formData.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between items-center text-sm p-2 bg-accent/20 rounded-md">
                      {ing}
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => {
                        const ings = [...formData.ingredients];
                        ings.splice(i, 1);
                        setFormData({ ...formData, ingredients: ings });
                      }}><X className="w-3 h-3" /></Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Preparation Steps (Instructions)</label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      const bulk = formData.instructions.join("\n");
                      const newBulk = prompt("Paste all steps (one per line):", bulk);
                      if (newBulk !== null) {
                        setFormData({ 
                          ...formData, 
                          instructions: newBulk.split("\n").filter(s => s.trim() !== "") 
                        });
                      }
                    }}
                    className="text-xs text-primary"
                  >
                    Bulk Edit
                  </Button>
                </div>
                <div className="flex flex-col gap-2 p-4 border-2 border-primary/20 rounded-xl bg-primary/5 shadow-inner">
                  <textarea 
                    className="w-full min-h-[120px] p-4 rounded-lg bg-background border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base resize-none transition-all placeholder:text-muted-foreground/50"
                    value={newInstruction} 
                    onChange={(e) => setNewInstruction(e.target.value)} 
                    placeholder="Step detail: e.g. Chop the onions finely and sauté until golden brown..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddInstruction();
                      }
                    }}
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">Shift + Enter for new line • Enter to save step</span>
                    <Button type="button" size="sm" onClick={handleAddInstruction} className="gap-2 px-4 shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
                      <Plus className="w-4 h-4" /> Add Step
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {formData.instructions.length > 0 ? (
                    <ol className="space-y-2 list-none">
                      {formData.instructions.map((inst, i) => (
                        <li key={i} className="group relative flex gap-4 p-3 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors border border-transparent hover:border-border">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          <div className="flex-1 text-sm leading-relaxed pr-8">
                            <input 
                              className="w-full bg-transparent outline-none"
                              value={inst}
                              onChange={(e) => {
                                const insts = [...formData.instructions];
                                insts[i] = e.target.value;
                                setFormData({ ...formData, instructions: insts });
                              }}
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 top-1 h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => {
                              const insts = [...formData.instructions];
                              insts.splice(i, 1);
                              setFormData({ ...formData, instructions: insts });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                      No steps added yet. Add your first step above.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg bg-accent/20 flex items-center justify-center overflow-hidden border">
                    {previewUrl || formData.image ? (
                      <img 
                        src={previewUrl || `${import.meta.env.VITE_API_URL}/upload/${formData.image}`} 
                        className="h-full w-full object-cover" 
                        onLoad={() => {
                          // Optional: if it was a blob URL, we could revoke it after the real one loads
                        }}
                      />
                    ) : (
                      <Camera className="text-muted-foreground" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <div className="p-2 border rounded-md hover:bg-accent transition-colors text-sm font-medium">
                      {isUploading ? 'Uploading...' : 'Choose Image'}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipe Video URL</label>
                <Input value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="Optional video link" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Meal' : 'Create Meal'
                )}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(meals) && meals.length > 0 ? (
          meals.map((meal) => (
            <Card key={meal._id} className="overflow-hidden border-border/40 hover:border-primary/50 transition-all">
              <div className="aspect-video relative overflow-hidden bg-accent/20">
                {meal.image ? (
                  <img src={`${import.meta.env.VITE_API_URL}/upload/${meal.image}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Flame className="w-12 h-12 text-muted-foreground/20" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleEdit(meal)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={async () => {
                    if (confirm('Delete this meal?')) {
                      const toastId = toast.loading('Deleting meal...');
                      try {
                        await mealApi.delete(meal._id);
                        toast.success('Meal deleted successfully', { id: toastId });
                        fetchMeals();
                      } catch (error) {
                        toast.error('Failed to delete meal', { id: toastId });
                      }
                    }
                  }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <CardContent className="pt-4">
                <CardTitle className="mb-2">{meal.name}</CardTitle>
                <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meal.prepTime}</div>
                  <div className="flex items-center gap-1"><Flame className="w-3 h-3" /> {meal.calories} kcal</div>
                  <div className="flex items-center gap-1 font-bold text-primary">P: {meal.protein}g</div>
                  <div className="flex items-center gap-1 font-bold text-orange-500">C: {meal.carbs}g</div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-accent/5 rounded-3xl border-2 border-dashed border-border">
            <p className="text-muted-foreground">No meals found. Create your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMealsPage;
