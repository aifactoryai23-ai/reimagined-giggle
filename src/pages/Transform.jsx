import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { getSupabaseWithAuth } from "@/api/supabaseClient";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import UploadZone from "@/components/transform/UploadZone";
import ProcessingView from "@/components/transform/ProcessingView";
import ResultView from "@/components/transform/ResultView";
import SubscriptionPrompt from "@/components/transform/SubscriptionPrompt";
// добавили useAuth
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useAuth } from "@clerk/clerk-react";
// Supabase client + function for attaching Clerk token
import { supabase } from "@/api/supabaseClient";
import { useTranslation } from "react-i18next";

const PROMPT_BASE_RULES =
  "preserve geometry, realistic materials only, neutral color palette, design consistency within one space, real estate photography";

const PROMPTS = {
  renovation: `clean and minimal interior, freshly renovated, neutral colors, perfect walls and flooring, bright, ${PROMPT_BASE_RULES}`,
  staging: `virtually staged living room with modern minimalist furniture, neutral colors, bright and airy, ${PROMPT_BASE_RULES}`,
  declutter: `remove clutter, clean and organized interior, professional staging feel, ${PROMPT_BASE_RULES}`,
  repaint: `fresh painted walls, modern neutral tones, enhance interior quality, ${PROMPT_BASE_RULES}`,
  lighting: `bright natural lighting, well-balanced lighting setup, soft inviting atmosphere, ${PROMPT_BASE_RULES}`,
  floorRefresh: `renew flooring appearance, modern materials look, realistic textures, ${PROMPT_BASE_RULES}`,
  curb: `enhance house facade, landscaping upgrade, curb appeal improvement, clean pathways, ${PROMPT_BASE_RULES}`,
  styleSwitch: `change interior design style to modern neutral aesthetic, minimalist high-end look, ${PROMPT_BASE_RULES}`,
  furnishEmpty: `furnish empty room, modern furniture set, cozy and stylish for real estate listing, ${PROMPT_BASE_RULES}`,
  fixFinish: `improve finishing details, remove imperfections, polished and high-quality interior look, ${PROMPT_BASE_RULES}`,
  kitchen: `modern kitchen style, cleaner surfaces, stainless finishes, ${PROMPT_BASE_RULES}`,
  bathroom: `spa-like bathroom refresh, clean tiles and fixtures, improved lighting, ${PROMPT_BASE_RULES}`,
  backyard: `improve backyard landscaping, cozy staging furniture, fresh greenery, ${PROMPT_BASE_RULES}`,
};

