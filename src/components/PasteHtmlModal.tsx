import React, { useState, useEffect } from 'react';
import { parseFortniteGGSpritesHtml } from '../utils/parser';
import { UserProfile } from '../types';
import { X, FileCode, Check, AlertCircle, Upload, HelpCircle } from 'lucide-react';

interface PasteHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportUserA: (profile: UserProfile) => void;
  onImportUserB: (profile: UserProfile) => void;
  initialSlot?: 'A' | 'B';
}

export const PasteHtmlModal: React.FC<PasteHtmlModalProps> = ({
  isOpen,
  onClose,
  onImportUserA,
  onImportUserB,
  initialSlot = 'A',
}) => {
  const [targetSlot, setTargetSlot] = useState<'A' | 'B'>(initialSlot);
  const [rawHtml, setRawHtml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTargetSlot(initialSlot);
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialSlot]);

  if (!isOpen) return null;

  const handleParseAndApply = (contentToParse?: string) => {
    setError(null);
    setSuccessMessage(null);

    const html = contentToParse ?? rawHtml;

    if (!html.trim()) {
      setError('Please paste HTML content or drop an HTML file into the box.');
      return;
    }

    try {
      const profile = parseFortniteGGSpritesHtml(html, `import-${targetSlot}`);
      if (profile.sprites.length === 0) {
        setError('No sprites could be extracted from this HTML. Ensure you copied the source of a fortnite.gg/sprites page.');
        return;
      }

      if (targetSlot === 'A') {
        onImportUserA(profile);
      } else {
        onImportUserB(profile);
      }

      setSuccessMessage(`Successfully imported ${profile.username} with ${profile.sprites.length} sprites!`);
      setTimeout(() => {
        onClose();
        setRawHtml('');
        setSuccessMessage(null);
      }, 750);
    } catch (err: any) {
      setError(err.message || 'Failed to parse HTML.');
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setRawHtml(text);
        handleParseAndApply(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Import Fortnite.GG HTML Source</h3>
              <p className="text-xs text-zinc-400">Import your owned & mastered sprites from fortnite.gg</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Guide / Instructions */}
        <div className="my-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3 text-xs text-zinc-300">
          <div className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>How to grab your HTML source:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-zinc-400">
            <li>Open your sprites locker at <span className="text-zinc-200 font-mono">fortnite.gg/sprites</span></li>
            <li>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[11px]">Ctrl + U</kbd> (or right click → <em>View Page Source</em>)</li>
            <li>Select all with <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[11px]">Ctrl + A</kbd> and copy with <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[11px]">Ctrl + C</kbd></li>
            <li>Paste it directly below or drag & drop the saved HTML file!</li>
          </ol>
        </div>

        <div className="my-4 space-y-3">
          {/* Target Slot Selection */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Assign this HTML to:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetSlot('A')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                  targetSlot === 'A'
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-md shadow-rose-950/40'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white text-[11px] font-black">
                  A
                </span>
                <span>Player A</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetSlot('B')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                  targetSlot === 'B'
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-950/40'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-black text-[11px] font-black">
                  B
                </span>
                <span>Player B</span>
              </button>
            </div>
          </div>

          {/* Drag and drop / textarea area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border transition-all ${
              isDragging
                ? 'border-purple-500 bg-purple-950/30'
                : 'border-zinc-700 bg-zinc-900/80'
            }`}
          >
            <textarea
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              placeholder="Paste HTML source code here (starts with <!DOCTYPE html> or <html...)..."
              rows={7}
              className="w-full bg-transparent p-3 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none"
            />
            {rawHtml.length > 0 && (
              <div className="absolute bottom-2 right-2 text-[10px] text-zinc-500 font-mono">
                {rawHtml.length.toLocaleString()} characters
              </div>
            )}
          </div>

          {/* Upload file button alternative */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Or upload saved file:</span>
            <label className="flex items-center gap-1.5 cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors">
              <Upload className="h-3 w-3" />
              <span>Choose .html file</span>
              <input
                type="file"
                accept=".html,.htm,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleParseAndApply()}
            disabled={!rawHtml.trim()}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-900/40 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Import for Player {targetSlot}
          </button>
        </div>
      </div>
    </div>
  );
};
