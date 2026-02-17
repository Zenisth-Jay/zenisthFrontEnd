import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

const createAvatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const randomSeed = () => Math.random().toString(36).substring(2, 10);

// Generate many seeds
const generateSeeds = (count = 80) =>
  Array.from({ length: count }).map(() => randomSeed());

const AvatarPicker = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [presetSeeds] = useState(() => generateSeeds(80));

  const avatar = value || { type: "preset", seed: presetSeeds[0] };

  const avatarSrc =
    avatar.type === "upload" ? avatar.previewUrl : createAvatarUrl(avatar.seed);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    onChange?.({
      type: "upload",
      file,
      previewUrl,
    });
  };

  const handleSelectPreset = (seed) => {
    onChange?.({ type: "preset", seed });
    setIsOpen(false);
  };

  return (
    <>
      {/* Avatar Preview */}
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-200 bg-gray-100 hover:opacity-90 transition"
        >
          <img
            src={avatarSrc}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-gray-600 hover:underline"
        >
          <Upload size={16} />
          Upload photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-130 max-w-[95%] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Choose an avatar</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>

            {/* Scrollable Grid */}
            <div className="h-90 overflow-y-auto pr-2">
              <div className="grid grid-cols-5 gap-4">
                {presetSeeds.map((seed) => {
                  const url = createAvatarUrl(seed);
                  return (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => handleSelectPreset(seed)}
                      className="w-20 h-20 rounded-full overflow-hidden border hover:border-indigo-500 transition"
                    >
                      <img
                        src={url}
                        alt="Avatar option"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarPicker;
