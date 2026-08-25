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
    const radius = embedded ? 165 : 200;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.65,
      Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  return (
    <div
      className={`w-full relative flex flex-col items-center justify-center overflow-visible select-none ${
        embedded ? "h-[500px] sm:h-[560px]" : "h-screen bg-[var(--color-bg)]"
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
          {/* Central Hub Core (Locked Matte Gradient: Deep Navy -> Sea Teal -> Soft Periwinkle) */}
          <div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] border border-[var(--color-border)] shadow-lg flex items-center justify-center z-10 cursor-pointer"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Click to pause rotation" : "Click to auto-rotate"}
          >
            <div className="w-9 h-9 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-primary)] font-extrabold text-[10px] tracking-tight shadow-inner">
              DIGI
            </div>
          </div>

          {/* Primary Orbit Rings */}
          <div
            className={`absolute rounded-full border pointer-events-none ${
              embedded ? "w-[330px] h-[330px]" : "w-[400px] h-[400px]"
            }`}
            style={{ borderColor: "var(--orbit-ring)" }}
          />
          <div
            className={`absolute rounded-full border border-dashed pointer-events-none ${
              embedded ? "w-[360px] h-[360px]" : "w-[440px] h-[440px]"
            }`}
            style={{ borderColor: "var(--orbit-ring-dashed)" }}
          />

          {/* Orbit Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
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
                tabIndex={0}
                role="button"
                aria-label={`${item.title} capability node - ${item.energy}%`}
                aria-expanded={isExpanded}
                className="absolute transition-all duration-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-2xl"
                style={nodeStyle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(item.id);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Node Icon Circle */}
                <div
                  className={`
                  w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md
                  ${
                    isExpanded
                      ? "bg-[var(--color-accent)] text-[#EFF1F5] border-2 border-[var(--color-soft-periwinkle)] scale-115"
                      : isRelated
                      ? "bg-[var(--color-accent-muted)] text-[var(--color-text-primary)] border border-[var(--color-accent)]"
                      : "bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
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
                      ? "text-[#EFF1F5] bg-[var(--color-accent)] shadow-sm scale-105"
                      : isRelated
                      ? "text-[var(--color-text-primary)] bg-[var(--color-surface)] border border-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
                  }
                `}
                >
                  {item.title}
                </div>

                {/* Expanded Details Card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl z-[300] overflow-visible text-[var(--color-text-primary)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[var(--color-accent)]" />
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex justify-between items-center">
                        <Badge className="px-2 py-0.5 text-[10px] font-bold bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]">
                          {item.category.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm font-extrabold text-[var(--color-text-primary)] mt-1.5 flex items-center gap-1.5">
                        <Icon size={14} className="text-[var(--color-accent)]" />
                        <span>{item.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-[var(--color-text-secondary)] px-4 pb-4">
                      <p className="leading-relaxed">{item.content}</p>

                      <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                        <div className="flex justify-between items-center text-[10px] mb-1 font-bold text-[var(--color-text-muted)]">
                          <span className="flex items-center text-[var(--color-text-primary)]">
                            <Zap size={10} className="mr-1 text-[var(--color-status-warning)]" />
                            Squad Capability Level
                          </span>
                          <span className="font-mono text-[var(--color-text-primary)]">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--color-surface-hover)] rounded-full overflow-hidden border border-[var(--color-border)]">
                          <div
                            className="h-full bg-[var(--color-accent-fill)]"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                          <div className="flex items-center mb-1.5">
                            <LinkIcon size={10} className="text-[var(--color-text-muted)] mr-1" />
                            <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--color-text-muted)]">
                              Connected Squads
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-[10px] rounded-lg border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] transition-all font-semibold"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-[var(--color-text-muted)]" />
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
