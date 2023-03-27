import { useSelector, useDispatch } from 'react-redux'



const base = { lat: 39, lng: -100 };

export default function GetMarkers() {
  const nearByCommuntysData = useSelector((state) => state.mapReducer.nearByCommunitysData)
  // console.log(nearByCommuntysData)
  const countrylistdata = [];
  const countrylistdata1 = [];

  const markers = [];

  if (nearByCommuntysData && Object.keys(nearByCommuntysData).length > 0) {
    console.log(nearByCommuntysData)
    if (nearByCommuntysData) {
      //   Object.entries(nearByCommuntysData.physicalTenantIds).map(subitem2 => {
      //     // console.log(subitem1[1])
      //     countrylistdata.push({
      //       id: subitem2[1],
      // title: "marker: " + subitem2[1]

      //     })
      //   })
      // Object.entries(nearByCommuntysData).map(item => {
      Object.entries(nearByCommuntysData.tenantNeighberLags).map(subitem => {
        // console.log(subitem[1])
        countrylistdata.push({
          lng: subitem[1]
        })
      })
      Object.entries(nearByCommuntysData.tenantNeighberLats).map(subitem1 => {
        // console.log(subitem1[1])
        countrylistdata1.push({
          lat: subitem1[1]
        })
      })

    }
  }

  const singlelangitudesarray = [];
  const muptiplelangitudesarray = [];
  const singlelatitudearray = [];
  const muptiplelatitudesarray = [];
  if (nearByCommuntysData) {
    countrylistdata.map(subitem => {
      // console.log(subitem.lng.length)
      if (subitem.lng.length === 1) {
        singlelangitudesarray.push({
          lng: subitem.lng
        })
      }
      else {
        muptiplelangitudesarray.push({
          lng: subitem.lng
        })
      }

    })
    countrylistdata1.map(subitem => {
      if (subitem.lat.length === 1) {
        singlelatitudearray.push({
          lat: subitem.lat
        })
      }
      else {
        muptiplelatitudesarray.push({
          lat: subitem.lat
        })
      }

    })


    console.log(singlelatitudearray)
    console.log(muptiplelatitudesarray)
  }
  const cnt = 3;
  //   if(nearByCommuntysData)
  //   {
  // const markers = [];
  //   var newarray = nearByCommuntysData.map(getCommunitysData)

  //   const getCommunitysData=(result)=>{
  //     markers.push({
  //           id: result.physicalTenantCountryId,
  //           title: "marker: " + result.physicalTenantList,
  //           lat: result.physicalLats,
  //           lng: result.physicalLags
  //         });
  //         return markers;
  //   }
  // }
  for (let i = 1; i < cnt + 1; i++) {
    markers.push({
      id: i,
      title: "marker: " + i,
      lat: base.lat + 1.4 * i,
      lng: base.lng + 1.4 * i
    });
  }
  // console.log(markers)
  return markers;
}

