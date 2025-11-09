// ✅ ProjectCard.jsx с исправленным Re-generate (parent_id передаётся корректно)
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, index, onViewDetails }) {
  const navigate = useNavigate();

  const pickStoragePath = (...candidates) => {
    for (const candidate of candidates) {
      if (typeof candidate !== "string") continue;
      const trimmed = candidate.trim();
      if (!trimmed) continue;
      if (/^https?:\/\//i.test(trimmed)) continue;
      return trimmed.replace(/^images\//, "");
    }
    return "";
  };

  const buildPublicUrl = (path) =>
    path
      ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${path}`
      : "";

  const normalizedAfterPath = pickStoragePath(
    project.after_path,
    project.result_url,
    project.after_storage_path,
    project.resultPath,
    project.afterPath,
    project.result_path
  );

  const previewUrl =
    project.after_url ||
    project.result_signed_url ||
    buildPublicUrl(normalizedAfterPath);

  // 🧩 Исправленный обработчик Re-generate
  const handleRegenerate = (e) => {
    e.stopPropagation();
    try {
      if (!normalizedAfterPath) {
        alert("After image not found in project data.");
        return;
      }

      const retransformPreview =
        previewUrl || buildPublicUrl(normalizedAfterPath);

      if (!retransformPreview) {
        alert("After image preview unavailable. Please try again later.");
        return;
      }

      console.log("♻️ [Card] Re-generate →", {
        id: project.id, // 👈 добавлено для отладки
        retransformPreview,
        prompt: project.prompt,
      });

      // 3️⃣ Переходим сразу в Transform
      navigate("/transform", {
        state: {
          retransformImage: retransformPreview,
          retransformPrompt: project.prompt,
          retransformBeforePath: normalizedAfterPath,
          retransformId: project.id, // 👈 исправлено
        },
      });
    } catch (err) {
      console.error("♻️ Re-generate card error:", err);
      alert("Re-generate failed. Please try again.");
    }
  };

  return (
    <div
      className="transition-transform duration-300"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Card
        className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
        onClick={onViewDetails}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={previewUrl}
            alt={project.name || "Generated project"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-gray-900" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold truncate">
              {project.name || "AI Transformation"}
            </h3>
            {project.style && (
              <Badge variant="secondary" className="capitalize">
                {project.style}
              </Badge>
            )}
          </div>

          {project.created_at && (
            <p className="text-sm text-gray-600">
              {format(new Date(project.created_at), "MMM d, yyyy")}
            </p>
          )}

          {/* ♻️ Re-generate */}
          <Button onClick={handleRegenerate}>♻️ Re-generate</Button>
        </div>
      </Card>
    </div>
  );
}
