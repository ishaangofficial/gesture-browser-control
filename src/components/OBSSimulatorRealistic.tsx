import { useState, useEffect, useRef } from "react";
import { Video, Volume2, VolumeX, Eye, EyeOff, Lock, Settings as SettingsIcon, Plus, Minus, ChevronUp, ChevronDown, Play, Pause } from "lucide-react";

interface OBSSimulatorProps {
  cursorX: number;
  cursorY: number;
  isClicking: boolean;
  gesture: string;
}

const OBSSimulatorRealistic = ({ cursorX, cursorY, isClicking, gesture }: OBSSimulatorProps) => {
  const [activeScene, setActiveScene] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDesktopMuted, setIsDesktopMuted] = useState(false);
  const [videosPlaying, setVideosPlaying] = useState([true, true, true, true]);
  const [sources, setSources] = useState([
    { name: "Game Capture", visible: true, locked: false },
    { name: "Webcam", visible: true, locked: false },
    { name: "Overlay Graphics", visible: false, locked: false }
  ]);
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const scenes = [
    { name: "Gaming Scene", active: true, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    { name: "Coding Scene", active: false, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
    { name: "Chat Scene", active: false, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { name: "Music Scene", active: false, video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" }
  ];

  const prevGestureRef = useRef<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gesture === prevGestureRef.current) return;
    prevGestureRef.current = gesture;

    if (gesture === "Left Click" && isClicking) {
      handleClick(cursorX, cursorY);
    }

    if (gesture === "Right Click") {
      setIsMicMuted(prev => !prev);
    }

    if (gesture === "Grab & Drag") {
      setIsStreaming(prev => !prev);
    }

    if (gesture === "Wave") {
      // Wave gesture changes scene
      setActiveScene(prev => (prev + 1) % scenes.length);
    }

    if (gesture === "Zoom In") {
      // Zoom In plays video
      toggleVideoPlayPause(activeScene);
    }

    if (gesture === "Zoom Out") {
      // Zoom Out pauses video
      toggleVideoPlayPause(activeScene);
    }

    if (gesture === "Scroll Up") {
      setIsRecording(prev => !prev);
    }

    if (gesture === "Scroll Down") {
      setIsDesktopMuted(prev => !prev);
    }
  }, [gesture, isClicking, cursorX, cursorY, activeScene]);

  const toggleVideoPlayPause = (sceneIndex: number) => {
    const video = videoRefs.current[sceneIndex];
    if (video) {
      if (video.paused) {
        video.play();
        setVideosPlaying(prev => {
          const newState = [...prev];
          newState[sceneIndex] = true;
          return newState;
        });
      } else {
        video.pause();
        setVideosPlaying(prev => {
          const newState = [...prev];
          newState[sceneIndex] = false;
          return newState;
        });
      }
    }
  };

  const handleClick = (x: number, y: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    // Check scene buttons
    const sceneButtons = document.querySelectorAll('[data-obs-scene]');
    sceneButtons.forEach((btn, idx) => {
      const btnRect = btn.getBoundingClientRect();
      if (x >= btnRect.left && x <= btnRect.right && y >= btnRect.top && y <= btnRect.bottom) {
        setActiveScene(idx);
      }
    });

    // Check control buttons
    const streamBtn = document.querySelector('[data-obs-stream]');
    if (streamBtn) {
      const btnRect = streamBtn.getBoundingClientRect();
      if (x >= btnRect.left && x <= btnRect.right && y >= btnRect.top && y <= btnRect.bottom) {
        setIsStreaming(prev => !prev);
      }
    }

    const recordBtn = document.querySelector('[data-obs-record]');
    if (recordBtn) {
      const btnRect = recordBtn.getBoundingClientRect();
      if (x >= btnRect.left && x <= btnRect.right && y >= btnRect.top && y <= btnRect.bottom) {
        setIsRecording(prev => !prev);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#18181B] rounded-lg overflow-hidden flex flex-col text-[13px]">
      {/* Top Menu Bar */}
      <div className="h-8 bg-[#0E0E10] border-b border-[#26262C] flex items-center px-3 text-[#EFEFF1] text-xs">
        <span className="mr-4">File</span>
        <span className="mr-4">Edit</span>
        <span className="mr-4">View</span>
        <span className="mr-4">Docks</span>
        <span className="mr-4">Profile</span>
        <span className="mr-4">Scene Collection</span>
        <span className="mr-4">Tools</span>
        <span className="mr-4">Help</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Scenes & Sources */}
        <div className="w-64 flex flex-col border-r border-[#26262C]">
          {/* Scenes Panel */}
          <div className="flex-1 flex flex-col border-b border-[#26262C] min-h-0">
            <div className="h-7 bg-[#26262C] flex items-center justify-between px-2 text-[#EFEFF1] font-medium">
              <span>Scenes</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 hover:bg-[#3A3A3F] rounded flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </button>
                <button className="w-5 h-5 hover:bg-[#3A3A3F] rounded flex items-center justify-center">
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#18181B] p-1 overflow-y-auto">
              {scenes.map((scene, idx) => (
                <button
                  key={idx}
                  data-obs-scene={idx}
                  onClick={() => setActiveScene(idx)}
                  className={`w-full text-left px-2 py-1.5 mb-1 text-xs rounded transition-colors ${
                    activeScene === idx
                      ? 'bg-[#5865F2] text-white'
                      : 'text-[#EFEFF1] hover:bg-[#26262C]'
                  }`}
                >
                  {scene.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sources Panel */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="h-7 bg-[#26262C] flex items-center justify-between px-2 text-[#EFEFF1] font-medium">
              <span>Sources</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 hover:bg-[#3A3A3F] rounded flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </button>
                <button className="w-5 h-5 hover:bg-[#3A3A3F] rounded flex items-center justify-center">
                  <Minus className="w-3 h-3" />
                </button>
                <button className="w-5 h-5 hover:bg-[#3A3A3F] rounded flex items-center justify-center">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button className="w-5 h-5 hover:bg-[#3A3A3F] rounded flex items-center justify-center">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#18181B] p-1 overflow-y-auto">
              {sources.map((source, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2 py-1.5 mb-1 text-xs text-[#EFEFF1] hover:bg-[#26262C] rounded"
                >
                  <button className="w-4 h-4 flex items-center justify-center hover:text-white">
                    {source.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                  <span className="flex-1">{source.name}</span>
                  {source.locked && <Lock className="w-3 h-3" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Preview Area */}
          <div className="flex-1 bg-black relative overflow-hidden min-h-0">
            {/* Video Background */}
            {scenes.map((scene, idx) => (
              <video
                key={idx}
                ref={el => videoRefs.current[idx] = el}
                src={scene.video}
                loop
                muted
                autoPlay={idx === 0}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  activeScene === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ filter: 'brightness(0.7)' }}
              />
            ))}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

            {/* Video Play/Pause Indicator */}
            {!videosPlaying[activeScene] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-8">
                  <Pause className="w-16 h-16 text-white" />
                </div>
              </div>
            )}

            {/* Virtual Cursor */}
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-cyan-400 bg-cyan-400/30 shadow-lg shadow-cyan-400/50 transition-all duration-75 pointer-events-none z-10"
              style={{
                left: `${(cursorX / window.innerWidth) * 100}%`,
                top: `${(cursorY / window.innerHeight) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />

            {/* Status Overlays */}
            {isStreaming && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            )}
            {isRecording && (
              <div className="absolute top-12 right-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                REC
              </div>
            )}

            {/* Gesture Indicator */}
            {gesture && gesture !== "None" && gesture !== "Cursor Move" && (
              <div className="absolute top-4 left-4 bg-cyan-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded text-xs font-medium">
                {gesture}
              </div>
            )}

            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0E0E10]/80 backdrop-blur-sm flex items-center justify-between px-3 text-[10px] text-[#EFEFF1]">
              <span>Canvas: 1920x1080</span>
              <span>Output: 1920x1080</span>
              <span>CPU: 3.0%</span>
              <span>FPS: 60</span>
              <span>Render lag: 0.0 ms</span>
            </div>
          </div>

          {/* Bottom Panels Row */}
          <div className="h-40 flex border-t border-[#26262C]">
            {/* Audio Mixer */}
            <div className="flex-1 flex flex-col border-r border-[#26262C] min-w-0">
              <div className="h-7 bg-[#26262C] flex items-center px-2 text-[#EFEFF1] font-medium">
                Audio Mixer
              </div>
              <div className="flex-1 bg-[#1E1E21] p-2 flex gap-2">
                {/* Desktop Audio */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex-1 w-full relative">
                    <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-green-600/80 to-green-400/80" style={{ height: isDesktopMuted ? '0%' : '45%' }} />
                  </div>
                  <div className="text-[10px] text-[#EFEFF1] mt-1 truncate w-full text-center">Desktop Audio</div>
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => setIsDesktopMuted(prev => !prev)}
                      className="w-6 h-6 hover:bg-[#3A3A3F] rounded flex items-center justify-center text-[#EFEFF1]"
                    >
                      {isDesktopMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    <button className="w-6 h-6 hover:bg-[#3A3A3F] rounded flex items-center justify-center text-[#EFEFF1]">
                      <SettingsIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Mic/Aux */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex-1 w-full relative">
                    <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-green-600/80 to-yellow-400/80" style={{ height: isMicMuted ? '0%' : '65%' }} />
                  </div>
                  <div className="text-[10px] text-[#EFEFF1] mt-1 truncate w-full text-center">Mic/Aux</div>
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => setIsMicMuted(prev => !prev)}
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        isMicMuted ? 'bg-red-600 text-white' : 'hover:bg-[#3A3A3F] text-[#EFEFF1]'
                      }`}
                    >
                      {isMicMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    <button className="w-6 h-6 hover:bg-[#3A3A3F] rounded flex items-center justify-center text-[#EFEFF1]">
                      <SettingsIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scene Transitions */}
            <div className="w-48 flex flex-col border-r border-[#26262C]">
              <div className="h-7 bg-[#26262C] flex items-center px-2 text-[#EFEFF1] font-medium">
                Scene Transitions
              </div>
              <div className="flex-1 bg-[#1E1E21] p-2">
                <select className="w-full bg-[#26262C] text-[#EFEFF1] text-xs px-2 py-1 rounded mb-2">
                  <option>Fade</option>
                </select>
                <div className="text-[10px] text-[#EFEFF1] mb-1">Duration</div>
                <input
                  type="text"
                  value="300 ms"
                  readOnly
                  className="w-full bg-[#26262C] text-[#EFEFF1] text-xs px-2 py-1 rounded"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="w-48 flex flex-col">
              <div className="h-7 bg-[#26262C] flex items-center px-2 text-[#EFEFF1] font-medium">
                Controls
              </div>
              <div className="flex-1 bg-[#1E1E21] p-2 space-y-2">
                <button
                  data-obs-stream
                  onClick={() => setIsStreaming(prev => !prev)}
                  className={`w-full py-1.5 rounded text-xs font-medium transition-colors ${
                    isStreaming
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#3A3A3F] hover:bg-[#4A4A4F] text-[#EFEFF1]'
                  }`}
                >
                  {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
                </button>
                <button
                  data-obs-record
                  onClick={() => setIsRecording(prev => !prev)}
                  className={`w-full py-1.5 rounded text-xs font-medium transition-colors ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#3A3A3F] hover:bg-[#4A4A4F] text-[#EFEFF1]'
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                <button className="w-full bg-[#3A3A3F] hover:bg-[#4A4A4F] text-[#EFEFF1] py-1.5 rounded text-xs font-medium">
                  Start Virtual Camera
                </button>
                <button className="w-full bg-[#3A3A3F] hover:bg-[#4A4A4F] text-[#EFEFF1] py-1.5 rounded text-xs font-medium">
                  Studio Mode
                </button>
                <button className="w-full bg-[#3A3A3F] hover:bg-[#4A4A3F] text-[#EFEFF1] py-1.5 rounded text-xs font-medium">
                  Settings
                </button>
                <button className="w-full bg-[#3A3A3F] hover:bg-[#4A4A4F] text-[#EFEFF1] py-1.5 rounded text-xs font-medium">
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-6 bg-[#0E0E10] border-t border-[#26262C] flex items-center justify-between px-3 text-[10px] text-[#EFEFF1]">
        <span>00:00:00</span>
        <span>00:00:00</span>
        <span className="flex items-center gap-1">
          <span>CPU: 3.0%</span>
          <span className="mx-2">|</span>
          <span>60.00 FPS</span>
          <span className="mx-2">|</span>
          <span>60.00 / 60.00</span>
        </span>
      </div>
    </div>
  );
};

export default OBSSimulatorRealistic;
