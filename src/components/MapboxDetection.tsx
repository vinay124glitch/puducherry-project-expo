import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSimulation } from '@/context/SimulationContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, ShieldAlert, Layers, Navigation, Hospital, Zap, Home, Droplets, AlertTriangle, Search, Menu, Mic, Map as MapIcon, Globe, Compass, Plus, Minus, Maximize } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { renderToStaticMarkup } from 'react-dom/server';

import { useTheme } from 'next-themes';

// Use a public token for demonstration (Note: In production, this should be an env variable)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

const MAP_STYLES = {
    dark: 'mapbox://styles/mapbox/dark-v11',
    light: 'mapbox://styles/mapbox/light-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    streets: 'mapbox://styles/mapbox/streets-v12'
};

const MapboxDetection = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const { alerts, isSimulating, infrastructure } = useSimulation();
    const { location, heading } = useGeolocation();
    const { theme } = useTheme();

    const markers = useRef<mapboxgl.Marker[]>([]);
    const infraMarkers = useRef<mapboxgl.Marker[]>([]);
    const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const hasInitialLock = useRef(false);

    const [currentStyle, setCurrentStyle] = useState<keyof typeof MAP_STYLES>('streets');
    const [showStyles, setShowStyles] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [is3D, setIs3D] = useState(false);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: MAP_STYLES[currentStyle],
            center: [79.8083, 11.9416], // Puducherry Coordinates
            zoom: 12,
            attributionControl: false,
            antialias: true
        });

        // Add default controls but we will style them or add custom ones
        // map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        map.current.on('load', () => {
            if (!map.current) return;
            // Add 3D buildings layer
            const layers = map.current.getStyle().layers;
            if (!layers) return;
            const labelLayerId = layers.find(
                (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
            )?.id;

            map.current.addLayer(
                {
                    'id': '3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    // Premium User Marker Logic
    useEffect(() => {
        if (!map.current || !location) return;

        if (!userMarkerRef.current) {
            const el = document.createElement('div');
            el.className = 'user-marker';

            const arrow = document.createElement('div');
            arrow.className = 'user-marker-heading';
            el.appendChild(arrow);

            userMarkerRef.current = new mapboxgl.Marker({ element: el })
                .setLngLat([location.lng, location.lat])
                .addTo(map.current);

            // Initial lock: Fly to user
            if (!hasInitialLock.current) {
                map.current.flyTo({
                    center: [location.lng, location.lat],
                    zoom: 14,
                    pitch: 45,
                    essential: true
                });
                hasInitialLock.current = true;
            }
        } else {
            userMarkerRef.current.setLngLat([location.lng, location.lat]);
        }

        const arrowEl = userMarkerRef.current.getElement().querySelector('.user-marker-heading') as HTMLElement;
        if (arrowEl) {
            arrowEl.style.transform = `rotate(${heading}deg)`;
        }
    }, [location, heading]);

    // Handle Style Changes
    useEffect(() => {
        if (!map.current) return;
        map.current.setStyle(MAP_STYLES[currentStyle]);
    }, [currentStyle]);

    // Draw Infrastructure Markers
    useEffect(() => {
        if (!map.current) return;

        infraMarkers.current.forEach(m => m.remove());
        infraMarkers.current = [];

        infrastructure.forEach(infra => {
            const el = document.createElement('div');
            el.className = `infra-marker ${infra.status}`;

            const iconMap = {
                hospital: <Hospital className="w-3 h-3 text-white" />,
                power: <Zap className="w-3 h-3 text-white" />,
                shelter: <Home className="w-3 h-3 text-white" />,
                water: <Droplets className="w-3 h-3 text-white" />,
                emergency: <AlertTriangle className="w-3 h-3 text-white" />
            };

            const colors = {
                online: '#10b981',
                warning: '#f59e0b',
                offline: '#ef4444'
            };

            el.style.backgroundColor = colors[infra.status];
            el.style.width = '24px';
            el.style.height = '24px';
            el.style.borderRadius = '50%';
            el.style.border = '2px solid white';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.boxShadow = `0 0 10px ${colors[infra.status]}80`;
            el.style.cursor = 'pointer';

            const iconMarkup = renderToStaticMarkup(iconMap[infra.type]);
            el.innerHTML = iconMarkup;

            const marker = new mapboxgl.Marker(el)
                .setLngLat(infraMarkers.current.length % 2 === 0 ? infra.coordinates : [infra.coordinates[0], infra.coordinates[1]]) // Fix for markers
                .setLngLat(infra.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                        <div style="background: ${theme === 'dark' ? '#1a1b1e' : '#ffffff'}; color: ${theme === 'dark' ? '#ffffff' : '#000000'}; font-family: sans-serif; padding: 10px; border-radius: 8px;">
                            <div style="font-weight: bold; border-bottom: 1px solid ${theme === 'dark' ? '#333' : '#eee'}; margin-bottom: 8px; font-size: 13px;">${infra.name}</div>
                            <div style="font-size: 11px; color: ${theme === 'dark' ? '#aaa' : '#666'}; line-height: 1.5;">
                                <div style="display: flex; justify-between; margin-bottom: 4px;">
                                    <span>Priority: </span>
                                    <span style="margin-left: auto; font-weight: bold;">${infra.priority}</span>
                                </div>
                                <div style="display: flex; justify-between; margin-bottom: 4px;">
                                    <span>Status: </span>
                                    <span style="margin-left: auto; font-weight: bold; color: ${colors[infra.status]}">${infra.status.toUpperCase()}</span>
                                </div>
                                ${infra.fuelHours ? `<div style="display: flex; justify-between;">
                                    <span>Fuel: </span>
                                    <span style="margin-left: auto; font-weight: bold;">${infra.fuelHours}h remaining</span>
                                </div>` : ''}
                                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid ${theme === 'dark' ? '#333' : '#eee'};">
                                    <button style="width: 100%; background: #3b82f6; color: white; border: none; padding: 6px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        Directions
                                    </button>
                                </div>
                            </div>
                        </div>
                    `))
                .addTo(map.current!);
            infraMarkers.current.push(marker);
        });
    }, [infrastructure, currentStyle, alerts]);

    // Draw Impact Radii & Disasters
    useEffect(() => {
        if (!map.current) return;

        const handleStyleLoad = () => {
            // Remove existing layers and sources first
            alerts.forEach(alert => {
                const sourceId = `impact-source-${alert.id}`;
                const layerId = `impact-layer-${alert.id}`;
                if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId);
                if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId);
            });

            // Re-add 3D buildings
            if (!map.current!.getLayer('3d-buildings')) {
                const layers = map.current!.getStyle().layers;
                if (layers) {
                    const labelLayerId = layers.find(
                        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
                    )?.id;
                    map.current!.addLayer({
                        'id': '3d-buildings',
                        'source': 'composite',
                        'source-layer': 'building',
                        'filter': ['==', 'extrude', 'true'],
                        'type': 'fill-extrusion',
                        'minzoom': 15,
                        'paint': {
                            'fill-extrusion-color': '#aaa',
                            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
                            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
                            'fill-extrusion-opacity': 0.6
                        }
                    }, labelLayerId);
                }
            }

            // Draw Radius Circles
            alerts.forEach((alert) => {
                if (!alert.coordinates) return;
                const sourceId = `impact-source-${alert.id}`;
                const layerId = `impact-layer-${alert.id}`;

                map.current!.addSource(sourceId, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: alert.coordinates
                        },
                        properties: {}
                    }
                });

                map.current!.addLayer({
                    id: layerId,
                    type: 'circle',
                    source: sourceId,
                    paint: {
                        'circle-radius': [
                            'interpolate',
                            ['exponential', 2],
                            ['zoom'],
                            0, 0,
                            20, (alert.radius || 10) * 10
                        ],
                        'circle-color': alert.severity === 'critical' ? '#ef4444' : '#f59e0b',
                        'circle-opacity': 0.15,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': alert.severity === 'critical' ? '#ef4444' : '#f59e0b',
                        'circle-stroke-opacity': 0.5
                    }
                });
            });

            // Draw Disaster Markers
            markers.current.forEach(m => m.remove());
            markers.current = [];
            alerts.forEach(alert => {
                if (alert.coordinates) {
                    const el = document.createElement('div');
                    el.className = 'disaster-marker';
                    const color = alert.severity === 'critical' ? '#ef4444' : '#f59e0b';
                    el.style.backgroundColor = color;
                    el.style.width = '20px';
                    el.style.height = '20px';
                    el.style.borderRadius = '50%';
                    el.style.border = '2px solid white';
                    el.style.boxShadow = `0 0 20px ${color}`;
                    el.style.cursor = 'pointer';
                    el.style.display = 'flex';
                    el.style.alignItems = 'center';
                    el.style.justifyContent = 'center';
                    el.innerHTML = '<div style="width: 8px; height: 8px; background: white; border-radius: 50%; animate: ping 1.5s infinite;"></div>';

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat(alert.coordinates)
                        .setPopup(new mapboxgl.Popup({ offset: 25 })
                            .setHTML(`
                                <div style="background: ${theme === 'dark' ? '#1a1b1e' : '#ffffff'}; color: ${theme === 'dark' ? '#ffffff' : '#000000'}; font-family: monospace; font-size: 11px; padding: 10px; border-radius: 8px;">
                                    <strong style="color: ${color}; font-size: 13px;">${alert.type}</strong><br/>
                                    <div style="margin-top: 8px; border-top: 1px solid ${theme === 'dark' ? '#333' : '#eee'}; pt-2;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                            <span>Radius:</span>
                                            <span style="font-weight: bold;">${alert.radius?.toFixed(1)} km</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                            <span>Impact:</span>
                                            <span style="font-weight: bold;">${alert.severity.toUpperCase()}</span>
                                        </div>
                                        <div style="font-size: 9px; color: ${theme === 'dark' ? '#777' : '#999'}; margin-top: 6px;">Detection: ${alert.time}</div>
                                    </div>
                                </div>
                            `))
                        .addTo(map.current!);
                    markers.current.push(marker);
                }
            });
        };

        map.current.on('style.load', handleStyleLoad);
        if (map.current.isStyleLoaded()) handleStyleLoad();

        const latestWithCoords = alerts.find(a => a.coordinates && a.time === 'Just now');
        if (isSimulating && latestWithCoords && latestWithCoords.coordinates) {
            map.current.flyTo({
                center: latestWithCoords.coordinates as [number, number],
                zoom: 12,
                pitch: 60,
                bearing: -20,
                essential: true,
                speed: 1.2
            });
        }
    }, [alerts, isSimulating, currentStyle]);

    const toggle3D = () => {
        if (!map.current) return;
        const newPitch = is3D ? 0 : 60;
        map.current.easeTo({ pitch: newPitch, duration: 1000 });
        setIs3D(!is3D);
    };

    const zoomIn = () => map.current?.zoomIn();
    const zoomOut = () => map.current?.zoomOut();

    const flyToUser = () => {
        if (map.current && location) {
            map.current.flyTo({
                center: [location.lng, location.lat],
                zoom: 15,
                pitch: 45,
                essential: true
            });
        }
    };

    const categories = [
        { id: 'hospitals', label: 'Hospitals', icon: <Hospital className="w-3 h-3" /> },
        { id: 'power', label: 'Power', icon: <Zap className="w-3 h-3" /> },
        { id: 'shelter', label: 'Shelters', icon: <Home className="w-3 h-3" /> },
    ];

    return (
        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl transition-all duration-500">
            <div ref={mapContainer} className="h-full w-full" />

            {/* Google Maps Style Search Bar */}
            <div className="absolute top-4 left-4 z-20 w-80 max-w-[calc(100%-32px)]">
                <div className="relative group">
                    <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-opacity opacity-0 group-focus-within:opacity-100" />
                    <div className="flex items-center bg-card/95 backdrop-blur-xl border border-border shadow-xl rounded-full px-4 py-2 transition-all group-focus-within:shadow-2xl group-focus-within:ring-2 group-focus-within:ring-primary/20">
                        <Menu className="h-4 w-4 text-muted-foreground mr-3 cursor-pointer hover:text-foreground transition-colors" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search DERSDP Grid..."
                            className="border-none bg-transparent h-6 p-0 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/50 font-medium"
                        />
                        <div className="flex items-center gap-3 ml-2 border-l border-border pl-3">
                            <Search className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                            <div className="h-4 w-px bg-border/50" />
                            <Mic className="h-4 w-4 text-primary cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Category Chips */}
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-card/90 backdrop-blur-md border border-border rounded-full shadow-sm hover:shadow-md hover:bg-secondary transition-all text-[10px] font-bold uppercase tracking-tight whitespace-nowrap"
                        >
                            <span className="text-primary">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* HUD Status - Moved to bottom left */}
            <div className="absolute bottom-24 left-4 z-10 hidden sm:block">
                <div className="bg-card/90 backdrop-blur-md p-3 rounded-xl border border-border shadow-2xl w-48">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="h-3 w-3 text-primary animate-pulse" />
                        <h3 className="font-display text-[9px] uppercase font-bold tracking-widest text-foreground">System Status</h3>
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-success ring-2 ring-success/20 animate-pulse" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[8px] font-mono">
                            <span className="text-muted-foreground">LATENCY:</span>
                            <span className="text-success font-bold">12ms</span>
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-mono">
                            <span className="text-muted-foreground">SATELITES:</span>
                            <span className="text-primary">8 ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layer Selection - Bottom Left Toggle */}
            <div className="absolute bottom-6 left-4 z-20">
                <div className="relative">
                    <button
                        onClick={() => setShowStyles(!showStyles)}
                        className={`group flex items-center gap-2 p-1 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 ${showStyles ? 'ring-2 ring-primary/40' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50 relative">
                            {/* Visual Thumbnail based on current style */}
                            <div className={`absolute inset-0 bg-cover bg-center ${currentStyle === 'satellite' ? 'bg-[url(https://img.freepik.com/free-photo/satellite-view-earth_23-2148854901.jpg)]' : 'bg-primary/20'}`}>
                                <Layers className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                            </div>
                        </div>
                        <span className="pr-4 text-[10px] font-bold uppercase text-foreground tracking-tighter">Layers</span>
                    </button>

                    {showStyles && (
                        <div className="absolute bottom-14 left-0 flex gap-2 p-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                            {(Object.keys(MAP_STYLES) as Array<keyof typeof MAP_STYLES>).map((style) => (
                                <button
                                    key={style}
                                    onClick={() => {
                                        setCurrentStyle(style);
                                        setShowStyles(false);
                                    }}
                                    className={`flex flex-col items-center gap-1 group transition-all ${currentStyle === style ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`w-14 h-14 rounded-xl border-2 transition-all overflow-hidden ${currentStyle === style ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent'}`}>
                                        <div className={`w-full h-full bg-cover bg-center ${style === 'satellite' ? 'bg-[url(https://img.freepik.com/free-photo/satellite-view-earth_23-2148854901.jpg)]' : style === 'streets' ? 'bg-[url(https://img.freepik.com/free-vector/city-map-navigation-interface_23-2148301721.jpg)]' : 'bg-muted'}`} />
                                    </div>
                                    <span className="text-[8px] font-bold uppercase tracking-tighter">{style}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Map Action Controls - Bottom Right */}
            <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
                <div className="flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-primary/10 hover:text-primary border-b border-border/50" onClick={zoomIn}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-primary/10 hover:text-primary" onClick={zoomOut}>
                        <Minus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className={`h-9 w-9 rounded-xl shadow-xl border border-border bg-card/95 hover:bg-primary/20 hover:text-primary transition-all ${is3D ? 'text-primary ring-2 ring-primary/20' : ''}`}
                        onClick={toggle3D}
                    >
                        <span className="text-[10px] font-black italic">3D</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-xl shadow-xl border border-border bg-card/95 hover:bg-primary/20 hover:text-primary transition-all text-primary"
                        onClick={flyToUser}
                        title="Recenter Map"
                    >
                        <Compass className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Mini Overview - Top Right */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl shadow-xl border border-border bg-card/95 backdrop-blur-md opacity-80 hover:opacity-100 transition-opacity">
                    <Maximize className="h-4 w-4 text-foreground" />
                </Button>
                <div className="bg-card/90 backdrop-blur-md p-2 rounded-xl border border-border shadow-xl flex flex-col gap-2 scale-90 origin-top-right">
                    <div className="flex items-center gap-2 h-4 pr-2">
                        <div className="w-2 h-2 rounded-full bg-critical animate-ping" />
                        <span className="text-[8px] font-bold uppercase text-critical">{alerts.length} ALERTS</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapboxDetection;
