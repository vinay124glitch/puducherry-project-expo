import React, { useState } from "react";
import { FileText, Download, CheckCircle, Loader2, Printer } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { useAuth } from "@/context/AuthContext";

const ReportGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const { resilience, alerts, energyData } = useSimulation();
    const { user } = useAuth();

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setIsDone(true);
        }, 2500);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Official Incident Report
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Government Compliance & Audit Export
                    </p>
                </div>
            </div>

            {!isGenerating && !isDone && (
                <div className="text-center py-6">
                    <div className="mb-4 flex flex-col items-center">
                        <div className="p-4 rounded-full bg-indigo-500/10 mb-4">
                            <FileText className="w-8 h-8 text-indigo-600" />
                        </div>
                        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                            Generate a comprehensive PDF summary of the current simulation state, resilience metrics, and infrastructure status.
                        </p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 mx-auto shadow-lg shadow-indigo-600/20"
                    >
                        <Download className="w-4 h-4" />
                        Generate Report
                    </button>
                </div>
            )}

            {isGenerating && (
                <div className="text-center py-8">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <div className="text-sm font-bold text-foreground mb-2">Compiling System Metrics...</div>
                    <div className="text-[10px] text-muted-foreground font-mono animate-pulse">
                        Gathering sensor data | Analyzing energy shortfall | Exporting alert logs
                    </div>
                    <div className="mt-6 h-1 w-full bg-secondary rounded-full overflow-hidden max-w-[200px] mx-auto">
                        <div className="h-full bg-indigo-600 animate-progress" />
                    </div>
                </div>
            )}

            {isDone && (
                <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <div className="text-sm font-bold text-foreground mb-1">Report Ready</div>
                    <div className="text-[10px] text-muted-foreground mb-6 font-mono">
                        REF ID: DERSDP-{new Date().getTime().toString(16).toUpperCase()}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handlePrint}
                            className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 justify-center border border-border"
                        >
                            <Printer className="w-4 h-4" />
                            Print PDF
                        </button>
                        <button
                            onClick={() => setIsDone(false)}
                            className="border border-indigo-500/30 text-indigo-600 hover:bg-indigo-500/10 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 justify-center"
                        >
                            New Report
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden layout for Print */}
            <div className="hidden print:block fixed inset-0 bg-white text-black p-10 z-[1000] overflow-y-auto">
                <div className="border-b-4 border-black pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">DERSDP INCIDENT REPORT</h1>
                        <p className="text-sm font-mono">Disaster & Energy Resilience Smart Decision Platform</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-sm">DATE: {new Date().toLocaleString()}</p>
                        <p className="text-xs">AUTH: {user?.name} ({user?.role})</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-10">
                    <div className="border p-4 bg-gray-50">
                        <h2 className="text-lg font-bold border-b mb-2 uppercase">Core Status</h2>
                        <div className="text-5xl font-black mb-1">{resilience}%</div>
                        <p className="text-sm uppercase font-bold text-gray-600">Overall System Resilience</p>
                    </div>
                    <div className="border p-4 bg-gray-50">
                        <h2 className="text-lg font-bold border-b mb-2 uppercase">Incident Log</h2>
                        <p className="text-sm font-bold">{alerts.length} Active Alerts Detected</p>
                        <ul className="mt-2 space-y-1">
                            {alerts.slice(0, 3).map(a => (
                                <li key={a.id} className="text-xs">• {a.type} - {a.location} ({a.severity})</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-lg font-bold border-b-2 border-black mb-4 uppercase">Energy Grid Analysis</h2>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Time</th>
                                <th className="border p-2 text-left">Demand (MW)</th>
                                <th className="border p-2 text-left">Supply (MW)</th>
                                <th className="border p-2 text-left">Shortfall (MW)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {energyData.map(d => (
                                <tr key={d.time}>
                                    <td className="border p-2">{d.time}</td>
                                    <td className="border p-2">{d.demand}</td>
                                    <td className="border p-2">{d.supply}</td>
                                    <td className={`border p-2 ${d.shortfall > 0 ? 'bg-red-50 text-red-600 font-bold' : ''}`}>{d.shortfall}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-20 pt-10 border-t flex justify-between text-xs">
                    <div className="w-48 text-center">
                        <div className="border-b border-black mb-1"></div>
                        <p>Authorized Signature</p>
                    </div>
                    <div className="text-right">
                        <p>Generated by DERSDP Autonomous System</p>
                        <p>© 2024 Puducherry Disaster Management Authority</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
