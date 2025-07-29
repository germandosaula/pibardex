interface SocialSidebarProps {
  className?: string;
}

export default function SocialSidebar({ className = "" }: SocialSidebarProps) {
  return (
    <div className={`bg-red-900/50 backdrop-blur-sm border-l border-red-700/30 p-4 ${className}`}>
      <div className="space-y-6">
        {/* Unreal 2 Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Unreal 2</h4>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">→</span>
          </div>
          <p className="text-sm text-blue-100 mb-3">
            Legendary • Super Pack
            Fortnite • Chapter 3
            BEST VALUE • Season 3
            Premium Pack
          </p>
        </div>

        {/* Subway Surf Card */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Subway Surf</h4>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">→</span>
          </div>
        </div>

        {/* Red Dead Redemption Card */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Red Dead Redemption 3</h4>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">→</span>
          </div>
          <p className="text-sm text-red-100">Perfect Pack</p>
        </div>

        {/* Friends List */}
        <div>
          <h4 className="font-semibold mb-3">Friends</h4>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}