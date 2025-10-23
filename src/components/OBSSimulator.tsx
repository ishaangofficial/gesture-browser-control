import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Mic, MicOff, Volume2, VolumeX, Users, MessageSquare, Settings as SettingsIcon } from "lucide-react";

interface OBSSimulatorProps {
  cursorX: number;
  cursorY: number;
  isClicking: boolean;
  isRightClicking: boolean;
  gesture: string;
}

const OBSSimulator = ({ cursorX, cursorY, isClicking, isRightClicking, gesture }: OBSSimulatorProps) => {
  const [activeScene, setActiveScene] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);
  const [viewerCount, setViewerCount] = useState(42);

  const scenes = [
    { name: "Gaming", color: "from-purple-500 to-pink-500" },
    { name: "Webcam", color: "from-blue-500 to-cyan-500" },
    { name: "Screen Share", color: "from-green-500 to-emerald-500" },
    { name: "BRB Scene", color: "from-orange-500 to-red-500" }
  ];

  const prevGestureRef = useRef<string>("");

  // Handle gesture controls
  useEffect(() => {
    // Prevent repeated triggers
    if (gesture === prevGestureRef.current) return;
    prevGestureRef.current = gesture;

    if (gesture === "Left Click" && isClicking) {
      // Scene switch on click
      const sceneButtons = document.querySelectorAll('[data-scene]');
      sceneButtons.forEach((btn, idx) => {
        const rect = btn.getBoundingClientRect();
        if (cursorX >= rect.left && cursorX <= rect.right &&
            cursorY >= rect.top && cursorY <= rect.bottom) {
          setActiveScene(idx);
        }
      });
    }

    if (gesture === "Right Click") {
      setIsMuted(prev => !prev);
    }

    if (gesture === "Grab & Drag") {
      setIsRecording(prev => !prev);
    }

    if (gesture === "Zoom In" || gesture === "Zoom Out") {
      setChatVisible(prev => !prev);
    }
  }, [gesture, isClicking, cursorX, cursorY]);

  return (
    <div className="relative w-full h-full bg-[#18181B] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
      {/* OBS Studio Header */}
      <div className="h-10 bg-[#0E0E10] border-b border-zinc-800 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-zinc-400 ml-2">OBS Studio 30.0.0</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-zinc-400" />
            <span className="text-xs text-zinc-300">{viewerCount} viewers</span>
          </div>
          {isRecording && (
            <Badge className="bg-red-500 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-1" />
              LIVE
            </Badge>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100%-40px)]">
        {/* Main Preview */}
        <div className="flex-1 p-4">
          <div className={`w-full h-full rounded-lg bg-gradient-to-br ${scenes[activeScene].color} relative overflow-hidden`}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-black/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] animate-pulse" />
            </div>

            {/* Scene content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
              <Video className="w-16 h-16 text-white/80 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">{scenes[activeScene].name}</h3>
              <p className="text-white/60 text-sm">Demo Stream Content</p>
              
              {/* Virtual cursor overlay */}
              <div 
                className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 transition-all duration-75"
                style={{
                  left: `${(cursorX / window.innerWidth) * 100}%`,
                  top: `${(cursorY / window.innerHeight) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>

            {/* Stream info overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-white text-sm font-medium">Your Amazing Stream</p>
                <p className="text-white/60 text-xs">Playing: {scenes[activeScene].name}</p>
              </div>
              <div className="flex gap-2">
                {isMuted ? (
                  <div className="bg-red-500/90 backdrop-blur-sm rounded-lg p-2">
                    <MicOff className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="bg-green-500/90 backdrop-blur-sm rounded-lg p-2">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {isRecording ? 'Stop Streaming' : 'Start Streaming'}
              </button>
              <button className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-medium transition-all">
                Start Recording
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-lg transition-all ${isMuted ? 'bg-red-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                {isMuted ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-zinc-300" />}
              </button>
              <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all">
                <Volume2 className="w-4 h-4 text-zinc-300" />
              </button>
              <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all">
                <SettingsIcon className="w-4 h-4 text-zinc-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l border-zinc-800 flex flex-col">
          {/* Scenes */}
          <div className="p-3 border-b border-zinc-800">
            <h3 className="text-xs font-semibold text-zinc-400 mb-2">SCENES</h3>
            <div className="space-y-1.5">
              {scenes.map((scene, idx) => (
                <button
                  key={idx}
                  data-scene={idx}
                  onClick={() => setActiveScene(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeScene === idx
                      ? 'bg-zinc-700 text-white font-medium'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {scene.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          {chatVisible && (
            <div className="flex-1 p-3 overflow-hidden">
              <h3 className="text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                CHAT
              </h3>
              <div className="space-y-2 text-xs">
                <div className="bg-zinc-800/50 rounded p-2">
                  <span className="text-purple-400 font-medium">User123:</span>
                  <span className="text-zinc-300 ml-1">Amazing stream! 🔥</span>
                </div>
                <div className="bg-zinc-800/50 rounded p-2">
                  <span className="text-blue-400 font-medium">Viewer456:</span>
                  <span className="text-zinc-300 ml-1">Love the gesture control!</span>
                </div>
                <div className="bg-zinc-800/50 rounded p-2">
                  <span className="text-green-400 font-medium">Fan789:</span>
                  <span className="text-zinc-300 ml-1">How are you doing that? 😮</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gesture indicator */}
      {gesture && gesture !== "None" && (
        <div className="absolute top-12 right-4 bg-cyan-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <p className="text-xs font-medium">Gesture: {gesture}</p>
        </div>
      )}
    </div>
  );
};

export default OBSSimulator;