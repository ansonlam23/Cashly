import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, X, Target, AlertCircle, Heart, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

interface CreateGoalFormProps {
  onClose: () => void;
  templates: any[];
}

const GOAL_TYPES = [
  { value: "emergency", label: "Emergency Fund" },
  { value: "discretionary", label: "Discretionary Spending" },
  { value: "investment", label: "Investment" },
  { value: "laptop", label: "Laptop" },
  { value: "bike", label: "Bike" },
  { value: "travel", label: "Travel" },
  { value: "house", label: "House" },
  { value: "car", label: "Car" },
  { value: "education", label: "Education" },
  { value: "retirement", label: "Retirement" },
  { value: "general", label: "General" }
];

const CATEGORIES = [
  { value: "short_term", label: "Short-term (0-6 months)", color: "bg-green-500" },
  { value: "medium_term", label: "Medium-term (6 months - 2 years)", color: "bg-yellow-500" },
  { value: "long_term", label: "Long-term (2+ years)", color: "bg-blue-500" }
];

const PRIORITIES = [
  { value: "urgent", label: "Urgent", icon: AlertCircle, color: "bg-red-500" },
  { value: "fun", label: "Fun", icon: Heart, color: "bg-pink-500" },
  { value: "dream", label: "Dream", icon: Star, color: "bg-purple-500" }
];

