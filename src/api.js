'use strict'

const path = require('path')
const parser = require('luaparse')

class Api {
	constructor() {

	}

	async initialize () {

	}

	async upload(buffer) {
		const opts = {
			comments: false,
			encodingMode: 'pseudo-latin1'
		}
		const luaString = this.removeComments(buffer.toString())
		const data = parser.parse(luaString)
		const result = this.parseLuaData(data)
		//save to database
	}

	parseLuaData(data) {
		const result = {
			parseTimes: [],
			guilds: [],
			players: []
		}
		//parse time
		const datesArray = data.body[0].init[0].fields[0].value.fields[0].value.fields[0].value.fields
		for (let time of datesArray) {
			result.parseTimes.push(time.key.raw)
		}

		//guilds data
		const guildsData = data.body[2].init[0].fields
		for (let guild of guildsData) {
			let name = guild.value.fields[0].value.raw.replace(/"/g, '')
			const count = guild.value.fields[2].value.value
			if (name == "") {
				name = undefined //fix for unguilded
			}
			result.guilds.push( { name: name, size: count } )
		}

		//characters data
		const races = data.body[0].init[0].fields[3].value.fields[0].value.fields[0].value.fields
		for (let race of races) {
			const racename = race.key.raw
			const classes = race.value.fields
			for (let classname of classes) {
				const clname = classname.key.raw.replace(/"/g, '')
				const players = classname.value.fields
				for (let player of players) {
					let guild = player.value.fields[1].value.raw.replace(/"/g, '')
					if (guild === "") {
						guild = undefined
					}
					const playerData = {
						name: player.key.raw.replace(/"/g, ''),
						level: player.value.fields[0].value.value,
						guild: guild,
						lastSeen: player.value.fields[2].value.raw.replace(/"/g, ''),
						checksum: player.value.fields[3].value.value,
						class: clname,
						race: racename
					}
					result.players.push(playerData)
				}
			}
		}
		return result
	}

	removeComments (str) {
		return str.replace(/ -- \[\w{1,3}]/gm,'')
	}

}

module.exports = Api
