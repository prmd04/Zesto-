import { UtensilsCrossed } from "lucide-react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-bounce">
          <div className="bg-orange-600 p-4 rounded-2xl shadow-lg">
            <UtensilsCrossed className="text-white w-8 h-8" />
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-500 tracking-wide">
          Preparing your Zesto experience…
        </p>
      </div>
    </div>
  );
};

export default Loader;
