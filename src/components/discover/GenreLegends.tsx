"use client";

import React from "react";
import { Play } from "lucide-react";
import { ROCK_LEGENDS, type RockGenreDestination } from "@/data/rockTvData";
import { useLocale } from "@/context/LocaleContext";
import { useMedia } from "@/context/MediaContext";
import { youtubeThumb } from "@/lib/site";

/** The genre's legends, each opening its verified music videos in the gallery. */
export function GenreLegends({ genre }: { genre: RockGenreDestination }) {
  const { dict } = useLocale();
  const t = dict.discover;
  const { openVideo } = useMedia();
  const legends = genre.legendIds
    .map((id) => ROCK_LEGENDS.find((legend) => legend.id === id))
    .filter((legend) => legend !== undefined);
  if (legends.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-condensed text-sm font-bold uppercase tracking-wider text-chalk">{t.onRockTv}</h4>
        <span className="font-mono text-[10px] text-ash tabular-data">{t.onRockTvLead}</span>
      </div>
      <ul className="mt-2.5 grid grid-cols-1 gap-1.5">
        {legends.map((legend) => (
          <li key={legend.id}>
            <button
              type="button"
              onClick={() => openVideo(legend.id, 0)}
              aria-haspopup="dialog"
              className="glass-press group flex w-full items-center gap-3 rounded-glass-xs bg-white/[0.05] p-1.5 pr-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-white/[0.09]"
            >
              <span className="relative h-10 w-16 shrink-0 overflow-hidden rounded-[10px] bg-void">
                <img
                  src={youtubeThumb(legend.videos[0].youtubeId, "mq")}
                  alt=""
                  loading="lazy"
                  width={320}
                  height={180}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-3.5 w-3.5 fill-current text-chalk" aria-hidden="true" />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate font-condensed text-sm font-bold uppercase tracking-wide text-chalk">
                  {legend.name}
                </span>
                <span className="block font-mono text-[11px] text-bone tabular-data">
                  {dict.legends.videosCount(legend.videos.length)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
