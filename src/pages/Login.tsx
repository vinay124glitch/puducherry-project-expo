import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, LayoutDashboard, Zap, Users, Lock } from "lucide-react";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (role: UserRole) => {
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            login(role);
            navigate("/simulation");
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-lg px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 mb-2">
                        DERSDP PORTAL
                    </h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
                        Disaster - Energy Resilience Simulation & Dashboard Platform
                    </p>
                </div>

                <Card className="bg-card/50 border-border backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-foreground">Select Your Portal</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Access the system based on your authorized role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <RoleButton
                                icon={<Shield className="w-6 h-6 text-red-500" />}
                                title="Admin"
                                description="System Config & Users"
                                onClick={() => handleLogin("Admin")}
                                disabled={isLoading}
                            />
                            <RoleButton
                                icon={<LayoutDashboard className="w-6 h-6 text-blue-500" />}
                                title="Authority"
                                description="Disaster Management"
                                onClick={() => handleLogin("Authority")}
                                disabled={isLoading}
                            />
                            <RoleButton
                                icon={<Zap className="w-6 h-6 text-yellow-500" />}
                                title="Energy Dept"
                                description="Grid & Load Control"
                                onClick={() => handleLogin("Energy")}
                                disabled={isLoading}
                            />
                            <RoleButton
                                icon={<Users className="w-6 h-6 text-green-500" />}
                                title="Citizen"
                                description="Safety & Public Alerts"
                                onClick={() => handleLogin("Citizen")}
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t border-border pt-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                            <Lock className="w-3 h-3" />
                            Secure Government-Grade Authentication
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

interface RoleButtonProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}

const RoleButton = ({ icon, title, description, onClick, disabled }: RoleButtonProps) => (
    <Button
        variant="ghost"
        className="h-auto flex flex-col items-center p-6 gap-3 bg-secondary/50 border border-border hover:bg-secondary/80 hover:border-primary/50 transition-all group"
        onClick={onClick}
        disabled={disabled}
    >
        <div className="p-3 rounded-full bg-background/50 group-hover:scale-110 transition-transform shadow-sm">
            {icon}
        </div>
        <div className="text-center">
            <div className="font-bold text-foreground group-hover:text-primary transition-colors">{title}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{description}</div>
        </div>
    </Button>
);

export default Login;
