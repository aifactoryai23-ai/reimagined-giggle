export function cn(...inputs) {
  const classes = [];

  const process = (value) => {
    if (!value) {
      return;
    }

    if (typeof value === "string") {
      classes.push(value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(process);
      return;
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([key, condition]) => {
        if (condition) {
          classes.push(key);
        }
      });
    }
  };

  inputs.forEach(process);
  return classes.join(" ");
}

export function createPageUrl(name = "") {
  const raw = String(name || "").trim();
  if (!raw) {
    return "/";
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  const slug = raw.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
  if (!slug || slug === "home") {
    return "/";
  }

  return `/${slug}`;
}
