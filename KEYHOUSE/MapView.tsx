import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../lib/utils';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

interface Props {
  markers?: MapMarker[];
  activeId?: string | null;
  onMarkerClick?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  onPick?: (lat: number, lng: number) => void;
  circle?: { lat: number; lng: number; radius: number } | null;
  fit?: boolean;
}

const TILES = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export default function MapView({
  markers = [],
  activeId = null,
  onMarkerClick,
  center = [-25.9655, 32.5832],
  zoom = 12,
  className,
  onPick,
  circle = null,
  fit = true,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const clickRef = useRef(onMarkerClick);
  const pickRef = useRef(onPick);

  useEffect(() => {
    clickRef.current = onMarkerClick;
    pickRef.current = onPick;
  });

  // Inicialização
  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { center, zoom, scrollWheelZoom: false, zoomControl: true });
    L.tileLayer(TILES, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on('click', (e: L.LeafletMouseEvent) => pickRef.current?.(e.latlng.lat, e.latlng.lng));
    map.current = m;
    const t = setTimeout(() => m.invalidateSize(), 80);
    return () => {
      clearTimeout(t);
      m.remove();
      map.current = null;
      layer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marcadores
  const markerKey = markers.map((m) => `${m.id}:${m.lat}:${m.lng}:${m.label ?? ''}`).join('|');
  const circleKey = circle ? `${circle.lat}:${circle.lng}:${circle.radius}` : '';
  useEffect(() => {
    const m = map.current;
    const lg = layer.current;
    if (!m || !lg) return;
    lg.clearLayers();
    markers.forEach((mk) => {
      const isActive = mk.id === activeId;
      const html = mk.label ? `<div class="kh-pin${isActive ? ' active' : ''}">${mk.label}</div>` : '<div class="kh-dot"></div>';
      const icon = L.divIcon({ className: 'kh-icon', html, iconSize: [0, 0], iconAnchor: [0, 0] });
      const marker = L.marker([mk.lat, mk.lng], { icon, zIndexOffset: isActive ? 1000 : 0, keyboard: false });
      marker.on('click', () => clickRef.current?.(mk.id));
      marker.addTo(lg);
    });
    if (circle) {
      L.circle([circle.lat, circle.lng], {
        radius: circle.radius,
        color: '#C69C4E',
        weight: 1.5,
        fillColor: '#D6B46C',
        fillOpacity: 0.2,
      }).addTo(lg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey, activeId, circleKey]);

  // Enquadramento
  const idsKey = markers.map((m) => m.id).join('|');
  useEffect(() => {
    const m = map.current;
    if (!m || !fit) return;
    if (markers.length > 1) {
      m.fitBounds(L.latLngBounds(markers.map((x) => [x.lat, x.lng] as [number, number])), { padding: [56, 56], maxZoom: 14 });
    } else if (markers.length === 1) {
      m.setView([markers[0].lat, markers[0].lng], zoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, fit]);

  // Centro controlado (modo picker / detalhe)
  const centerKey = `${center[0]}:${center[1]}:${zoom}`;
  useEffect(() => {
    const m = map.current;
    if (!m || (fit && markers.length > 0)) return;
    m.setView(center, zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerKey]);

  return <div ref={el} className={cn('relative z-0 overflow-hidden', onPick && 'cursor-crosshair', className)} />;
}
