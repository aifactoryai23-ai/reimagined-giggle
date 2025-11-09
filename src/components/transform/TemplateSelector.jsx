import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAsync } from "@/hooks/useAsync";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Lock, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  userSubscription,
  isDisabled = false
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchTemplates = useCallback(() => base44.entities.Template.list(), []);
  const { data: templates = [], isLoading } = useAsync(fetchTemplates, [fetchTemplates], {
    initialData: []
  });

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "living_room", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "kitchen", label: "Kitchen" },
    { id: "office", label: "Office" },
    { id: "dining_room", label: "Dining Room" }
  ];

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold">Choose a Staging Template</h3>
        </div>
        <p className="text-gray-600 mb-2">
          Select a template below to instantly transform your photo.
        </p>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full aspect-[4/3]" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </Card>
            ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            No templates available in this category yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTemplates.map((template, index) => {
            const isLocked =
              template.is_premium && userSubscription !== "premium";
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <div
                key={template.id}
                className="transition-transform"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card
                  className={`group cursor-pointer overflow-hidden transition-all hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-blue-500"
                      : isLocked
                      ? "opacity-75"
                      : "hover:ring-1 hover:ring-gray-300"
                  }`}
                  onClick={() => !isLocked && onSelectTemplate(template)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={template.thumbnail_url}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Selection Check */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Premium Lock Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Style Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge
                        variant="secondary"
                        className="capitalize bg-white/90 backdrop-blur-sm"
                      >
                        {template.style}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200 mt-6">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">One-Click Transformation</p>
            <p>
              Each template is designed by interior design experts to showcase
              properties at their best. Select any template to instantly
              transform your photo.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
