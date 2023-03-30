import { useSelector, useDispatch } from 'react-redux'

const base = { lat: 39, lng: -100 };

export default function GetMarkers() {
  const nearByCommuntysData = useSelector((state) => state.mapReducer.getNearByCommunitysData)
  const latsData = [];
  const lngsData = [];

  nearByCommuntysData.tenantNeighberLats.map((subitem) => {
    if (subitem.length > 1) {
      latsData.push(subitem[0]);
    } else {
      latsData.push(...subitem)
    }
  })

  nearByCommuntysData.tenantNeighberLags.map((subitem) => {
    if (subitem.length > 1) {
      lngsData.push(subitem[0]);
    } else {
      lngsData.push(...subitem)
    }
  })

  const markers = latsData.map((item, idx) => {
    return ({
      lat: item,
      lng: lngsData[idx]
    })
  });

  return markers;
}

