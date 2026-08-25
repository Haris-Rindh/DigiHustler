"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link as LinkIcon, Zap, Code, Palette, Cpu, TrendingUp, Shield, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export const defaultServicesTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Web Engineering",
    date: "Core Squad",
    content: "Full-stack web applications, custom React/Next.js architectures, REST APIs, and scalable cloud databases.",
    category: "Engineering",
    icon: Code,
    relatedIds: [2, 3, 5],
    status: "completed",
    energy: 98,
  },
  {
    id: 2,
    title: "Design Systems",
    date: "UI/UX & Brand",
    content: "Comprehensive brand identities, responsive Figma component libraries, 3D assets, and interactive user interfaces.",
    category: "Design",
    icon: Palette,
    relatedIds: [1, 4],
    status: "completed",
    energy: 94,
  },
  {
    id: 3,
    title: "AI Automations",
    date: "Intelligent Workflows",
    content: "Custom OpenAI assistants, autonomous customer bots, n8n/Zapier integration, and automated scraping pipelines.",
    category: "AI & Data",
    icon: Cpu,
    relatedIds: [1, 6],
    status: "completed",
    energy: 96,
  },
  {
    id: 4,
    title: "Growth Marketing",
    date: "Performance SEO",
    content: "Data-driven SEO audits, high-converting PPC campaigns, content distribution, and B2B cold email infrastructure.",
    category: "Marketing",
    icon: TrendingUp,
    relatedIds: [2, 6],
    status: "completed",
    energy: 91,
  },
  {
    id: 5,
    title: "Cybersecurity",
    date: "SecOps & Audit",
    content: "Web penetration testing, OWASP Top 10 vulnerability remediation, API security hardening, and compliance advisory.",
    category: "Security",
    icon: Shield,
    relatedIds: [1],
    status: "completed",
    energy: 95,
  },
  {
    id: 6,
    title: "BI Dashboards",
    date: "Data Intelligence",
    content: "Executive PowerBI consoles, automated reporting pipelines, SQL analytics, and real-time operational insights.",
    category: "Analytics",
    icon: Database,
    relatedIds: [3, 4],
    status: "completed",
    energy: 92,
  },
];

interface RadialOrbitalTimelineProps {
  timelineData?: TimelineItem[];
  className?: string;
  embedded?: boolean;
}

export default function RadialOrbitalTimeline({
  timelineData = defaultServicesTimelineData,
  className = "",
  embedded = false,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.35) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    // Adapt radius based on embedded mode
    const radius = embedded ? 165 : 200;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.6,
      Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-[#1a7a8c] border-[#bde0fe]/40";
      case "in-progress":
        return "text-black bg-[#bde0fe] border-black";
      case "pending":
        return "text-white bg-[#0d2833] border-[#1e4a5d]";
      default:
        return "text-white bg-[#0d2833] border-[#1e4a5d]";
    }
  };

  return (
    <div
      className={`w-full relative flex flex-col items-center justify-center overflow-visible select-none ${
        embedded ? "h-[500px] sm:h-[560px]" : "h-screen bg-[#071e26]"
      } ${className}`}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Central Hub Core */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#1a7a8c] via-[#0ea5e9] to-[#8ecae6] animate-pulse flex items-center justify-center z-10 shadow-lg shadow-[#1a7a8c]/40 cursor-pointer"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Click to pause rotation" : "Click to auto-rotate"}
          >
            <div className="absolute w-20 h-20 rounded-full border border-[#bde0fe]/30 animate-ping opacity-60"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-[#1a7a8c]/20 animate-ping opacity-40"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-9 h-9 rounded-full bg-[#071e26]/80 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-[10px] tracking-tight">
              DIGI
            </div>
          </div>

          {/* Primary Orbit Rings */}
          <div className={`absolute rounded-full border border-[#1e4a5d]/60 pointer-events-none ${embedded ? "w-[330px] h-[330px]" : "w-[400px] h-[400px]"}`}></div>
          <div className={`absolute rounded-full border border-[#1a7a8c]/20 border-dashed pointer-events-none ${embedded ? "w-[360px] h-[360px]" : "w-[440px] h-[440px]"}`}></div>

          {/* Orbit Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Radial Glow Halo */}
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(26,122,140,0.4) 0%, rgba(7,30,38,0) 70%)`,
                    width: `${item.energy * 0.4 + 40}px`,
                    height: `${item.energy * 0.4 + 40}px`,
                    left: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.4 + 40 - 40) / 2}px`,
                  }}
                ></div>

                {/* Node Icon Circle */}
                <div
                  className={`
                  w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-lg
                  ${
                    isExpanded
                      ? "bg-[#1a7a8c] text-white border-2 border-[#bde0fe] shadow-[#1a7a8c]/50 scale-125"
                      : isRelated
                      ? "bg-[#1a7a8c]/60 text-white border border-[#bde0fe] animate-pulse"
                      : "bg-[#0d2833] text-[#bde0fe] border border-[#1e4a5d] hover:border-[#1a7a8c] hover:bg-[#113240]"
                  }
                  transition-all duration-300 transform
                `}
                >
                  <Icon size={18} />
                </div>

                {/* Node Title Label */}
                <div
                  className={`
                  absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-md
                  transition-all duration-300
                  ${
                    isExpanded
                      ? "text-white bg-[#1a7a8c] shadow-sm scale-110"
                      : isRelated
                      ? "text-[#bde0fe] bg-[#0d2833]/90 border border-[#1a7a8c]/40"
                      : "text-slate-300 bg-[#071e26]/85 border border-[#1e4a5d]/70 hover:text-white"
                  }
                `}
                >
                  {item.title}
                </div>

                {/* Expanded Details Card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-[#071e26]/98 backdrop-blur-xl border border-[#1a7a8c] shadow-2xl shadow-black/80 z-[300] overflow-visible text-white">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#1a7a8c]"></div>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 py-0.5 text-[10px] font-bold ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.category.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-mono text-[#bde0fe]">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                        <Icon size={14} className="text-[#1a7a8c]" />
                        <span>{item.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-300 px-4 pb-4">
                      <p className="leading-relaxed">{item.content}</p>

                      <div className="mt-3 pt-3 border-t border-[#1e4a5d]">
                        <div className="flex justify-between items-center text-[10px] mb-1 font-bold text-slate-400">
                          <span className="flex items-center text-[#bde0fe]">
                            <Zap size={10} className="mr-1 text-amber-400" />
                            Squad Capability Level
                          </span>
                          <span className="font-mono text-white">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0d2833] rounded-full overflow-hidden border border-[#1e4a5d]">
                          <div
                            className="h-full bg-gradient-to-r from-[#1a7a8c] to-[#0ea5e9]"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#1e4a5d]">
                          <div className="flex items-center mb-1.5">
                            <LinkIcon size={10} className="text-slate-400 mr-1" />
                            <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                              Connected Squads
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-[10px] rounded-lg border-[#1e4a5d] bg-[#0d2833] hover:bg-[#1a7a8c] hover:text-white text-slate-300 transition-all font-semibold"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-slate-400"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
