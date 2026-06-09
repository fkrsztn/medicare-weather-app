"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import type { City } from "@/types/weather";

type CitySearchModalProps = {
  isOpen: boolean;
  isRequired?: boolean;
  cities: City[];
  isLoading: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSearchCity: (query: string) => void;
  onSelectCity: (city: City) => void;
};

export function CitySearchModal({
  isOpen,
  isRequired = false,
  cities,
  isLoading,
  errorMessage,
  onClose,
  onSearchCity,
  onSelectCity,
}: CitySearchModalProps) {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    if (isRequired) {
      return;
    }

    onClose();
  }, [isRequired, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  function handleSearchValueChange(value: string) {
    setSearchValue(value);

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      onSearchCity(value);
    }, 350);
  }

  function handleSelectCity(city: City) {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    onSelectCity(city);
    setSearchValue("");
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className="fixed left-0 top-0 z-[99999] flex h-[100dvh] w-screen items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="city-search-title"
            className="relative z-[100000] w-full max-w-[460px] rounded-[28px] border border-white/50 bg-white/15 p-6 text-white shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="city-search-title"
                  className="text-[24px] font-light leading-none tracking-[-0.04em]"
                >
                  Város kiválasztása
                </h2>

                <p className="mt-3 text-[15px] font-light leading-snug text-white/70">
                  Keress rá egy városra, majd válaszd ki a listából.
                </p>
              </div>

              {!isRequired && (
                <button
                  type="button"
                  aria-label="Modal bezárása"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
                  onClick={handleClose}
                >
                  <X size={18} strokeWidth={1.8} />
                </button>
              )}
            </div>

            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                size={18}
                strokeWidth={1.8}
              />

              <input
                ref={inputRef}
                value={searchValue}
                onChange={(event) => handleSearchValueChange(event.target.value)}
                placeholder="Város neve"
                className="h-12 w-full rounded-2xl border border-white/40 bg-white/15 pl-11 pr-4 text-[16px] font-light text-white outline-none placeholder:text-white/50 focus:border-white/80"
              />
            </label>

            <div className="mt-5 max-h-[260px] overflow-y-auto pr-1">
              {isLoading ? (
                <p className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-[15px] font-light text-white/70">
                  Városok keresése...
                </p>
              ) : errorMessage ? (
                <p className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-[15px] font-light text-white/70">
                  {errorMessage}
                </p>
              ) : searchValue.trim().length === 0 ? (
                <p className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-[15px] font-light text-white/70">
                  Írd be a keresett város nevét.
                </p>
              ) : cities.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {cities.map((city) => (
                    <li key={city.id}>
                      <button
                        type="button"
                        className="w-full rounded-2xl px-4 py-3 text-left transition hover:bg-white/15"
                        onClick={() => handleSelectCity(city)}
                      >
                        <span className="block text-[17px] font-light leading-none text-white">
                          {city.name}
                        </span>

                        <span className="mt-2 block text-[14px] font-light leading-none text-white/60">
                          {[city.admin1, city.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-[15px] font-light text-white/70">
                  Nincs találat erre a keresésre.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}