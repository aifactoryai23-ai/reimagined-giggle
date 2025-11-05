// ✅ Полная версия твоего ProjectModal (4).jsx с сохранённым UI и быстрым Re-generate
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProjectModal({ project, onClose }) {
  const navigate = useNavigate();
  if (!project) return null;

  const beforeUrl =
    project.original_signed_url ||
    project.before_url ||
    project.original_url ||
    "";

  const afterPathRaw =
    project.after_path ||
    project.result_url ||
    project.after_url ||
    project.result_signed_url;
  
  const cleanAfterPath = (afterPathRaw || "").replace(/^images\//, "");
  const publicAfterUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${cleanAfterPath}`;

  const handleRegen = async () => {
    try {
      if (!cleanAfterPath) {

        alert("After image not found in project data.");
        return;
      }

      console.log("♻️ [Modal] Re-generate →", {
        publicAfterUrl,
        prompt: project.prompt,
      });

      navigate("/transform", {
        state: {
          retransformImage: publicAfterUrl,
          retransformPrompt: project.prompt,
          retransformBeforePath: cleanAfterPath,
        },
      });
    } catch (err) {
      console.error("♻️ Re-generate modal error:", err);
      alert("Re-generate failed. Please try again.");
    }
  };

  const handleDownload = async () => {
    try {
      const link = document.createElement("a");
      link.href = publicAfterUrl;
      link.download = `after_${project.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Download failed.");
      console.error(err);
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


