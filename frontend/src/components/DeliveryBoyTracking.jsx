import React, { useEffect } from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Polyline, Popup, useMap  } from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data }) => {
  const deliveryBoyLat = data.deliveryBoyLocation.lat;
  const deliveryBoyLon = data.deliveryBoyLocation.lon;
  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];


  const AutoFollow = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lon) {
      map.flyTo([lat, lon], map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [lat, lon]);

  return null;
};


  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer center={center} zoom={13} className="w-full h-full">
        <AutoFollow lat={deliveryBoyLat} lon={deliveryBoyLon} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[deliveryBoyLat, deliveryBoyLon]}
          icon={deliveryBoyIcon}
        >
          <Popup>Delivery Boy</Popup>
        </Marker>
        <Marker
          position={[customerLat, customerLon]}
          icon={customerIcon}
        >
          <Popup>Customer</Popup>
        </Marker>
        {path && (
  <Polyline positions={path} color="blue" weight={4} />
)}
        
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
