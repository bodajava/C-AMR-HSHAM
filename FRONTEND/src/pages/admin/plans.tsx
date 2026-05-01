import { useState, useEffect } from "react";
import { subscriptionApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
  priceId: string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
  });

  const fetchPlans = async () => {
    try {
      const response: any = await subscriptionApi.adminGetPlans();
      setPlans(response.data || []);
    } catch (error: any) {
      toast.error("Failed to fetch plans");
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const featuresArray = formData.features.split("\n").filter(f => f.trim() !== "");
    
    try {
      if (editingPlan) {
        await subscriptionApi.adminUpdatePlan(editingPlan._id, {
          ...formData,
          price: Number(formData.price),
          features: featuresArray,
        });
        toast.success("Plan updated successfully");
      } else {
        await subscriptionApi.adminCreatePlan({
          ...formData,
          price: Number(formData.price),
          features: featuresArray,
        });
        toast.success("Plan created successfully");
      }
      setIsDialogOpen(false);
      fetchPlans();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      features: plan.features.join("\n"),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this plan?")) return;
    try {
      await subscriptionApi.adminDeletePlan(id);
      toast.success("Plan deactivated");
      fetchPlans();
    } catch (error: any) {
      toast.error("Failed to deactivate plan");
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({ name: "", description: "", price: "", features: "" });
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage your subscription tiers and pricing.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="h-11 px-6">
              <Plus className="mr-2 h-5 w-5" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <Input 
                  placeholder="e.g. Pro Plan" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="What's included in this plan?" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (Monthly USD)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 29.99" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Features (One per line)</label>
                <Textarea 
                  placeholder="Feature 1\nFeature 2..." 
                  className="min-h-[120px]"
                  value={formData.features}
                  onChange={e => setFormData({...formData, features: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (editingPlan ? "Update Plan" : "Create Plan")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(plans) && plans.length > 0 ? (
            plans.map((plan) => (
              <div 
                key={plan._id}
                className={cn(
                  "relative group flex flex-col p-6 rounded-2xl border transition-all duration-300",
                  plan.isActive ? "bg-background border-border hover:border-primary/50 shadow-sm" : "bg-muted/50 border-transparent opacity-60"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    plan.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {plan.isActive ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                      <Edit3 size={20} />
                    </Button>
                    {plan.isActive && (
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(plan._id)}>
                        <Trash2 size={20} />
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-2xl font-black text-primary mb-4">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{plan.description}</p>
                
                <div className="space-y-3 mt-auto">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Included Features</p>
                  {plan.features?.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm gap-2">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.features?.length > 4 && (
                    <p className="text-xs text-muted-foreground">+{plan.features.length - 4} more features</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground">No plans found. Create your first plan above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
