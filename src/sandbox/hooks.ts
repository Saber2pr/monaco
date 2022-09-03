/*
 * @Author: saber2pr
 * @Date: 2020-04-30 14:32:56
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-03 15:23:32
 */
import { KEYS } from '../constants'

export const ConsoleHook = `<script data-type="${KEYS.__SANDBOX_HOOK__}">
;(() => {
	// hook
	var origin_log = console.log
	console.log = function() {
		origin_log.apply(this, arguments)
		var output = Array.from(arguments).join(" ")
		parent.postMessage({method: "${KEYS.__MESSAGE_CONSOLE__}", value: output}, parent.location.origin)
	}
	self.addEventListener('error', event => {
		parent.postMessage({method: "${KEYS.__MESSAGE_CONSOLE_ERROR__}", value: event.message}, parent.location.origin)
	})
	self.addEventListener('message', event => {
		var data = event.data
		if(data && data.method === "${KEYS.__MESSAGE_CONSOLE_EXEC__}") {
			var result = self.eval(decodeURI(data.value))
			parent.postMessage({method: "${KEYS.__MESSAGE_CONSOLE__}", value: String(result)}, parent.location.origin)
		}
	})
})()</script>`
