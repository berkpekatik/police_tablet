# police_tablet
Required
es_extended<br>
esx_criminalrecord<br>
esx_billing<br>
Firstly you need to add this code in esx_billing server.lua
```RegisterServerEvent('esx_billing:sendBillFromTablet')
AddEventHandler('esx_billing:sendBillFromTablet', function(playerId, sharedAccountName, label, amount)
	local xPlayer = ESX.GetPlayerFromId(source)
	local xTarget = ESX.GetPlayerFromIdentifier(playerId)
	amount = ESX.Math.Round(amount)
	if amount > 0 and xTarget then
		TriggerEvent('esx_addonaccount:getSharedAccount', sharedAccountName, function(account)
			if account then
				MySQL.Async.execute('INSERT INTO billing (identifier, sender, target_type, target, label, amount) VALUES (@identifier, @sender, @target_type, @target, @label, @amount)', {
					['@identifier'] = xTarget.identifier,
					['@sender'] = xPlayer.identifier,
					['@target_type'] = 'society',
					['@target'] = sharedAccountName,
					['@label'] = label,
					['@amount'] = amount
				}, function(rowsChanged)
					xTarget.showNotification(_U('received_invoice'))
				end)
			else
				MySQL.Async.execute('INSERT INTO billing (identifier, sender, target_type, target, label, amount) VALUES (@identifier, @sender, @target_type, @target, @label, @amount)', {
					['@identifier'] = xTarget.identifier,
					['@sender'] = xPlayer.identifier,
					['@target_type'] = 'player',
					['@target'] = xPlayer.identifier,
					['@label'] = label,
					['@amount'] = amount
				}, function(rowsChanged)
					xTarget.showNotification(_U('received_invoice'))
				end)
			end
		end)
	else
		if account then
				MySQL.Async.execute('INSERT INTO billing (identifier, sender, target_type, target, label, amount) VALUES (@identifier, @sender, @target_type, @target, @label, @amount)', {
					['@identifier'] = playerId,
					['@sender'] = xPlayer.identifier,
					['@target_type'] = 'society',
					['@target'] = sharedAccountName,
					['@label'] = label,
					['@amount'] = amount
				}, function(rowsChanged)
				end)
			else
				MySQL.Async.execute('INSERT INTO billing (identifier, sender, target_type, target, label, amount) VALUES (@identifier, @sender, @target_type, @target, @label, @amount)', {
					['@identifier'] = playerId,
					['@sender'] = xPlayer.identifier,
					['@target_type'] = 'player',
					['@target'] = xPlayer.identifier,
					['@label'] = label,
					['@amount'] = amount
				}, function(rowsChanged)
				end)
			end
	end
end) 
```

and then change the all esx_criminalrecords server.lua

``` ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

RegisterServerEvent('esx_qalle_brottsregister:add')
AddEventHandler('esx_qalle_brottsregister:add', function(identifier,type, reason)
  --local identifier = ESX.GetPlayerFromId(id).identifier
  local sender = ESX.GetPlayerFromId(source).identifier
  local date = os.date("%x %X")
  local currentTimeInSeconds = os.time()
  local timeAgo = 7 * 24 * 60 * 60 --aded seven days
  local endofcrime = os.date("%x %X", currentTimeInSeconds + timeAgo)
  MySQL.Async.fetchAll(
    'SELECT firstname, lastname FROM users WHERE identifier = @identifier',{['@identifier'] = identifier},
    function(resultFrom) 
   MySQL.Async.fetchAll(
    'SELECT firstname, lastname FROM users WHERE identifier = @sender',{['@sender'] = sender},
    function(resultSender)
    if resultFrom[1] ~= nil and resultSender[1] ~= nil then
      MySQL.Async.execute('INSERT INTO qalle_brottsregister (identifier, sender, senderfirstname, senderlastname, firstname, lastname, dateofcrime, endofcrime, crime, type) VALUES (@identifier, @sender, @senderfirstname, @senderlastname,@firstname, @lastname, @dateofcrime, @endofcrime, @crime,@type)',
        {
          ['@identifier']   = identifier,
          ['@sender']   = sender,
          ['@firstname']    = resultFrom[1].firstname,
          ['@lastname']     = resultFrom[1].lastname,
          ['@senderfirstname']    = resultSender[1].firstname,
          ['@senderlastname']     = resultSender[1].lastname,
          ['@dateofcrime']  = date,
          ['@endofcrime']  = endofcrime,
          ['@crime']        = reason,
          ['@type']        = type,
        }
      )
    end
  end)
 end)
end)


--gets brottsregister
ESX.RegisterServerCallback('esx_qalle_brottsregister:getall', function(source, cb, identifier,type)
  --local identifier = ESX.GetPlayerFromId(target).identifier
 -- local name = getIdentity(target)
 if type == "2" then
	MySQL.Async.fetchAll("SELECT * FROM qalle_brottsregister WHERE type = @type",
	  {
		['@type'] = type
	  },
	  function(result)
		  cb(result)
	  end)
 else
	 MySQL.Async.fetchAll("SELECT * FROM qalle_brottsregister WHERE identifier = @identifier AND type = @type",
	  {
		['@identifier'] = identifier,
		['@type'] = type
	  },
	  function(result)
		if identifier ~= nil then
		  cb(result)
		end
	  end)
 end
end)

RegisterServerEvent('esx_qalle_brottsregister:remove')
AddEventHandler('esx_qalle_brottsregister:remove', function(id)
  --local identifier = ESX.GetPlayerFromId(id).identifier

      MySQL.Async.execute('DELETE FROM qalle_brottsregister WHERE id = @id',
      {
        ['@id']    = id
      }
    )
end)

RegisterServerEvent('esx_qalle_brottsregister:update')
AddEventHandler('esx_qalle_brottsregister:update', function(id, crime)
  MySQL.Async.execute('UPDATE qalle_brottsregister SET crime = @crime WHERE id = @id',
        {
          ['@id']    = id,
          ['@crime'] = crime
        }
      )
	  
end)
```
use this sql
```
CREATE TABLE IF NOT EXISTS `qalle_brottsregister` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `sender` varchar(50) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `firstname` varchar(255) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `senderfirstname` varchar(255) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `senderlastname` varchar(255) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `lastname` varchar(255) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT '1',
  `dateofcrime` varchar(255) NOT NULL,
  `endofcrime` varchar(255) NOT NULL,
  `crime` varchar(255) CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=latin1;
```
![image](/pics/1.jpg)
![image](/pics/2.jpg)
![image](/pics/3.jpg)
![image](/pics/4.jpg)
![image](/pics/5.jpg)
![image](/pics/6.jpg)
![image](/pics/7.jpg)
![image](/pics/8.jpg)
![image](/pics/9.jpg)
