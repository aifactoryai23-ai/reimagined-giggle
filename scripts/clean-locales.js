import fs from "fs";
import path from "path";

// 🔧 Папка, где лежат твои переводы (измени путь при необходимости)
const LOCALES_DIR = path.resolve("src/locales");

// Рекурсивная функция для поиска JSON-файлов
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".json")) {
      cleanJSON(fullPath);
    }
  }
}

// Функция очистки
function cleanJSON(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Удаляем лишние символы перевода строк и спец-символы
    const cleaned = content
      .replace(/\r/g, "") // CR
      .replace(/\u2028|\u2029/g, "") // Line & Paragraph separators
      .replace(/LF/g, "") // буквальные “LF”
      .replace(/\n\s*\n/g, "\n"); // двойные пустые строки

    // Проверяем, что это валидный JSON
    JSON.parse(cleaned);

    fs.writeFileSync(filePath, cleaned, "utf8");
    console.log("✅ Cleaned:", filePath);
  } catch (err) {
    console.error("❌ Error in:", filePath, err.message);
  }
}

console.log("🧩 Cleaning locale JSON files...");
walk(LOCALES_DIR);
console.log("✨ Done!");
