// ✅ ProjectModal.jsx с сохранённым UI и быстрым Re-generate
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProjectModal({ project, onClose }) {
  const navigate = useNavigate();
  if (!project) return null;

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

  const beforePath = pickStoragePath(
    project.original_url,
    project.before_path,
    project.before_storage_path,
    project.originalPath,
    project.beforePath
  );
  const afterPath = pickStoragePath(
    project.after_path,
    project.result_url,
    project.after_storage_path,
    project.resultPath,
    project.afterPath
  );

  const beforeUrl =
    project.original_signed_url ||
    project.before_url ||
    buildPublicUrl(beforePath);

  const publicAfterUrl =
    project.after_url ||
    project.result_signed_url ||
    buildPublicUrl(afterPath);

  const handleRegen = async () => {
    try {
      if (!afterPath) {
        alert("After image not found in project data.");
        return;
      }
  
      if (!publicAfterUrl) {
        alert("After image preview unavailable. Please try again later.");
        return;
      }
  
      console.log("♻️ [Modal] Re-generate →", {
        id: project.id, // 👈 добавлено
        publicAfterUrl,
        prompt: project.prompt,
      });
  
      // ✅ теперь передаём project.id → сохранится parent_id
      navigate("/transform", {
        state: {
          retransformImage: publicAfterUrl,
          retransformPrompt: project.prompt,
          retransformBeforePath: afterPath,
          retransformId: project.id, // 👈 добавлено
        },
      });
    } catch (err) {
      console.error("♻️ Re-generate modal error:", err);
      alert("Re-generate failed. Please try again.");
    }
  };


  // 🔽 Загрузка через fetch + blob (унифицировано с ProjectCard)
  const handleDownload = async () => {
    try {
      if (!publicAfterUrl) {
        alert("After image unavailable for download.");
        return;
      }
  
      const response = await fetch(publicAfterUrl);
      if (!response.ok) throw new Error("Network error while downloading.");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `after_${project.id || Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Download failed:", err);
      alert("Download failed. Please try again.");
    }
  };


  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="font-semibold text-lg mb-2 text-gray-800">Before</h2>
            <img
              src={beforeUrl}
              alt="Before"
              className="rounded-lg border shadow-md w-full object-contain"
            />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-lg mb-2 text-gray-800">After</h2>
            <img
              src={publicAfterUrl}
              alt="After"
              className="rounded-lg border shadow-md w-full object-contain"
            />
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
          <strong>Prompt:</strong>{" "}
          {project.prompt || "No description provided."}
        </div>

        <div className="mt-6 flex justify-between flex-wrap gap-3">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleDownload}>
              ⬇️ Download
            </Button>

            <Button onClick={handleRegen}>♻️ Re-generate</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



