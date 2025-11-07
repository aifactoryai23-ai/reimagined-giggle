import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import "@/styles/highlight.css";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import ProjectModal from "@/components/gallery/ProjectModal";

export default function GalleryPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ==============================
  // 📦 Загрузка проектов из Supabase
  // ==============================
  useEffect(() => {
    if (!user?.id) return;

    const loadGallery = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/images/list`, {
          headers: { "x-user-id": user.id },
        });

        const rawPayload = await res.text();
        let parsed;
        try {
          parsed = rawPayload ? JSON.parse(rawPayload) : null;
        } catch (parseErr) {
          console.error("⚠️ Could not parse gallery payload:", parseErr, rawPayload);
          parsed = null;
        }

        if (!res.ok) {
          const message = parsed?.error || `Failed to load gallery (${res.status})`;
          throw new Error(message);
        }

        const rows = Array.isArray(parsed?.data) ? parsed.data : [];

        const withSignedUrls = await Promise.all(
          rows.map(async (row) => {
            const originalPath = row.original_url || row.before_path || row.beforeUrl || "";
            const resultPath = row.result_url || row.after_path || row.afterUrl || "";

            if (row.before_url && row.after_url) {
              return {
                ...row,
                original_signed_url: row.before_url,
                result_signed_url: row.after_url,
              };
            }

            let signedOriginal = null;
            let signedResult = null;

            try {
              if (originalPath) {
                const { data: o } = await supabase
                  .storage
                  .from("images")
                  .createSignedUrl(originalPath, 60 * 60);
                signedOriginal = o?.signedUrl || null;
              }
            } catch (e) {
              console.warn("⚠️ Could not sign original:", e);
            }

            try {
              if (resultPath) {
                const { data: r } = await supabase
                  .storage
                  .from("images")
                  .createSignedUrl(resultPath, 60 * 60);
                signedResult = r?.signedUrl || null;
              }
            } catch (e) {
              console.warn("⚠️ Could not sign result:", e);
            }

            return {
              ...row,
              original_signed_url: signedOriginal,
              result_signed_url: signedResult,
            };
          })
        );

        setItems(withSignedUrls);
      } catch (err) {
        console.error("❌ Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [user?.id]);

  // ==============================
  // 🗑️ Удаление проекта
  // ==============================
  const handleDelete = async (id) => {
    if (!confirm("Delete this project permanently?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/images/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete project");

      setItems((prev) => prev.filter((x) => x.id !== id));
      console.log(`✅ Project ${id} deleted`);
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // 🧩 Карточка проекта
  // ==============================
  const ProjectCard = ({ item }) => {
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
      item.result_url,
      item.after_path,
      item.after_storage_path,
      item.resultPath,
      item.afterPath,
      item.afterUrl
    );
    const normalizedBeforePath = pickStoragePath(
      item.original_url,
      item.before_path,
      item.before_storage_path,
      item.originalPath,
      item.beforePath,
      item.beforeUrl
    );

    const afterPreviewUrl =
      item.result_signed_url ||
      item.after_url ||
      buildPublicUrl(normalizedAfterPath);

    const beforePreviewUrl =
      item.original_signed_url ||
      item.before_url ||
      buildPublicUrl(normalizedBeforePath);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
      >
        <Card
          key={item.id}
          className="overflow-hidden shadow-md hover:shadow-xl transition relative cursor-pointer"
          onClick={() => setSelected(item)}
        >
          <CardContent className="p-0 relative">
            {/* BEFORE */}
            <div className="aspect-[4/3] border-b">
              <img
                src={beforePreviewUrl}
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>

            {/* AFTER */}
            <div className="aspect-[4/3]">
              <img
                src={afterPreviewUrl}
                alt="After"
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="p-4 relative">
              <p className="text-sm text-gray-700 line-clamp-2">
                {item.prompt || "No prompt provided"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : ""}
              </p>

              {/* 🗑️ Delete */}
              <Button
                variant="destructive"
                size="sm"
                disabled={deletingId === item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {/* ⬇️ Download */}
              <Button
                variant="secondary"
                size="sm"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!afterPreviewUrl) {
                    alert("After image unavailable for download.");
                    return;
                  }
                  try {
                    const response = await fetch(afterPreviewUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `interior_after_${item.id || Date.now()}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("❌ Download failed:", err);
                    alert("Download failed. Please try again.");
                  }
                }}
                className="absolute bottom-2 left-2"
              >
                ⬇️ Download
              </Button>

              {/* ♻️ Re-generate */}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();

                  if (!normalizedAfterPath) {
                    alert("After image path not found for this project.");
                    return;
                  }

                  const previewUrl =
                    afterPreviewUrl || buildPublicUrl(normalizedAfterPath);

                  if (!previewUrl) {
                    alert("After image preview unavailable. Please try again later.");
                    return;
                  }

                  navigate("/transform", {
                    state: {
                      retransformImage: previewUrl,
                      retransformPrompt: item.prompt,
                      retransformBeforePath: normalizedAfterPath,
                    },
                  });
                }}
                className="absolute bottom-2 right-2"
              >
                ♻️ Re-generate
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ==============================
  // ⚙️ Рендер страницы
  // ==============================
  return (
    <>
      <SignedIn>
        <div className="min-h-screen px-6 pb-20 pt-32 bg-gradient-to-b from-white via-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl text-center">
            {/* HEADER */}
            <div className="mb-16">
              <p className="text-blue-600 font-medium uppercase tracking-wide">// Gallery</p>
              <h1 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">
                Your Gallery
              </h1>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Browse your previously generated before/after results.
                <br />
                <mark className="mark-animated">
                  Re-stage your photos with a new AI prompt — anytime, directly from your gallery.
                </mark>
              </p>

              <Button
                onClick={() => navigate("/transform")}
                className="mt-8 px-8 py-4 text-lg rounded-xl"
              >
                <ImageIcon className="mr-3 h-5 w-5" />
                New transformation
              </Button>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && items.length === 0 && (
              <div className="text-center text-gray-500 mt-32">
                <p className="text-lg">No generated images yet.</p>
                <p className="text-sm mt-1">
                  Start by creating your first transformation.
                </p>
              </div>
            )}

            {/* Gallery grid */}
            {!loading && items.length > 0 && (
              <motion.div
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate={mounted ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.1, duration: 0.6 },
                  },
                }}
              >
                {items.map((item) => (
                  <ProjectCard key={item.id} item={item} />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Modal */}
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
