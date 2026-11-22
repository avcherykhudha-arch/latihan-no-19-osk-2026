import React from 'react';
import { Volume2, Pause, Play, Square, Gauge } from 'lucide-react';
import { MisterJoVoiceState } from '../hooks/useMisterJoTTS';

interface SpeakButtonProps {
  title: string;
  text: string;
  voice: MisterJoVoiceState;
  label?: string;
  compact?: boolean;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  title,
  text,
  voice,
  label = 'Dengarkan MISTER JO',
  compact = false,
}) => {
  const isCurrentActive = voice.activeTitle === title && voice.status !== 'idle';

  const handleClick = () => {
    if (isCurrentActive) {
      if (voice.status === 'speaking') {
        voice.pause();
      } else {
        voice.resume();
      }
    } else {
      voice.speak(title, text);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isCurrentActive && voice.status === 'speaking' ? `Jeda suara ${title}` : `Putar suara MISTER JO: ${title}`}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 cursor-pointer ${
        compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs'
      } ${
        isCurrentActive
          ? 'border-orange-600 bg-orange-600 text-white'
          : 'border-green-900/25 bg-white text-green-950 hover:border-orange-600 hover:text-orange-700'
      }`}
    >
      {isCurrentActive && voice.status === 'speaking' ? (
        <Pause className="w-3.5 h-3.5" aria-hidden="true" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
      )}
      <span>
        {isCurrentActive
          ? voice.status === 'speaking'
            ? 'Jeda Suara'
            : 'Lanjutkan'
          : label}
      </span>
    </button>
  );
};

interface MisterJoVoiceBarProps {
  voice: MisterJoVoiceState;
}

const SPEED_OPTIONS = [0.85, 1.0, 1.15, 1.3];

export const MisterJoVoiceBar: React.FC<MisterJoVoiceBarProps> = ({ voice }) => {
  if (voice.status === 'idle' && !voice.activeTitle) {
    return null;
  }

  return (
    <aside
      aria-label="Pemutar Narasi MISTER JO"
      className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[480px] z-40 rounded-xl border border-green-900 bg-white shadow-lg p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-green-900/75">
            <span className="font-semibold text-green-950 whitespace-nowrap shrink-0">MISTER JO</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{voice.activeTitle}</span>
          </div>
          <p className="mt-1 text-xs text-slate-700 line-clamp-2 leading-relaxed">
            {voice.spokenText}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {voice.status === 'speaking' ? (
            <button
              type="button"
              onClick={voice.pause}
              aria-label="Jeda narasi MISTER JO"
              className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer"
            >
              <Pause className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={voice.resume}
              aria-label="Lanjutkan narasi MISTER JO"
              className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={voice.stop}
            aria-label="Hentikan narasi MISTER JO"
            className="p-2 rounded-lg border border-green-900/25 text-green-950 hover:bg-green-50 transition-colors cursor-pointer"
          >
            <Square className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <div className="flex-1 h-1.5 bg-green-900/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-600 transition-all duration-150"
            style={{ width: `${voice.progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Gauge className="w-3.5 h-3.5 text-green-900/70" aria-hidden="true" />
          {SPEED_OPTIONS.map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => voice.setRate(spd)}
              aria-label={`Kecepatan suara ${spd} kali`}
              className={`px-1.5 py-0.5 text-[11px] font-mono-tabular rounded transition-colors cursor-pointer ${
                voice.rate === spd
                  ? 'bg-green-900 text-white font-semibold'
                  : 'text-green-900 hover:bg-green-900/10'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
