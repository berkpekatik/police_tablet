


local tablet = false
local tabletDict = "amb@code_human_in_bus_passenger_idles@female@tablet@base"
local tabletAnim = "base"
local tabletProp = `prop_cs_tablet`
local tabletBone = 60309
local tabletOffset = vector3(0.03, 0.002, -0.0)
local tabletRot = vector3(10.0, 160.0, 0.0)

function ToggleTablet(toggle)
    if toggle and not tablet then
        tablet = true

        Citizen.CreateThread(function()
            RequestAnimDict(tabletDict)

            while not HasAnimDictLoaded(tabletDict) do
                Citizen.Wait(150)
            end

            RequestModel(tabletProp)

            while not HasModelLoaded(tabletProp) do
                Citizen.Wait(150)
            end

            local playerPed = PlayerPedId()
            local tabletObj = CreateObject(tabletProp, 0.0, 0.0, 0.0, true, true, false)
            local tabletBoneIndex = GetPedBoneIndex(playerPed, tabletBone)

            SetCurrentPedWeapon(playerPed, `weapon_unarmed`, true)
            AttachEntityToEntity(tabletObj, playerPed, tabletBoneIndex, tabletOffset.x, tabletOffset.y, tabletOffset.z, tabletRot.x, tabletRot.y, tabletRot.z, true, false, false, false, 2, true)
            SetModelAsNoLongerNeeded(tabletProp)

            while tablet do
                Citizen.Wait(100)
                playerPed = PlayerPedId()

                if not IsEntityPlayingAnim(playerPed, tabletDict, tabletAnim, 3) then
                    TaskPlayAnim(playerPed, tabletDict, tabletAnim, 3.0, 3.0, -1, 49, 0, 0, 0, 0)
                end
            end

            ClearPedSecondaryTask(playerPed)

            Citizen.Wait(450)

            DetachEntity(tabletObj, true, false)
            DeleteEntity(tabletObj)
        end)
    elseif not toggle and tablet then
        tablet = false
    end
end


ESX = nil 

Citizen.CreateThread(function()
    while ESX == nil do
        Citizen.Wait(10)

        TriggerEvent("esx:getSharedObject", function(obj)
            ESX = obj
        end)
    end
end)

RegisterCommand("tablet", function()
	ESX.TriggerServerCallback("police_tablet:openTablet", function(canOpen) 
		if canOpen then
			ToggleTablet(not tablet)
			SetDisplay(tablet)
		end
	end)
end)



Citizen.CreateThread(function()
	while true do
	Citizen.Wait(0)
		if IsControlJustReleased(0,56) and IsInputDisabled(0) then
			ESX.TriggerServerCallback("police_tablet:openTablet", function(canOpen) 
				if canOpen then
					ToggleTablet(not tablet)
					SetDisplay(true)
				end
			end)
			Citizen.Wait(550)
		end
	end
end)

function SetDisplay(bool)
    tablet = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool,
    })
end

RegisterNUICallback("closeButton", function(data)
    SetNuiFocus(false, false)
    SetDisplay(false)
	ToggleTablet(false)
end)

RegisterNUICallback("searchButton", function(data,cb)
	if data.value == "1" then
		ESX.TriggerServerCallback("police_tablet:getAllPlayers", function(playerList) 
			ESX.TriggerServerCallback("police_tablet:getCarListFromName", function(result)
				  cb(result)                     
			end,string.lower(data.name),playerList)
		end)
	elseif data.value == "2" then
		ESX.TriggerServerCallback("police_tablet:getAllPlayers", function(playerList) 
			ESX.TriggerServerCallback("police_tablet:getCarListFromPlate", function(result)
				  cb(result)                     
			end,data.name,playerList)
		end)
	end
	
end)

Citizen.CreateThread(function()
    while tablet do
        Citizen.Wait(0)
        DisableControlAction(0, 1, tablet)
        DisableControlAction(0, 2, tablet)
        DisableControlAction(0, 142, tablet)
        DisableControlAction(0, 18, tablet)
        DisableControlAction(0, 322, tablet)
        DisableControlAction(0, 106, tablet)
    end
end)

RegisterNUICallback("crimePageGetAll", function(data,cb)
		ESX.TriggerServerCallback("esx_qalle_brottsregister:getall", function(result)
			 cb(result)                     
		end,data,1)
end)

RegisterNUICallback("warrantPageGetAll", function(data,cb)
		ESX.TriggerServerCallback("esx_qalle_brottsregister:getall", function(result)
			 cb(result)                     
		end,0,2)
end)

RegisterNUICallback("sendPenal", function(data,cb)
		TriggerServerEvent("esx_billing:sendBillFromTablet",data.id,'society_police',data.label,data.amount)
end)
RegisterNUICallback("removeBill", function(data,cb)
		TriggerServerEvent("police_tablet:removeBill",data)
end)

RegisterNUICallback("getAllFines", function(data,cb)
		ESX.TriggerServerCallback("police_tablet:getAllFines", function(result)
			 cb(result)                     
		end,data)
end)

RegisterNUICallback("crimePageAdd", function(data,cb)
		print(json.encode(data))
		TriggerServerEvent("esx_qalle_brottsregister:add",data[1].value,data[2].value,data[3].value)
end)

RegisterNUICallback("crimePageRemove", function(data,cb)
		TriggerServerEvent("esx_qalle_brottsregister:remove",data)
end)

RegisterNUICallback("crimePageUpdate", function(data,cb)
 print(data.id)
 print(data.text)
		TriggerServerEvent("esx_qalle_brottsregister:update",data.id,data.text)
end)

RegisterNUICallback("getPlayers", function(data,cb)
		ESX.TriggerServerCallback("police_tablet:getAllPlayers", function(playerList) 
			cb(playerList) 
		end)
end)