export function CreateGoalForm({ onClose, templates }: CreateGoalFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    goalType: "",
    category: "",
    priority: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: new Date(),
    monthlyContribution: "",
    description: "",
    useTemplate: false,
    selectedTemplate: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createGoal = useMutation(api.goals.createGoal);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.goalType) {
      newErrors.goalType = "Goal type is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.targetAmount || isNaN(Number(formData.targetAmount)) || Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Target amount must be a positive number";
    }

    if (formData.currentAmount && (isNaN(Number(formData.currentAmount)) || Number(formData.currentAmount) < 0)) {
      newErrors.currentAmount = "Current amount must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let goalData = {
        title: formData.title,
        goalType: formData.goalType as any,
        category: formData.category as any,
        priority: formData.priority as any,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount) || 0,
        targetDate: format(formData.targetDate, "yyyy-MM-dd"),
        monthlyContribution: formData.monthlyContribution ? Number(formData.monthlyContribution) : undefined,
        description: formData.description,
      };

      // If using template, merge template data
      if (formData.useTemplate && formData.selectedTemplate) {
        const template = templates.find(t => t.title === formData.selectedTemplate);
        if (template) {
          goalData = {
            ...goalData,
            title: formData.title || template.title,
            goalType: template.goalType,
            category: template.category,
            priority: template.priority,
            targetAmount: Number(formData.targetAmount) || template.targetAmount,
            currentAmount: Number(formData.currentAmount) || 0,
            targetDate: format(formData.targetDate, "yyyy-MM-dd"),
            description: formData.description || template.description,
            monthlyContribution: formData.monthlyContribution ? Number(formData.monthlyContribution) : template.monthlyContribution,
            milestones: template.milestones || [],
          };
        }
      }

      console.log("Creating goal with data:", goalData);
      const result = await createGoal(goalData);
      console.log("Goal created successfully:", result);
      onClose();
    } catch (error) {
      console.error("Failed to create goal:", error);
      alert(`Failed to create goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTemplateSelect = (templateTitle: string) => {
    const template = templates.find(t => t.title === templateTitle);
    if (template) {
      setFormData(prev => ({
        ...prev,
        selectedTemplate: templateTitle,
        title: template.title,
        goalType: template.goalType,
        category: template.category,
        priority: template.priority,
        targetAmount: template.targetAmount.toString(),
        description: template.description,
        monthlyContribution: template.monthlyContribution?.toString() || "",
        useTemplate: true,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
              <Target className="h-5 w-5" />
              Create New Goal
            </CardTitle>
            <CardDescription className="text-[#888]">
              Set a new financial goal and start tracking your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-4">
                <Label className="text-[#f5f5f5]">Quick Start</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.slice(0, 4).map((template) => (
                    <div
                      key={template.title}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.selectedTemplate === template.title
                          ? 'border-[#00ff88] bg-[#00ff88]/10'
                          : 'border-[#333] hover:border-[#555]'
                      }`}
                      onClick={() => handleTemplateSelect(template.title)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${template.category === 'short_term' ? 'bg-green-500' : template.category === 'medium_term' ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}>
                          {template.category.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${template.priority === 'urgent' ? 'bg-red-500' : template.priority === 'fun' ? 'bg-pink-500' : 'bg-purple-500'} text-white`}>
                          {template.priority}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-[#f5f5f5] text-sm">{template.title}</h4>
                      <p className="text-xs text-[#888]">{template.description}</p>
                      <div className="text-sm font-bold text-[#00ff88]">
                        ${template.targetAmount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#f5f5f5]">
                    Goal Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Emergency Fund"
                    className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Goal Type */}
                <div className="space-y-2">
                  <Label htmlFor="goalType" className="text-[#f5f5f5]">
                    Goal Type *
                  </Label>
                  <Select value={formData.goalType} onValueChange={(value) => handleInputChange("goalType", value)}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#333]">
                      {GOAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-[#f5f5f5] hover:bg-[#333]">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.goalType && (
                    <p className="text-sm text-red-400">{errors.goalType}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-[#f5f5f5]">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#333]">
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value} className="text-[#f5f5f5] hover:bg-[#333]">
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-400">{errors.category}</p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-[#f5f5f5]">
                    Priority *
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#333]">
                      {PRIORITIES.map((priority) => {
                        const IconComponent = priority.icon;
                        return (
                          <SelectItem key={priority.value} value={priority.value} className="text-[#f5f5f5] hover:bg-[#333]">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {priority.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-sm text-red-400">{errors.priority}</p>
                  )}
                </div>

                {/* Target Amount */}
                <div className="space-y-2">
                  <Label htmlFor="targetAmount" className="text-[#f5f5f5]">
                    Target Amount *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888]">$</span>
                    <Input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      value={formData.targetAmount}
                      onChange={(e) => handleInputChange("targetAmount", e.target.value)}
                      placeholder="0.00"
                      className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5] pl-8"
                    />
                  </div>
                  {errors.targetAmount && (
                    <p className="text-sm text-red-400">{errors.targetAmount}</p>
                  )}
                </div>

                {/* Current Amount */}
                <div className="space-y-2">
                  <Label htmlFor="currentAmount" className="text-[#f5f5f5]">
                    Current Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888]">$</span>
                    <Input
                      id="currentAmount"
                      type="number"
                      step="0.01"
                      value={formData.currentAmount}
                      onChange={(e) => handleInputChange("currentAmount", e.target.value)}
                      placeholder="0.00"
                      className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5] pl-8"
                    />
                  </div>
                  {errors.currentAmount && (
                    <p className="text-sm text-red-400">{errors.currentAmount}</p>
                  )}
                </div>

                {/* Target Date */}
                <div className="space-y-2">
                  <Label className="text-[#f5f5f5]">Target Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-[#1a1a1a] border-[#333] text-[#f5f5f5] hover:bg-[#333]",
                          !formData.targetDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.targetDate ? format(formData.targetDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-[#333]" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.targetDate}
                        onSelect={(date) => date && handleInputChange("targetDate", date)}
                        initialFocus
                        className="bg-[#1a1a1a]"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Monthly Contribution */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution" className="text-[#f5f5f5]">
                    Monthly Contribution
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888]">$</span>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      step="0.01"
                      value={formData.monthlyContribution}
                      onChange={(e) => handleInputChange("monthlyContribution", e.target.value)}
                      placeholder="0.00"
                      className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5] pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#f5f5f5]">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your goal and why it's important to you..."
                  className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold"
                >
                  Create Goal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-[#333] text-[#f5f5f5] hover:bg-[#333]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
