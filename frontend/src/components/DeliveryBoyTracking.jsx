import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline ,Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const deliveryBoyIcon = L.icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = L.icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data }) => {
  if (!data) {
    return <div>Map is loading...</div>;
  }

  const { deliveryBoyLocation, customerLocation } = data;

  const deliveryBoyPos = [
    deliveryBoyLocation.lat,
    deliveryBoyLocation.lon,
  ];

  const customerPos = [
    customerLocation.lat,
    customerLocation.lon,
  ];

return (
  /* 1. Ensure the wrapper handles overflow and layout */
  <div className="h-auto w-full bg-[#fff9f6] flex flex-col px-3 py-2 text-[15px]">
    
    {/* 2. Map Container: Removed w-screen/h-screen and added relative positioning */}
   <div className="w-full h-96 rounded-2xl overflow-hidden border relative z-0">
  {deliveryBoyPos && customerPos && (
    <MapContainer
      center={deliveryBoyPos}
      zoom={16}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={deliveryBoyPos} icon={deliveryBoyIcon}>
        <Popup >Delivery Boy</Popup>
      </Marker>

      <Marker position={customerPos} icon={customerIcon}>
        <Popup>Customer</Popup>
      </Marker>

      <Polyline positions={[deliveryBoyPos, customerPos]} />
    </MapContainer>
  )}
</div>

  </div>
);

};

export default DeliveryBoyTracking;
