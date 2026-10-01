import {
  DEFAULT_TRANSCRIPT_LANGUAGE,
  isTranscriptLanguage,
  loadTranscriptLanguagePreference,
  saveTranscriptLanguagePreference,
  TRANSCRIPT_LANGUAGE_ORDER,
  TRANSCRIPT_LANGUAGES,
} from "../lib/languages";

{
  if (DEFAULT_TRANSCRIPT_LANGUAGE !== "en") {
    throw new Error("expected default language to be en");
  }
  if (isTranscriptLanguage("auto")) throw new Error("did not expect auto to be valid");
  if (!isTranscriptLanguage("en")) throw new Error("expected en to be valid");
  if (!isTranscriptLanguage("es")) throw new Error("expected es to be valid");
  if (!isTranscriptLanguage("fr")) throw new Error("expected fr to be valid");
  if (!isTranscriptLanguage("de")) throw new Error("expected de to be valid");
  if (!isTranscriptLanguage("da")) throw new Error("expected da to be valid");
  if (!isTranscriptLanguage("pt")) throw new Error("expected pt to be valid");
  if (!isTranscriptLanguage("zh")) throw new Error("expected zh to be valid");
  if (isTranscriptLanguage("it")) throw new Error("did not expect it to be valid");
}
{
  const labels = TRANSCRIPT_LANGUAGE_ORDER.map(
    (id) => TRANSCRIPT_LANGUAGES[id].nativeLabel
  );
  if (labels.join(",") !== "English,Español,Français,Deutsch,Dansk,Português,中文") {
    throw new Error(`unexpected language order: ${labels.join(",")}`);
  }
}

{
  for (const id of TRANSCRIPT_LANGUAGE_ORDER) {
    const info = TRANSCRIPT_LANGUAGES[id];
    if (!info.flag) throw new Error(`expected flag for ${id}`);
    if (!info.code) throw new Error(`expected code for ${id}`);
    if (info.code !== id.toUpperCase()) {
      throw new Error(`unexpected code for ${id}: ${info.code}`);
    }
  }
}

{
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    },
  });
  try {
    saveTranscriptLanguagePreference("da");
    if (loadTranscriptLanguagePreference() !== "da") {
      throw new Error("expected Danish preference to survive a reload");
    }
    storage.set("rescript.transcript-language", "unknown");
    if (loadTranscriptLanguagePreference() !== DEFAULT_TRANSCRIPT_LANGUAGE) {
      throw new Error("expected invalid preference to fall back to default");
    }
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
}

console.log("ALL LANGUAGE TESTS PASSED");
