ESX = nil
playerList = {}
-- ESX
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)


ESX.RegisterServerCallback('police_tablet:getCarListFromName', function(source,cb,fullname,playerList)
	local data = {}
	MySQL.Async.fetchAll("SELECT * FROM users WHERE concat_ws(' ',LOWER(firstname),LOWER(lastname)) LIKE @text LIMIT 1",{['@text'] = "%"..fullname.."%"}, function(result)	
		if #result == 0 then
			cb("Sonuç Bulunamadı!")
		else
			data ={fullname = result[1].firstname..' '..result[1].lastname,
			cars = {},
			billings={}}
					
			MySQL.Async.fetchAll("SELECT * FROM owned_vehicles WHERE owner = @owner",{['@owner'] = result[1].identifier}, function(carList)
				if carList ~= nil then
					data.cars = carList
				end
				MySQL.Async.fetchAll("SELECT * FROM billing WHERE identifier = @owner",{['@owner'] = result[1].identifier}, function(billingList)
					if carList ~= nil then
						for k,v in pairs(billingList) do
						v.sender = getPlayerName(v.sender,playerList)
						end
						data.billings = billingList
					end
					cb(data)
				end)
			end)
		end
	end)
end)

function getPlayerName(identifier,players)
	for k,v in pairs(players) do
		if v.identifier == identifier then
			return v.firstname..' '..v.lastname
		end
	end
end
ESX.RegisterServerCallback('police_tablet:getAllPlayers', function(source,cb)
	MySQL.Async.fetchAll("SELECT * FROM users", {}, function (result)
        cb(result)
	end)
end)

ESX.RegisterServerCallback('police_tablet:getAllFines', function(source,cb,type)
	MySQL.Async.fetchAll("SELECT * FROM fine_types WHERE category = @type ", {['@type']=type}, function (result)
        cb(result)
	end)
end)


ESX.RegisterServerCallback('police_tablet:openTablet', function(source,cb)
	local xPlayer = ESX.GetPlayerFromId(source)
	local playerJob = xPlayer.getJob().name
	if playerJob == "police" then
		cb(true)
	else
		cb(false)
	end
end)

RegisterServerEvent('police_tablet:removeBill')
AddEventHandler('police_tablet:removeBill', function(id)

      MySQL.Async.execute('DELETE FROM billing WHERE id = @id',
      {
        ['@id']    = id
      }
    )
end)

ESX.RegisterServerCallback('police_tablet:getCarListFromPlate', function(source,cb,plate,playerList)
	local data = {}
	MySQL.Async.fetchAll("SELECT * FROM owned_vehicles WHERE plate = @plate LIMIT 1",{['@plate'] = plate}, function(result)
		if #result == 0 then
			cb("Sonuç Bulunamadı!")
		else
			data ={fullname = '',
			cars = result,
			billings={}}
			MySQL.Async.fetchAll("SELECT * FROM users WHERE identifier = @owner LIMIT 1",{['@owner'] = result[1].owner}, function(userList)
				if userList ~= nil then
					data.fullname = userList[1].firstname..' '..userList[1].lastname
				end
				MySQL.Async.fetchAll("SELECT * FROM billing WHERE identifier = @owner",{['@owner'] = result[1].owner}, function(billingList)
					if billingList ~= nil then
						for k,v in pairs(billingList) do
							v.sender = getPlayerName(v.sender,playerList)
						end
							data.billings = billingList
					end
					cb(data)
				end)
			end)
		end
	end)
end)



