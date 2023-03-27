import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import * as Cookies from "js-cookie";

import ReactDOM from "react-dom";
import {
  LoadScript,
  GoogleMap,
  Polygon,
  useGoogleMap,
  DrawingManager,
  MarkerF,
  InfoWindowF,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import CustomControls from "./CustomControls";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = { lat: 25.0014163, lng: -72.1208432 };

function PolygonMap(props = {}) {
  const history = useHistory();
  const location = useLocation();

  const { id,
    name,
    description,
    city,
    country,
    state,
    address1,
    zipcode,
    tenantLatitude,
    tenantLangitude,
    newsletterFrequency } = props

  const latArry = tenantLatitude?.split(",");
  const lngArry = tenantLangitude?.split(",");

  const latlng = latArry?.map((latItem, index) => {
    const lngItem = lngArry[index];
    return {
      lat: Number(latItem),
      lng: Number(lngItem),
    };
  });

  // Store Polygon path in state
  const [coords, setCoords] = useState([]);
  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);
  const coordsRef = useRef([]);
  const [drawingState, setDrawingState] = useState({
    drawingMode: "polygon",
  });
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const libraries = ["drawing", "places"];
  const [curLocation, setCurLocation] = useState({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState(null);
  const [searchBoxRef, setSearchBoxRef] = useState(null);
  const [searchLoc, setSearchLoc] = useState(null);

  const options = {
    drawingControl: false,
    drawingControlOptions: {
      drawingMode: ["Polygon"],
    },
    polygonOptions: {
      fillColor: "#2196F3",
      strokeColor: "#2196F3",
      fillOpacity: 0.5,
      strokeWeight: 2,
      clickable: true,
      editable: true,
      draggable: true,
      zindex: 1,
    },
  };

  useEffect(() => {
    if (tenantLatitude && tenantLatitude) {
      setCoords(latlng)
      coordsRef.current = latlng;
    } else {
      setCoords([])
    }
  }, [])

  const removeBoundary = () => {
    polygonRef.current.setMap(null);
    setCoords([]);
    coordsRef.current = [];
    if (props.getLatLng) {
      props.getLatLng({})
    }
  };
  const onSubmitBoundary = () => {
    const latlngData = coordsRef?.current;
    let req = new FormData()
    const lat = latlngData.map((item) => {
      return item.lat;
    });
    const lng = latlngData.map((item) => {
      return item.lng;
    });
    if (props.getLatLng && props.type === 'add') {
      props.getLatLng({ lat: lat, lng: lng })
      return
    }

    req.append("id", id)
    req.append("name", name)
    req.append("description", description)
    req.append("tenantLatitude", lat.toString())
    req.append("tenantLangitude", lng.toString())
    req.append("city", city)
    req.append("state", state)
    req.append("country", country)
    req.append("zipcode", zipcode)
    req.append("newsLetterFrequency", newsletterFrequency)
    req.append("address1", address1)

    axios
      .request({
        url: `http://dev.skopic.com:9090/skopicportal/jsonuser/updateTenantById`,
        method: "POST",
        data: req,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Set-Cookie": Cookies.get("JSESSIONID"),
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data && res.data.status === 'success') {
          props.onMapClose();
          history.go(0);
        }
      })
  };

  const controlButtonDiv = document.createElement('div');
  ReactDOM.render(<CustomControls onSubmitBoundary={onSubmitBoundary} removeBoundary={removeBoundary} coords={coordsRef.current} />
    , controlButtonDiv);

  // Call setCoords with new edited path
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setCoords(nextPath);
      coordsRef.current = nextPath;
    }
  }, [setCoords]);

  // Bind refs to current Polygon and listeners
  const onPolygonLoad = useCallback(
    (polygon) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polygonRef.current = null;
  }, []);


  const onPolygonComplete = (polygon) => {
    const polyArray = polygon.getPath().getArray();
    let paths = [];
    polyArray.forEach(function (path) {
      paths.push({ lat: path.lat(), lng: path.lng() });
    });
    polygon.setMap(null);
    setCoords(paths);
    coordsRef.current = paths;
    setShowInfoWindow(true);
  };

  const onMapLoad = (map) => {
    map.controls[window.google.maps.ControlPosition.LEFT_BOTTOM].push(controlButtonDiv);

    if (coords.length !== 0) {
      setCurLocation(coords[0]);
    } else {
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          const pos = { lat, lng };
          setCurLocation(pos);
        }
      );
      window.google?.maps.event.addListener(map, "bounds_changed", () => {
        console.log(map.getBounds());
        setBounds(map.getBounds());
      });
      setCoords([]);
    }

  };

  const onSearchBoxLoad = (ref) => {
    setSearchBoxRef(ref);
  };

  const onPlacesChanged = () => {
    setSearchLoc(searchBoxRef?.getPlaces());
    let results = searchBoxRef.getPlaces();
    const loc = results[0].geometry.location;
    const pos = {lat: loc.lat(), lng: loc.lng() }
    setCurLocation(pos);
  };


  return (
    <>
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyD73RTFYJm6Kxwer1CmpjqqNJAlRSifzVo"
        libraries={libraries}
        language="en"
        region="us"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={curLocation}
          zoom={5}
          onLoad={onMapLoad}
        >
          {coords.length === 0 && <StandaloneSearchBox
            onLoad={onSearchBoxLoad}
            onPlacesChanged={onPlacesChanged}
            bounds={bounds}
          >
            <input
              type="text"
              placeholder="Search location"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `40px`,
                padding: `12px 12px`,
                borderRadius: `2px`,
                boxShadow: `rgba(0, 0, 0, 0.3) 0px 1px 4px -1px`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                left: "50%",
                marginLeft: "-120px",
                marginTop: "10px",
              }}
            />
          </StandaloneSearchBox>}

          {coords.length === 0 ? (
            <DrawingManager
              drawingMode={drawingState.drawingMode}
              options={options}
              editable
              draggable
              onPolygonComplete={onPolygonComplete}
              onMouseUp={onEdit}
              onDragEnd={onEdit}
            />
          ) : (
            <Polygon
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                geodesic: true,
                editable: true,
              }}
              ref={polygonRef}
              editable
              path={coords}
              onLoad={onPolygonLoad}
              onUnmount={onUnmount}
              onMouseUp={onEdit}
              onDragEnd={onEdit}
            >
              {showInfoWindow && (
                <InfoWindowF
                  position={center}
                  zIndex="10"
                  onCloseclick={(e) => setShowInfoWindow(false)}
                  options={{ maxWidth: 300 }}
                >
                  content here
                </InfoWindowF>
              )}
            </Polygon>
          )}
          <MarkerF
            position={curLocation}
          // onClick={(e) => setShowInfoWindow(true)}
          />

        </GoogleMap>
      </LoadScript>
    </>
  );
}

export default PolygonMap;