export default function TransformPage() {
  const previewRef = useRef(null);
  const textareaRef = useRef(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation(["transform", "common"]);
  const heroTexts = t("hero", { ns: "transform", returnObjects: true }) || {};
  const statusTexts = t("status", { ns: "transform", returnObjects: true }) || {};
  const uploadTexts = t("upload", { ns: "transform", returnObjects: true }) || {};
  const builderTexts = t("builder", { ns: "transform", returnObjects: true }) || {};
  const optionsData = t("options", { ns: "transform", returnObjects: true }) || {};
  const formTexts = t("form", { ns: "transform", returnObjects: true }) || {};
  const errorMessages = t("errors", { ns: "transform", returnObjects: true }) || {};
  const toastTexts = t("toasts", { ns: "transform", returnObjects: true }) || {};
  const presetMapping = t("presetsMap", { ns: "transform", returnObjects: true }) || {};
  const presetsConfig = builderTexts.presets || {};
  // Локальное состояние пользователя для кредитов и подписки (как было)
  const [user, setUser] = useState({ subscription_status: "free", credits_remaining: 2 });
  // Аутентифицированный пользователь из Clerk (для clerkUser.id в Supabase путях и API)
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();

  const [stage, setStage] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [builderPrompt, setBuilderPrompt] = useState("");
  const [error, setError] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parentId, setParentId] = useState(null);

  // ре-генерации из галереи
  const location = useLocation();

  // ✅ Обрабатываем переход из галереи или модалки (Re-generate)
  useEffect(() => {
    if (location.state?.retransformImage) {
      console.log("🎯 [Transform] Re-transform detected:", location.state);
  
      // 1️⃣ Сохраняем id родителя, чтобы потом передать в /api/images/save
      setParentId(location.state.retransformId || null);
  
      // 2️⃣ Отображаем превью и промпт
      setImageUrl(location.state.retransformImage);
      setCustomPrompt(location.state.retransformPrompt || "");
  
      // 3️⃣ Нормализуем путь
      const rawPath = location.state.retransformBeforePath || "";
      const normalizedPath = rawPath; 
      // Добавляем userId, если путь не содержит его
      const fullSourcePath = normalizedPath.startsWith(clerkUser.id)
        ? normalizedPath
        : `${clerkUser.id}/${normalizedPath}`;
  
      console.log("📋 Preparing to copy:", fullSourcePath);
      
      // ⚙️ Копируем старый AFTER → новый BEFORE
      (async () => {
        try {
          if (!fullSourcePath || !clerkUser?.id) return;
      
          // 🔍 Проверим, существует ли исходный файл в Supabase перед копией
          const folder = fullSourcePath.split("/").slice(0, -1).join("/");
          const fileName = fullSourcePath.split("/").pop();
      
          const { data: existingFiles, error: listErr } = await supabase.storage
            .from("images")
            .list(folder || "", { limit: 100 });
      
          if (listErr) {
            console.error("❌ Error listing folder:", listErr);
          } else {
            const found = existingFiles?.some((f) => f.name === fileName);
            console.log(
              `🔍 Checking file "${fileName}" in folder "${folder}":`,
              found ? "✅ Found" : "❌ Not found"
            );
          }
      
          // 🆕 Если файл найден, копируем его под новым именем
          const newBeforeName = `before-copy-${Date.now()}.jpg`;
          const newBeforePath = `${clerkUser.id}/${newBeforeName}`;
      
          const { error: copyErr } = await supabase.storage
            .from("images")
            .copy(fullSourcePath, newBeforePath);
      
          if (copyErr) {
            console.error("⚠️ Failed to copy before:", copyErr.message);
            // fallback — используем оригинальный путь
            setBeforeStoragePath(fullSourcePath);
          } else {
            console.log("✅ Copied before image:", newBeforePath);
            setBeforeStoragePath(newBeforePath);
          }
        } catch (e) {
          console.error("❌ Copy before exception:", e);
          setBeforeStoragePath(fullSourcePath);
        } finally {
          setUploadSuccess(true);
          setStage("configure");
        }
      })();
    }
  }, [location.state, clerkUser?.id]);



  const [activeTab, setActiveTab] = useState("interior");

  // NEW: для результата и путей в Supabase
  const [project, setProject] = useState(null);
  const [beforeStoragePath, setBeforeStoragePath] = useState(null);

  // INTERIOR
  const [iRoom, setIRoom] = useState("");
  const [iStyle, setIStyle] = useState("");
  const [iColors, setIColors] = useState("");
  const [iFurniture, setIFurniture] = useState("");
  const [iLighting, setILighting] = useState("");
  const [iAtmosphere, setIAtmosphere] = useState("");
  const [iCondition, setICondition] = useState("");
  const [iCamera, setICamera] = useState("");
  const [iDetails, setIDetails] = useState([]);

  // EXTERIOR
  const [eHouse, setEHouse] = useState("");
  const [eFacade, setEFacade] = useState("");
  const [eEnv, setEEnv] = useState("");
  const [eSeason, setESeason] = useState("");
  const [eAtmosphere, setEAtmosphere] = useState("");
  const [eCamera, setECamera] = useState("");
  const [eCondition, setECondition] = useState("");
  const [eDetails, setEDetails] = useState([]);

  // 🔵 ADDED: грузим реальный профиль с сервера (через supabaseAdmin), не трогая существующую логику
  useEffect(() => {
    if (!clerkUser?.id) return;
    (async () => {
      try {
        const res = await fetch("/api/profile/get", {
          headers: { "x-user-id": clerkUser.id },
        });
        const json = await res.json();
        if (res.ok && json?.data) {
          setUser((prev) => ({
            ...prev,
            subscription_status: json.data.subscription_status ?? prev.subscription_status,
            credits_remaining: typeof json.data.credits_remaining === "number" ? json.data.credits_remaining : prev.credits_remaining,
            max_generations: typeof json.data.max_generations === "number" ? json.data.max_generations : prev.max_generations,
          }));
        } else {
          console.warn("Profile load failed:", json?.error || json);
        }
      } catch (e) {
        console.error("Profile load exception:", e);
      }
    })();
  }, [clerkUser?.id]);

  const getBase64FromUrl = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(blob);
    });
  };

  // Загрузка исходного изображения в Supabase Storage (BEFORE)
  const handleFileUpload = async (file) => {
    setImageUrl(URL.createObjectURL(file));
    setStage("configure");
    setError(null);

    // Требуем авторизацию для путей (подписанные пользователи)
    if (!clerkUser?.id) {
      setError(errorMessages.signInUpload || "Please sign in to upload images.");
      return;
    }

    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `before-${Date.now()}.${ext}`;

      // 🔹 Новый способ — pre-signed upload URL через API
      const res = await fetch(
        `/api/create-upload-url?userId=${encodeURIComponent(clerkUser.id)}&fileName=${encodeURIComponent(fileName)}`
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Failed to get upload URL: ${msg}`);
      }

      const { signedUrl, path } = await res.json();
      console.log("📤 Uploading directly to Supabase:", path);

      // 🔹 Отправляем файл напрямую в Supabase Storage
      const uploadResp = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });

      if (!uploadResp.ok) {
        throw new Error(`Upload failed with status ${uploadResp.status}`);
      }

      // 🔹 Сохраняем путь и публичную ссылку
      const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${clerkUser.id}/${fileName}`;
      console.log("✅ Uploaded successfully:", publicUrl);

      setBeforeStoragePath(`${clerkUser.id}/${fileName}`);
      setUploadSuccess(true);

    } catch (e) {
      console.error(e);
      setError(errorMessages.unexpectedUpload || "Unexpected error while uploading the image.");
      return;
    }

    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth" });
      textareaRef.current?.focus();
      setShowScrollHint(true);
    }, 200);
  };

  const handlePromptAppend = (text) => {
    setCustomPrompt((prev) => (prev ? prev + ", " + text : text));
  };

  useEffect(() => {
    const parts = [];

    if (activeTab === "interior") {
      if (iRoom) parts.push(`${iRoom} interior`);
      if (iStyle) parts.push(`${iStyle} style`);
      if (iColors) parts.push(`${iColors.toLowerCase()} palette`);
      if (iFurniture) parts.push(iFurniture);
      if (iLighting) parts.push(`${iLighting.toLowerCase()} lighting`);
      if (iAtmosphere) parts.push(iAtmosphere);
      if (iCondition) parts.push(iCondition);
      if (iCamera) parts.push(iCamera);
      if (iDetails.length) parts.push(iDetails.join(", "));
      if (parts.length > 0) parts.push(PROMPT_BASE_RULES);
    } else {
      if (eHouse) parts.push(`${eHouse} exterior`);
      if (eFacade) parts.push(`${eFacade} facade`);
      if (eEnv) parts.push(`in ${eEnv.toLowerCase()} environment`);
      if (eAtmosphere) parts.push(eAtmosphere);
      if (eSeason) parts.push(`${eSeason.toLowerCase()} setting`);
      if (eCamera) parts.push(eCamera);
      if (eCondition) parts.push(eCondition);
      if (eDetails.length) parts.push(eDetails.join(", "));
      if (parts.length > 0) parts.push(PROMPT_BASE_RULES);
    }

    setBuilderPrompt(parts.filter(Boolean).join(", "));
  }, [
    activeTab,
    iRoom, iStyle, iColors, iFurniture, iLighting,
    iAtmosphere, iCondition, iCamera, iDetails,
    eHouse, eFacade, eEnv, eSeason,
    eAtmosphere, eCamera, eCondition, eDetails
  ]);

  const buildFinalPrompt = () => {
    const a = customPrompt.trim();
    const b = builderPrompt.trim();
    if (a && b) return `${b}, ${a}`;
    if (b) return b;
    return a;
  };

  const hasUserInput = customPrompt.trim().length > 0;
  const hasBuilderInput = builderPrompt.trim().length > 10;
  const strongPrompt = hasUserInput || hasBuilderInput;

  const getButtonStyle = () => {
    if (!hasUserInput && !hasBuilderInput)
      return "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed";
    if (!strongPrompt)
      return "bg-blue-600 hover:bg-blue-700 text-white";
    return "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg";
  };

  // Генерация результата, загрузка AFTER и сохранение проекта
  const handleGenerate = async () => {
    const finalPrompt = buildFinalPrompt();
    if (!imageUrl)
      return setError(errorMessages.needImage || "Upload a photo before starting a transformation.");
    if (!finalPrompt)
      return setError(errorMessages.needPrompt || "Please add instructions or build a prompt.");

    if ((user?.credits_remaining || 0) <= 0 && user.subscription_status !== "premium") {
      setShowSubscriptionPrompt(true);
      return;
    }

    if (!clerkUser?.id) {
      setError(errorMessages.signInGenerate || "Please sign in to generate and save your project.");
      return;
    }
    if (!beforeStoragePath) {
      setError(errorMessages.missingOriginal || "Original image not uploaded. Please re-upload your photo.");
      return;
    }

    setStage("processing");
    setError(null);

    try {
    // 🔹 1. Отправляем исходник на API трансформации
    const res = await fetch("/api/transform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: finalPrompt,
        beforePath: beforeStoragePath, 
        parentId,                      
      }),
    });


      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Transform API error:", data);
        toast({
          title: toastTexts.failedTitle || "⚠️ Generation failed",
          description:
            data.message ||
            data.error ||
            toastTexts.failedDescription ||
            "Something went wrong while generating your image. Please adjust your prompt and try again.",
          variant: "destructive",
          duration: 8000,
        });
        setStage("configure");
        return;
      }

      if (!data.imageUrl) throw new Error("No output image returned.");

      // 🔹 2. Загружаем результат (after image) через pre-signed URL
      const outputResp = await fetch(data.imageUrl);
      const outputBlob = await outputResp.blob();
      const afterFileName = `after-${Date.now()}.jpg`;
      
      // 1️⃣ — получаем одноразовую ссылку от API
      const res2 = await fetch(
        `/api/create-upload-url?userId=${encodeURIComponent(clerkUser.id)}&fileName=${encodeURIComponent(afterFileName)}`
      );
      
      if (!res2.ok) {
        const msg = await res2.text();
        throw new Error(`Failed to get upload URL for after image: ${msg}`);
      }
      
      const { signedUrl: signedUrlAfter, path: afterPath } = await res2.json();
      console.log("📤 Uploading AFTER image to Supabase:", afterPath);
      
      // 2️⃣ — загружаем результат напрямую в Supabase
      const uploadAfterResp = await fetch(signedUrlAfter, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: outputBlob,
      });
      
      if (!uploadAfterResp.ok) {
        throw new Error(`After image upload failed: ${uploadAfterResp.status}`);
      }
      
      console.log("✅ After image uploaded successfully:", afterPath);


      // 🔹 3. Сохраняем проект в Supabase DB
      const saveResp = await fetch("/api/images/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": clerkUser.id,
        },
        body: JSON.stringify({
          beforePath: beforeStoragePath,
          afterPath,
          prompt: finalPrompt,
          parentId: location.state?.retransformId || null, 
        }),
      });

      let saveJson = null;
      if (!saveResp.ok) {
        console.error(await saveResp.text());
        throw new Error("Failed to save project.");
      } else {
        saveJson = await saveResp.json().catch(() => null);
      }

      // 🔹 4. Обновляем UI и кредиты
      setStage("result");
      setProject({
        original_image_url: imageUrl,
        staged_image_url: data.imageUrl,
        prompt: finalPrompt,
      });

      // локальное уменьшение кредита
      setUser((u) => ({
        ...u,
        credits_remaining: (u.credits_remaining || 0) - 1,
      }));

      // если API вернул точное значение — обновим
      if (saveJson && typeof saveJson.credits_remaining === "number") {
        setUser((u) => ({
          ...u,
          credits_remaining: saveJson.credits_remaining,
        }));
      }
    } catch (e) {
      console.error("❌ Generation error:", e);
      setStage("configure");
      toast({
        title: toastTexts.errorTitle || "❌ Generation Error",
        description:
          (e?.message && e.message !== "Failed to save project." ? e.message : null) ||
          toastTexts.errorDescription ||
          "Something went wrong while processing your image. Please try again later.",
        variant: "destructive",
        duration: 8000,
      });
      setError(null);
    }
  };

  const handleStartOver = () => {
    setStage("upload");
    setImageUrl("");
    setCustomPrompt("");
    setBuilderPrompt("");
    setBeforeStoragePath(null);
    setProject(null);
    setIRoom(""); setIStyle(""); setIColors(""); setIFurniture(""); setILighting(""); setIAtmosphere(""); setICondition(""); setICamera(""); setIDetails([]);
    setEHouse(""); setEFacade(""); setEEnv(""); setESeason(""); setEAtmosphere(""); setECamera(""); setECondition(""); setEDetails([]);
    setError(null);
  };

  const toggleInArray = (arr, value, setter) => {
    setter(arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value]);
  };

  const Select = ({ label, value, onChange, options }) => (
    <div>
      <Label className="text-sm text-gray-700">{label}</Label>
      <select
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{formTexts.notSpecified}</option>
        {options.map((op) => {
          const optionValue = typeof op === "string" ? op : op.value;
          const optionLabel = typeof op === "string" ? op : op.label;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );

  const CheckGroup = ({ label, values, setValues, options }) => (
    <div>
      <Label className="text-sm text-gray-700">{label}</Label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((op) => {
          const optionValue = typeof op === "string" ? op : op.value;
          const optionLabel = typeof op === "string" ? op : op.label;
          return (
            <label key={optionValue} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.includes(optionValue)}
                onChange={() => toggleInArray(values, optionValue, setValues)}
              />
              <span>{optionLabel}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  const interiorRooms = optionsData.interior?.rooms || [];
  const interiorStyles = optionsData.interior?.styles || [];
  const interiorColors = optionsData.interior?.colors || [];
  const furnitureOptions = optionsData.interior?.furniture || [];
  const interiorLighting = optionsData.interior?.lighting || [];
  const interiorDetails = optionsData.interior?.details || [];
  const atmosphereOptions = optionsData.shared?.atmosphere || [];
  const conditionOptions = optionsData.shared?.condition || [];
  const cameraOptions = optionsData.shared?.camera || [];

  const exteriorHouses = optionsData.exterior?.houses || [];
  const exteriorFacades = optionsData.exterior?.facades || [];
  const exteriorEnvs = optionsData.exterior?.environments || [];
  const exteriorSeasons = optionsData.exterior?.seasons || [];
  const exteriorDetails = optionsData.exterior?.details || [];

  const presetGroups = presetsConfig.groups || {};

  const handlePresetClick = (presetKey) => {
    const mappedKey = presetMapping[presetKey];
    const promptValue = PROMPTS[mappedKey];
    if (promptValue) {
      handlePromptAppend(promptValue);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen px-6 pb-12 pt-32">
          <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-600">
                {heroTexts.badge}
              </span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-4xl font-bold">
              {heroTexts.title}
            </h1>

            <p className="text-gray-600 mt-2 text-sm sm:text-lg">
              {heroTexts.subtitle}
            </p>

            {/* ✅ Добавлен счётчик кредитов */}
            {user && (
              <p className="text-blue-600 font-medium mt-2 text-sm sm:text-base">
                {t("status.credits", {
                  ns: "transform",
                  current: user.credits_remaining,
                  max: user.max_generations || 2,
                })}
              </p>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}
          
          {stage === "upload" && <UploadZone onFileUpload={handleFileUpload} />}
          
          {stage === "configure" && (
            <Card className="p-6 sm:p-8 mt-6">
              <h2 ref={previewRef} className="text-xl font-bold mb-4 flex items-center gap-2">
                {uploadTexts.title}
                {uploadSuccess && (
                  <span className="text-green-600 text-base font-medium">
                    ✅ {uploadTexts.success}
                  </span>
                )}
              </h2>
          
              <div className="flex justify-center mb-6">
                <img
                  src={imageUrl}
                  alt="preview"
                  className="w-full max-w-md h-52 sm:h-72 object-contain border rounded-lg"
                />
              </div>
          
              <div className="grid gap-10 md:grid-cols-2">


                  {/* LEFT SIDE */}
                  <div>
                    <Button variant="outline" className="w-full mb-4" onClick={handleStartOver}>
                      🔄 {uploadTexts.changePhoto || "Change Photo"}
                    </Button>

                    <Label className="font-semibold text-gray-700">
                      {uploadTexts.customLabel || "Add Custom Instructions (your text prompt)"}
                    </Label>
                    <Textarea
                      ref={textareaRef}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={builderPrompt ? 4 : 6}
                      className="min-h-[120px] sm:min-h-[160px]"
                      placeholder={
                        uploadTexts.customPlaceholder ||
                        "Write clear and realistic design requests. Focus on layout, lighting, materials and furniture. Avoid fantasy elements.\n\ne.g. Remove clutter, add warm light, replace furniture..."
                      }
                    />

                    {builderPrompt && (
                      <div className="mt-4">
                        <Label className="font-semibold text-gray-700">
                          {uploadTexts.suggestionsLabel || "Prompt Builder Suggestions (editable)"}
                        </Label>
                        <Textarea
                          rows={4}
                          value={builderPrompt}
                          onChange={(e) => setBuilderPrompt(e.target.value)}
                          className="min-h-[120px]"
                        />
                      </div>
                    )}

                    {/* CTA */}
                    <Button
                      id="generateBtnMain"
                      onClick={handleGenerate}
                      disabled={!strongPrompt}
                      className={`mt-4 w-full px-6 py-3 font-medium rounded-lg transition-all duration-500 ease-in-out ${getButtonStyle()}`}
                    >
                      {strongPrompt
                        ? uploadTexts.generateReady || "Ready to Generate"
                        : uploadTexts.generateDefault || "Generate with AI"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    {/* ✅ RESTORED ONE-CLICK TRANSFORMATIONS ✅ */}
                    <div className="mt-10">
                      <h3 className="text-lg font-semibold">
                        {presetsConfig.title || "One-Click Transformations"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {presetsConfig.description ||
                          "Select a template below to instantly give your photo a professional look."}
                      </p>
                    </div>

                    <div className="space-y-8 mt-6">
                      {Object.entries(presetGroups).map(([groupKey, group]) => (
                        <div key={groupKey}>
                          <h4 className="font-semibold mb-2">{group.title}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(group.buttons || {}).map(([buttonKey, button]) => (
                              <Button
                                key={buttonKey}
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-sm transition w-full"
                                onClick={() => handlePresetClick(buttonKey)}
                              >
                                <span className="sm:hidden">{button.short}</span>
                                <span className="hidden sm:inline">{button.long}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT SIDE — Prompt Builder */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{builderTexts.title || "Prompt Builder"}</h3>

                    <div className="mb-4 inline-flex rounded-lg border p-1">
                      <button
                        className={`px-3 py-1 text-sm rounded-md ${activeTab === "interior" ? "bg-blue-600 text-white" : "text-gray-700"}`}
                        onClick={() => setActiveTab("interior")}
                      >
                        {builderTexts.tabs?.interior || "Interior (Inside)"}
                      </button>
                      <button
                        className={`ml-1 px-3 py-1 text-sm rounded-md ${activeTab === "exterior" ? "bg-blue-600 text-white" : "text-gray-700"}`}
                        onClick={() => setActiveTab("exterior")}
                      >
                        {builderTexts.tabs?.exterior || "Exterior (Outside)"}
                      </button>
                    </div>

                    {activeTab === "interior" ? (
                      <div className="space-y-4">
                        <Select
                          label={builderTexts.fields?.roomType || "Room type"}
                          value={iRoom}
                          onChange={setIRoom}
                          options={interiorRooms}
                        />
                        <Select
                          label={builderTexts.fields?.style || "Style"}
                          value={iStyle}
                          onChange={setIStyle}
                          options={interiorStyles}
                        />
                        <Select
                          label={builderTexts.fields?.colorPalette || "Color palette"}
                          value={iColors}
                          onChange={setIColors}
                          options={interiorColors}
                        />
                        <Select
                          label={builderTexts.fields?.furnitureDensity || "Furniture density"}
                          value={iFurniture}
                          onChange={setIFurniture}
                          options={furnitureOptions}
                        />
                        <Select
                          label={builderTexts.fields?.lighting || "Lighting"}
                          value={iLighting}
                          onChange={setILighting}
                          options={interiorLighting}
                        />
                        <Select
                          label={builderTexts.fields?.atmosphere || "Atmosphere"}
                          value={iAtmosphere}
                          onChange={setIAtmosphere}
                          options={atmosphereOptions}
                        />
                        <Select
                          label={builderTexts.fields?.condition || "Condition"}
                          value={iCondition}
                          onChange={setICondition}
                          options={conditionOptions}
                        />
                        <Select
                          label={builderTexts.fields?.cameraAngle || "Camera angle"}
                          value={iCamera}
                          onChange={setICamera}
                          options={cameraOptions}
                        />
                        <CheckGroup
                          label={builderTexts.fields?.details || "Details"}
                          values={iDetails}
                          setValues={setIDetails}
                          options={interiorDetails}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Select
                          label={builderTexts.fields?.houseType || "House type"}
                          value={eHouse}
                          onChange={setEHouse}
                          options={exteriorHouses}
                        />
                        <Select
                          label={builderTexts.fields?.facade || "Facade"}
                          value={eFacade}
                          onChange={setEFacade}
                          options={exteriorFacades}
                        />
                        <Select
                          label={builderTexts.fields?.environment || "Environment"}
                          value={eEnv}
                          onChange={setEEnv}
                          options={exteriorEnvs}
                        />
                        <Select
                          label={builderTexts.fields?.season || "Season"}
                          value={eSeason}
                          onChange={setESeason}
                          options={exteriorSeasons}
                        />
                        <Select
                          label={builderTexts.fields?.atmosphere || "Atmosphere"}
                          value={eAtmosphere}
                          onChange={setEAtmosphere}
                          options={atmosphereOptions}
                        />
                        <Select
                          label={builderTexts.fields?.cameraAngle || "Camera angle"}
                          value={eCamera}
                          onChange={setECamera}
                          options={cameraOptions}
                        />
                        <Select
                          label={builderTexts.fields?.condition || "Condition"}
                          value={eCondition}
                          onChange={setECondition}
                          options={conditionOptions}
                        />
                        <CheckGroup
                          label={builderTexts.fields?.details || "Details"}
                          values={eDetails}
                          setValues={setEDetails}
                          options={exteriorDetails}
                        />
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      {builderTexts.helper ||
                        "Prompt Builder suggests staging details. You can still edit everything on the left."}
                    </p>
                  </div>

                </div>
              </Card>
            )}

            {stage === "processing" && <ProcessingView />}
            {stage === "result" && project && (
              <ResultView
                project={project}
                originalUrl={imageUrl}
                onStartOver={handleStartOver}
              />
            )}
          </div>

          {showSubscriptionPrompt && (
            <SubscriptionPrompt
              onClose={() => setShowSubscriptionPrompt(false)}
              onUpgrade={() => navigate(createPageUrl("Pricing"))}
            />
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}























