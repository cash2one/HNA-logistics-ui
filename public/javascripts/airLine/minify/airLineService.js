app.factory("airLineService",["easyHttp",function(t){var e={};return e.getLanguage=function(e){return t.get("logistics.getInternational",e)},e.getAirportShort=function(e){return t.get("logistics.getAirportShort",e)},e.getCity=function(e){return t.get("logistics.getCity",e)},e.getAirPortListByCountryId=function(e){return t.get("logistics.getAirPortListByCountryId",e)},e.getCountry=function(e){return t.get("logistics.getCountry",e)},e.getLineType=function(e){return t.get("logistics.getLineType",e)},e.del=function(e,i){return t.post("logistics.deleteAirLine",e,i)},e.save=function(e,i){return t.post("logistics.saveAirLine",e,i)},e.saveEdit=function(e,i){return t.post("logistics.saveEditAirLine",e,i)},e.getDetail=function(e,i){return t.get("logistics.getAirLineDetail",e,i)},e.checkAirLineName=function(e,i){return t.get("logistics.checkAirLineName",e,i)},e.checkAirLineCode=function(e,i){return t.get("logistics.checkAirLineCode",e,i)},e}]);