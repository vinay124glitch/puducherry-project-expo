import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Info, Target, Zap, Shield, BookOpen, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ReportModal = () => {
    const handleDownload = () => {
        const reportContent = `
# Disaster–Energy Resilience Simulation & Detection Platform (DERSDP)

## 1. Abstract
Disasters such as floods, earthquakes, and cyclones significantly disrupt energy infrastructure, leading to power shortages and reduced emergency response efficiency. The Disaster–Energy Resilience Simulation & Detection Platform (DERSDP) is a web-based decision-support system designed to detect disasters using real-time public APIs and simulate their impact on energy systems.

## 4. Objectives
- Detect disasters using public real-time APIs (USGS, OpenWeather).
- Simulate disaster impact on power grid infrastructure.
- Estimate energy demand and shortage in real-time.
- Calculate a resilience score (0–100) based on damage depth.
- Provide optimized energy allocation for critical facilities.

## 7. Methodology
- Damage = Base Damage - (Infrastructure Strength * 0.5)
- Resilience = 100 - Damage
- Classification: 0-40 (High Risk), 40-70 (Medium), 70-100 (Low)

## 13. Conclusion
The DERSDP provides an integrated solution for disaster impact assessment and energy resilience planning, supporting data-driven decisions during crisis situations.

Generated via DERSDP Platform v1.0
        `.trim();

        const blob = new Blob([reportContent], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "DERSDP_Project_Report.md";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 gap-2">
                    <FileText className="h-4 w-4" /> Project Documentation
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-primary/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader className="p-6 border-b border-border bg-primary/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-5 w-5 text-primary" />
                        <DialogTitle className="text-xl font-display font-bold tracking-tight text-foreground">
                            DERSDP Technical Report
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                        Academic Documentation & System Methodology
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-8 pb-8 pr-4">
                        {/* Abstract */}
                        <section>
                            <h3 className="flex items-center gap-2 text-primary font-bold mb-3">
                                <Info className="h-4 w-4" /> 1. Abstract
                            </h3>
                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                                Disasters such as floods, earthquakes, and cyclones significantly disrupt energy infrastructure, leading to power shortages and reduced emergency response efficiency. The Disaster–Energy Resilience Simulation & Detection Platform (DERSDP) is a web-based decision-support system designed to detect disasters using real-time public APIs and simulate their impact on energy systems.
                            </p>
                        </section>

                        {/* Objectives */}
                        <section className="bg-secondary/20 rounded-lg p-4 border border-border">
                            <h3 className="flex items-center gap-2 text-primary font-bold mb-3">
                                <Target className="h-4 w-4" /> 4. Objectives
                            </h3>
                            <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
                                <li>Detect disasters using public real-time APIs (USGS, OpenWeather).</li>
                                <li>Simulate disaster impact on power grid infrastructure.</li>
                                <li>Estimate energy demand and shortage in real-time.</li>
                                <li>Calculate a resilience score (0–100) based on damage depth.</li>
                                <li>Provide optimized energy allocation for critical facilities.</li>
                            </ul>
                        </section>

                        {/* Methodology */}
                        <section>
                            <h3 className="flex items-center gap-2 text-primary font-bold mb-3">
                                <Zap className="h-4 w-4" /> 7. Methodology
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="border border-border rounded-md p-3 bg-card">
                                    <h4 className="text-xs font-bold uppercase mb-2 text-muted-foreground">Step 2: Impact Simulation</h4>
                                    <p className="font-mono text-xs bg-muted p-2 rounded mb-2">
                                        Damage = Base Damage - (Str × 0.5)
                                    </p>
                                    <p className="text-xs">
                                        Base: Quake(85), Flood(70), Cyclone(60)
                                    </p>
                                </div>
                                <div className="border border-border rounded-md p-3 bg-card">
                                    <h4 className="text-xs font-bold uppercase mb-2 text-muted-foreground">Step 4: Resilience Score</h4>
                                    <p className="font-mono text-xs bg-muted p-2 rounded mb-2">
                                        Score = 100 - Damage
                                    </p>
                                    <div className="flex gap-2 text-[10px]">
                                        <span className="text-critical">0-40: High Risk</span>
                                        <span className="text-warning">40-70: Med</span>
                                        <span className="text-success">70-100: Low</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Application */}
                        <section>
                            <h3 className="flex items-center gap-2 text-primary font-bold mb-3">
                                <BookOpen className="h-4 w-4" /> 11. Applications
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {["Municipal MGMT", "Smart Cities", "Emergency Response", "Energy Monitoring", "Risk Assessment"].map((app) => (
                                    <div key={app} className="text-[11px] text-center border border-border rounded py-2 bg-primary/5 text-primary font-medium">
                                        {app}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Architecture */}
                        <section className="border-t border-border pt-6">
                            <h3 className="text-sm font-bold mb-2">System Architecture Component Mapping</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Frontend</span>
                                    <span className="font-medium text-foreground">React + Tailwind + Shancn</span>
                                </div>
                                <div className="flex justify-between text-xs py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Charts</span>
                                    <span className="font-medium text-foreground">Recharts API</span>
                                </div>
                                <div className="flex justify-between text-xs py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Simulation Engine</span>
                                    <span className="font-medium text-foreground">Custom useSimulation Hook</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-border bg-secondary/10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-muted-foreground font-mono">DERSDP v1.0 ACADEMIC BUILD</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] gap-2 border border-primary/20 hover:bg-primary/10 text-primary"
                            onClick={handleDownload}
                        >
                            <Download className="h-3 w-3" /> Download Report (.md)
                        </Button>
                    </div>
                    <DialogClose asChild>
                        <Button size="sm" variant="outline">Close Documentation</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReportModal;
