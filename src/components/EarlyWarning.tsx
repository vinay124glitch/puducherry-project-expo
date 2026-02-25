import React, { useState, useEffect } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { Bell, Smartphone, Mail, AlertCircle, X, Check } from "lucide-react";

interface Notification {
    id: string;
    type: 'sms' | 'email' | 'app';
    message: string;
    time: string;
    sent: boolean;
}

const EarlyWarning = () => {
    const { alerts, isSimulating } = useSimulation();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (alerts.length > 0 && alerts[0].time === "Just now") {
            const newAlert = alerts[0];
            const newNotifs: Notification[] = [
                {
                    id: Date.now() + '-sms',
                    type: 'sms',
                    message: `DERSDP ALERT: ${newAlert.type} detected at ${newAlert.location}. Seek shelter immediately.`,
                    time: 'Just now',
                    sent: false
                },
                {
                    id: Date.now() + '-email',
                    type: 'email',
                    message: `Official Disaster Notification: Emergency response teams mobilized for ${newAlert.type} event.`,
                    time: 'Just now',
                    sent: false
                }
            ];
            setNotifications(prev => [...newNotifs, ...prev].slice(0, 6));

            // Simulate sending
            newNotifs.forEach((n, i) => {
                setTimeout(() => {
                    setNotifications(current =>
                        current.map(item => item.id === n.id ? { ...item, sent: true } : item)
                    );
                }, (i + 1) * 1500);
            });
        }
    }, [alerts]);

    return (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Bell className={`w-5 h-5 text-orange-500 ${isSimulating ? 'animate-ring' : ''}`} />
                        Early Warning Hub
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Multi-Channel Dissemination Engine
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center"><Smartphone className="w-3 h-3 text-blue-400" /></div>
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center"><Mail className="w-3 h-3 text-orange-400" /></div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                            <Check className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-xs text-muted-foreground font-mono tracking-tighter">STANDING BY FOR EVENT DETECTION</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`p-3 rounded-lg border transition-all duration-500 ${notif.sent ? 'bg-secondary border-border' : 'bg-orange-500/10 border-orange-500/30'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {notif.type === 'sms' ? <Smartphone className="w-3 h-3 text-primary" /> : <Mail className="w-3 h-3 text-orange-500" />}
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase font-mono">{notif.type} BROADCAST</span>
                                </div>
                                {!notif.sent ? (
                                    <div className="text-[8px] text-orange-400 font-mono animate-pulse flex items-center gap-1">
                                        <AlertCircle className="w-2 h-2" /> SENDING...
                                    </div>
                                ) : (
                                    <span className="text-[8px] text-success font-mono flex items-center gap-1">
                                        <Check className="w-2 h-2" /> DELIVERED
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-foreground leading-tight font-medium">{notif.message}</p>
                            <div className="mt-2 text-[8px] text-muted-foreground font-mono">{notif.time}</div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex gap-2">
                <div className="flex-1 p-2 bg-primary/5 rounded border border-primary/10 text-center">
                    <div className="text-[14px] font-bold text-primary">12.4k</div>
                    <div className="text-[7px] text-muted-foreground uppercase font-mono">SMS Reached</div>
                </div>
                <div className="flex-1 p-2 bg-orange-500/5 rounded border border-orange-500/10 text-center">
                    <div className="text-[14px] font-bold text-orange-500">3.8k</div>
                    <div className="text-[7px] text-muted-foreground uppercase font-mono">Mail Reached</div>
                </div>
                <div className="flex-1 p-2 bg-purple-500/5 rounded border border-purple-500/10 text-center">
                    <div className="text-[14px] font-bold text-purple-400">85%</div>
                    <div className="text-[7px] text-muted-foreground uppercase font-mono">Conf. Rate</div>
                </div>
            </div>
        </div>
    );
};

export default EarlyWarning;
